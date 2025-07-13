import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/review';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const isVerified = searchParams.get('isVerified');
    
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (isVerified !== null) {
      query.isVerified = isVerified === 'true';
    }
    
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('Received review data:', body);
    
    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.review || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, review, and category are required' },
        { status: 400 }
      );
    }

    // Validate category enum
    const validCategories = ['food', 'service', 'ambiance', 'overall'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }
    
    const review = new Review(body);
    console.log('Created review object:', review);
    
    await review.save();
    console.log('Review saved successfully:', review._id);
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 