import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';
import Category from '@/app/models/Category';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const inStock = searchParams.get('inStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    await dbConnect();

    const query = {};

    // Add search functionality - only match names
    if (search?.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { nameAr: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'priceAsc':
        sort = { price: 1 };
        break;
      case 'priceDesc':
        sort = { price: -1 };
        break;
      case 'nameAsc':
        sort = { nameAr: 1 };
        break;
      case 'nameDesc':
        sort = { nameAr: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .select('name nameAr price images stock category description descriptionAr subcategory featuresHe featuresAr salePercentage unit unitAmount')
      .populate('category', 'name nameAr')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();


    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
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
    if (!data.subcategory) {
      delete data.subcategory;
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

    // Create product with validated data
    const productData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      unitAmount: parseFloat(data.unitAmount)
    };

    const product = await Product.create(productData);
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name nameAr');

    return NextResponse.json(populatedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 