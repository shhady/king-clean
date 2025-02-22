import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { stock } = await request.json();
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: { stock } },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PUT /api/products/[id]/stock:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 