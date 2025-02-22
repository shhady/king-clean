import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // Find all products and sort by sales in descending order
    const products = await Product.find({})
      .select('name nameAr price sales')
      .sort({ sales: -1 })
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in /api/products/sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products sales data' },
      { status: 500 }
    );
  }
} 