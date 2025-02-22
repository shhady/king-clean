import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Visitor from '@/app/models/Visitor';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Try to find user first
    const user = await User.findOne({ email })
      .populate('orders')
      .lean();

    if (user) {
      return NextResponse.json({ user });
    }

    // If no user found, try to find visitor
    const visitor = await Visitor.findOne({ email })
      .populate('orders')
      .lean();

    if (visitor) {
      return NextResponse.json({ visitor });
    }

    // Neither user nor visitor found
    return NextResponse.json(
      { error: 'No orders found for this email' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}