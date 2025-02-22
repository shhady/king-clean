import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/app/models/Category';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.nameAr) {
      return NextResponse.json(
        { error: 'Name in both Hebrew and Arabic is required' },
        { status: 400 }
      );
    }

    // Find the category and add the subcategory
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Add new subcategory
    category.subcategories.push({
      name: data.name,
      nameAr: data.nameAr
    });

    // Save the updated category
    await category.save();

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error adding subcategory:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add subcategory' },
      { status: 500 }
    );
  }
} 