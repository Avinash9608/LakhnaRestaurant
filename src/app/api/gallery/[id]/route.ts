import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import GalleryItem from '@/models/gallery-item';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const galleryItem = await GalleryItem.findById(params.id);
    
    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
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
    
    const galleryItem = await GalleryItem.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
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
    
    const galleryItem = await GalleryItem.findByIdAndDelete(params.id);
    
    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
} 