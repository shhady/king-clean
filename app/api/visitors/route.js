import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Visitor from '@/app/models/Visitor';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Check if visitor already exists
    const existingVisitor = await Visitor.findOne({
      email: body.email.toLowerCase(),
      phone: body.phone
    });

    if (existingVisitor) {
      // Update existing visitor
      const updatedVisitor = await Visitor.findByIdAndUpdate(
        existingVisitor._id,
        {
          $set: {
            lastOrderDetails: {
              fullName: body.fullName,
              phone: body.phone,
              address: body.address,
              city: body.city
            }
          }
        },
        { new: true }
      );
      return NextResponse.json(updatedVisitor);
    }

    // Create new visitor
    const visitor = await Visitor.create({
      fullName: body.fullName,
      email: body.email.toLowerCase(),
      phone: body.phone,
      address: body.address,
      city: body.city,
      lastOrderDetails: {
        fullName: body.fullName,
        phone: body.phone,
        address: body.address,
        city: body.city
      }
    });

    return NextResponse.json(visitor);
  } catch (error) {
    console.error('Error creating/updating visitor:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    // If no query parameters, return all visitors
    if (!email && !phone) {
      const visitors = await Visitor.find()
        .select('-__v')
        .sort({ createdAt: -1 });
      return NextResponse.json(visitors);
    }

    // Search by email or phone
    const query = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = phone;

    const visitor = await Visitor.findOne(query);
    
    if (!visitor) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(visitor);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 