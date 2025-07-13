import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PopularItem from '@/models/popular-item';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const popularItems = await PopularItem.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(popularItems);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('Received popular item data:', body);
    
    // Validate required fields with proper trimming
    const trimmedName = body.name?.trim();
    const trimmedDescription = body.description?.trim();
    const trimmedImage = body.image?.trim();
    const trimmedDataAiHint = body.dataAiHint?.trim();
    
    if (!trimmedName || !trimmedDescription || !body.price || !trimmedImage || !trimmedDataAiHint) {
      const missingFields = [];
      if (!trimmedName) missingFields.push('name');
      if (!trimmedDescription) missingFields.push('description');
      if (!body.price) missingFields.push('price');
      if (!trimmedImage) missingFields.push('image');
      if (!trimmedDataAiHint) missingFields.push('dataAiHint');
      
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    const popularItemData = {
      ...body,
      name: trimmedName,
      description: trimmedDescription,
      image: trimmedImage,
      dataAiHint: trimmedDataAiHint,
    };
    
    const popularItem = new PopularItem(popularItemData);
    await popularItem.save();
    
    return NextResponse.json(popularItem, { status: 201 });
  } catch (error) {
    console.error('Error creating popular item:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create popular item' },
      { status: 500 }
    );
  }
} 