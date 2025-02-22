import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
// import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
// import Order from '@/app/models/Order';
import Visitor from '@/app/models/Visitor';
export async function GET() {
  try {
    await dbConnect();

    // Get all users with populated orders
    const users = await User.find()
      .populate('orders')
      .select('-__v')
      .sort({ createdAt: -1 });

    // Get all visitors with populated orders (assuming Visitor model exists)
    const visitors = await Visitor.find()
      .populate('orders')
      .select('-__v')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users,
      visitors
    });

  } catch (error) {
    console.error('Error fetching users and visitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users and visitors' },
      { status: 500 }
    );
  }
}

