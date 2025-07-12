'use server';

import dbConnect from '@/lib/db';
import UserModel from '@/models/user';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const secret = new TextEncoder().encode(JWT_SECRET);

export async function login(formData: unknown) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await dbConnect();

    const user = await UserModel.findOne({ email, role: 'admin' }).select('+password');

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (!user.isVerified) {
      return { success: false, message: 'Account not verified. Please check your email.' };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password!);

    if (!isPasswordCorrect) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Create session
    const alg = 'HS256';

    const jwt = await new SignJWT({ userId: user._id, role: user.role })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .setSubject(user._id.toString())
      .sign(secret);

    cookies().set('session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

  } catch (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
  
  redirect('/dashboard');
}
