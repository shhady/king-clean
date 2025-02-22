import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Visitor from '@/app/models/Visitor';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { 
        $set: { 
          lastOrderDetails: body.lastOrderDetails,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!visitor) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(visitor);
  } catch (error) {
    console.error('Error updating visitor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 