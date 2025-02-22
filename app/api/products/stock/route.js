import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function POST(request) {
  try {
    await dbConnect();
    const { productIds } = await request.json();

    const products = await Product.find(
      { _id: { $in: productIds } },
      'stock'
    );

    const stockLevels = products.reduce((acc, product) => {
      acc[product._id.toString()] = product.stock;
      return acc;
    }, {});

    return NextResponse.json(stockLevels);
  } catch (error) {
    console.error('Error fetching stock levels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock levels' },
      { status: 500 }
    );
  }
} 