import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/app/models/Order';

export async function GET() {
  try {
    await dbConnect();
    
    const orders = await Order.find()
      .select('-paymentInfo.creditCard')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Format the response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      customerInfo: order.customerInfo,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt
    }));

    return NextResponse.json({
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
} 