import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/review';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Clear existing reviews
    await Review.deleteMany({});
    
    const sampleReviews = [
      {
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@example.com',
        customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        review: 'Amazing food and excellent service! The butter chicken was absolutely delicious. Will definitely come back again.',
        category: 'food',
        isActive: true,
        isVerified: true,
        orderId: 'ORD-001',
      },
      {
        customerName: 'Rahul Kumar',
        customerEmail: 'rahul.kumar@example.com',
        customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4,
        review: 'Great ambiance and friendly staff. The biryani was flavorful and the portion size was perfect.',
        category: 'service',
        isActive: true,
        isVerified: true,
        orderId: 'ORD-002',
      },
      {
        customerName: 'Anjali Patel',
        customerEmail: 'anjali.patel@example.com',
        customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        review: 'The restaurant has such a warm and welcoming atmosphere. The food was fresh and the service was quick.',
        category: 'ambiance',
        isActive: true,
        isVerified: true,
        orderId: 'ORD-003',
      },
      {
        customerName: 'Vikram Singh',
        customerEmail: 'vikram.singh@example.com',
        customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 4,
        review: 'Excellent value for money. The food quality is consistently good and the staff is very professional.',
        category: 'overall',
        isActive: true,
        isVerified: true,
        orderId: 'ORD-004',
      },
      {
        customerName: 'Meera Reddy',
        customerEmail: 'meera.reddy@example.com',
        customerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        review: 'Best Indian restaurant in the area! The flavors are authentic and the presentation is beautiful.',
        category: 'food',
        isActive: true,
        isVerified: true,
        orderId: 'ORD-005',
      },
      {
        customerName: 'Arjun Mehta',
        customerEmail: 'arjun.mehta@example.com',
        customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        rating: 4,
        review: 'Very clean restaurant with great hygiene standards. The food was hot and fresh when served.',
        category: 'service',
        isActive: true,
        isVerified: true,
        orderId: 'ORD-006',
      },
    ];
    
    const reviews = await Review.insertMany(sampleReviews);
    
    return NextResponse.json({
      message: 'Sample reviews created successfully',
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error seeding reviews:', error);
    return NextResponse.json(
      { error: 'Failed to seed reviews' },
      { status: 500 }
    );
  }
} 