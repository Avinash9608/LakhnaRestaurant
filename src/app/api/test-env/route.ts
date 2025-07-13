import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY ? '***' : undefined,
    apiSecret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
  });
} 