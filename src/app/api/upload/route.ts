import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary configuration first
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Cloudinary configuration is incomplete. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'gastronomic-gateway';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('Uploading to Cloudinary with config:', {
      cloudName: cloudName,
      folder: folder,
      fileType: file.type,
      fileSize: file.size
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 for more reliable upload
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary with timeout and better error handling
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Upload timeout - request took too long'));
      }, 60000); // 60 second timeout

      cloudinary.uploader.upload(
        dataURI,
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          timeout: 60000
        },
        (error, result) => {
          clearTimeout(timeout);
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result);
            resolve(result);
          }
        }
      );
    });

    return NextResponse.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      width: (result as any).width,
      height: (result as any).height,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 