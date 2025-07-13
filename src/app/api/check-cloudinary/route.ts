import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cloudinaryConfig = {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '***' : undefined,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
    };

    const resolvedConfig = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
                process.env.CLOUDINARY_CLOUD_NAME || 
                'demo',
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
                   process.env.CLOUDINARY_UPLOAD_PRESET || 
                   'lakhna_restaurant',
    };

    return NextResponse.json({
      message: 'Cloudinary configuration check',
      config: cloudinaryConfig,
      resolved: resolvedConfig,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check Cloudinary configuration' },
      { status: 500 }
    );
  }
} 