import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/menu-item';

// GET - Fetch all menu items
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const menuItems = await MenuItem.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    console.log('Received menu item data:', body);
    
    // Validate required fields
    const { name, description, price, image, dataAiHint, ingredients, category, modelColor } = body;
    
    console.log('Extracted fields:', {
      name: !!name,
      description: !!description,
      price: !!price,
      image: !!image,
      dataAiHint: !!dataAiHint,
      category: !!category
    });
    
    if (!name?.trim() || !description?.trim() || !price || !image?.trim() || !dataAiHint?.trim() || !category?.trim()) {
      const missingFields = [];
      if (!name?.trim()) missingFields.push('name');
      if (!description?.trim()) missingFields.push('description');
      if (!price) missingFields.push('price');
      if (!image?.trim()) missingFields.push('image');
      if (!dataAiHint?.trim()) missingFields.push('dataAiHint');
      if (!category?.trim()) missingFields.push('category');
      
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Handle ingredients safely
    let processedIngredients = [];
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        processedIngredients = ingredients;
      } else if (typeof ingredients === 'string') {
        processedIngredients = ingredients.split(',').map((i: string) => i.trim()).filter((i: string) => i);
      }
    }
    
    const menuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      image,
      dataAiHint,
      ingredients: processedIngredients,
      category,
      modelColor: modelColor || '#3B82F6',
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
    });
    
    const savedMenuItem = await menuItem.save();
    
    return NextResponse.json(savedMenuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
} 