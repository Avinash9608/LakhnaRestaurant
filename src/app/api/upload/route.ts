import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary configuration first
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'lakhna_restaurant';

    if (!cloudName) {
      console.error('Missing Cloudinary cloud name');
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

    // Create form data for Cloudinary upload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('transformation', 'w_1200,h_800,c_limit,q_auto:good,f_auto');

    // Upload to Cloudinary using fetch
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload error:', errorText);
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${errorText}` },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('Cloudinary upload success:', result);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 