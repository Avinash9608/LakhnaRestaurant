import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/menu-item';

// GET - Fetch single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const menuItem = await MenuItem.findById(params.id).lean();
    
    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Validate id parameter
    if (!params.id) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const { name, description, price, image, dataAiHint, ingredients, category, modelColor } = body;
    
    if (!name || !description || !price || !image || !dataAiHint || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, image, dataAiHint, and category are required' },
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
    
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      params.id,
      {
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
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedMenuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const deletedMenuItem = await MenuItem.findByIdAndDelete(params.id);
    
    if (!deletedMenuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
} 