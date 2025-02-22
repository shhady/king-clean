import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
          const products = await Product.find()
      .sort({ sales: -1 }) // Assuming you have a sales field
      .limit(4)
      .populate('category', 'name nameAr');

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular products' },
      { status: 500 }
    );
  }
} 