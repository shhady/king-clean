import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/app/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({})
      .select('name nameAr description descriptionAr image subcategories')
      .lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'nameAr', 'description', 'descriptionAr'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if category with same name exists
    const existingCategory = await Category.findOne({
      $or: [
        { name: data.name },
        { nameAr: data.nameAr }
      ]
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'קטגוריה עם שם זה כבר קיימת' },
        { status: 400 }
      );
    }

    // Validate subcategories if present
    if (data.subcategories?.length > 0) {
      for (const sub of data.subcategories) {
        if (!sub.name || !sub.nameAr) {
          return NextResponse.json(
            { error: 'All subcategories must have Hebrew and Arabic names' },
            { status: 400 }
          );
        }
      }
    }

    // Create category
    const category = await Category.create({
      ...data,
      subcategories: data.subcategories || []
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'קטגוריה עם שם זה כבר קיימת' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
} 