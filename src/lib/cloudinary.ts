import { v2 as cloudinary } from 'cloudinary';

// Check if environment variables are available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary environment variables:', {
    cloudName: !!cloudName,
    apiKey: !!apiKey,
    apiSecret: !!apiSecret
  });
  console.error('Available environment variables:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '***' : undefined,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined
  });
  throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary; 