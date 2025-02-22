import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
    })
    .select('name nameAr stock _id')  // Only select needed fields
    .sort({ stock: 1 })
    .limit(10);  // Limit to 10 products
    
    if (!lowStockProducts) {
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(lowStockProducts, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/products/low-stock:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 