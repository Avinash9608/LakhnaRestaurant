import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PopularItem from '@/models/popular-item';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const popularItem = await PopularItem.findById(params.id);
    
    if (!popularItem) {
      return NextResponse.json(
        { error: 'Popular item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(popularItem);
  } catch (error) {
    console.error('Error fetching popular item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('Updating popular item data:', body);
    
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
    
    const updateData = {
      ...body,
      name: trimmedName,
      description: trimmedDescription,
      image: trimmedImage,
      dataAiHint: trimmedDataAiHint,
    };
    
    const popularItem = await PopularItem.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!popularItem) {
      return NextResponse.json(
        { error: 'Popular item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(popularItem);
  } catch (error) {
    console.error('Error updating popular item:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update popular item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const popularItem = await PopularItem.findByIdAndDelete(params.id);
    
    if (!popularItem) {
      return NextResponse.json(
        { error: 'Popular item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Popular item deleted successfully' });
  } catch (error) {
    console.error('Error deleting popular item:', error);
    return NextResponse.json(
      { error: 'Failed to delete popular item' },
      { status: 500 }
    );
  }
} 