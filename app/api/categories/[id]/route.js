import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/app/models/Category';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
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

    // Check if category with same name exists (excluding current category)
    const existingCategory = await Category.findOne({
      _id: { $ne: id },
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

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        image: data.image,
        subcategories: data.subcategories || []
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'קטגוריה עם שם זה כבר קיימת' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
} 