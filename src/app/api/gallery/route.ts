import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import GalleryItem from '@/models/gallery-item';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const galleryItems = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.altText || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, altText, and imageUrl are required' },
        { status: 400 }
      );
    }

    // Validate category enum
    const validCategories = ['food', 'restaurant', 'chef', 'ambiance'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }
    
    const galleryItem = new GalleryItem(body);
    await galleryItem.save();
    
    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
} 