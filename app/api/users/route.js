import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // If no email query, return all users
    if (!email) {
      const users = await User.find()
        .select('-__v')
        .sort({ createdAt: -1 });
      return NextResponse.json(users);
    }

    // Search by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    const body = await request.json();
    
    await dbConnect();
    
    // If user is authenticated with Clerk
    if (user) {
      // Ensure required fields are present
      if (!body.email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      const dbUser = await User.findOneAndUpdate(
        { clerkId: user.id },
        { 
          clerkId: user.id,
          email: body.email,
          name: body.name || '',
          ...(body.lastOrderDetails && { lastOrderDetails: body.lastOrderDetails }),
          $setOnInsert: { createdAt: new Date() }
        },
        { 
          upsert: true, 
          new: true,
          runValidators: true 
        }
      );

      return NextResponse.json(dbUser);
    } 
    
    // For non-authenticated users
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      ...body,
      createdAt: new Date()
    });
    
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 