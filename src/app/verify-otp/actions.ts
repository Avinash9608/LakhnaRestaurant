'use server';

import dbConnect from '@/lib/db';
import UserModel from '@/models/user';
import { z } from 'zod';

const otpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  otp: z.string().length(6, 'Verification code must be 6 digits.'),
});

export async function verifyOtp(formData: unknown) {
  const validatedFields = otpSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the inputs.',
    };
  }

  const { email, otp } = validatedFields.data;

  try {
    await dbConnect();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    if (user.isVerified) {
      return { success: true, message: 'Account is already verified.' };
    }

    const isOtpValid = user.otp === otp;
    const isOtpExpired = user.otpExpiry && new Date(user.otpExpiry) < new Date();

    if (isOtpExpired) {
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    if (!isOtpValid) {
      return { success: false, message: 'Invalid verification code.' };
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { success: true, message: 'Account verified successfully! You can now log in.' };
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during verification.',
    };
  }
}
