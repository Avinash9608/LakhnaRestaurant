'use server';

import dbConnect from '@/lib/db';
import UserModel from '@/models/user';
import { z } from 'zod';
import { sendVerificationEmail } from '@/lib/send-mail';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export async function registerAdmin(formData: unknown) {
  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await dbConnect();

    // Check if an admin already exists
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      return {
        success: false,
        message: 'An admin account already exists. Registration is closed.',
      };
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const newUser = new UserModel({
      name,
      email,
      password,
      role: 'admin',
      isVerified: false,
      otp,
      otpExpiry,
    });

    await newUser.save();

    const emailResponse = await sendVerificationEmail(email, otp);
    if (!emailResponse.success) {
      return {
        success: false,
        message: emailResponse.message,
      };
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email for a verification code.',
    };
  } catch (error) {
    console.error('Registration Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
