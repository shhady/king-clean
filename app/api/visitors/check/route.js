import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
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

    const visitor = await Visitor.findOne({ 
      email: email.toLowerCase() 
    });

    return NextResponse.json({ visitor });
  } catch (error) {
    console.error('Error checking visitor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 