import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';
import { isValidObjectId } from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } =await params;

    const product = await Product.findById(id)
      .populate('category', 'name nameAr subcategories')
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'nameAr',
      'description',
      'descriptionAr',
      'price',
      'unit',
      'unitAmount',
      'category',
      'stock',
      'images'
    ];

    // Initialize optional arrays and fields if not provided
    data.featuresHe = data.featuresHe || [];
    data.featuresAr = data.featuresAr || [];
    data.salePercentage = data.salePercentage || 0;
    
    // Remove subcategory if it's empty
    if (!data.subcategory || data.subcategory === '') {
      data.subcategory = null;
    }

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(data.price) || data.price < 0) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    if (isNaN(data.unitAmount) || data.unitAmount < 0) {
      return NextResponse.json(
        { error: 'Invalid unit amount value' },
        { status: 400 }
      );
    }

    if (isNaN(data.stock) || data.stock < 0) {
      return NextResponse.json(
        { error: 'Invalid stock value' },
        { status: 400 }
      );
    }

    if (data.salePercentage && (isNaN(data.salePercentage) || data.salePercentage < 0 || data.salePercentage > 100)) {
      return NextResponse.json(
        { error: 'Invalid sale percentage value' },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Update product with validated data
    const productData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      unitAmount: parseFloat(data.unitAmount)
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    ).populate('category', 'name nameAr');

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 