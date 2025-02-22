import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';
import mongoose from 'mongoose';
import User from '@/app/models/User';
import Visitor from '@/app/models/Visitor';
import { headers } from 'next/headers';

// GET /api/orders - Get all orders with pagination and filtering
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    // const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    // Get orders with pagination and sorting
    const orders = await Order.find(query)
      .select('-paymentInfo.creditCard') // Exclude sensitive data
      .sort({ createdAt: -1 }) // Sort by newest first
      // .skip((page - 1) * limit)
      // .limit(limit);

    // Format the response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      customerInfo: order.customerInfo,
      items: order.items,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt
    }));

    return NextResponse.json({
      orders: formattedOrders,
      // pagination: {
      //   total,
      //   page,
      //   pages: Math.ceil(total / limit),
      // }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();
    const body = await request.json();
    const { items, total, customerInfo, paymentMethod, paymentInfo, customerId, customerType } = body;

    // Basic validation
    if (!items?.length || !customerInfo || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate customer info
    if (!customerInfo.fullName || !customerInfo.phone || 
        !customerInfo.address || !customerInfo.city || !customerInfo.email) {
      return NextResponse.json(
        { error: 'Missing customer information' },
        { status: 400 }
      );
    }

    // Format items for order
    const formattedItems = items.map(item => ({
      _id: item._id,
      name: item.name,
      nameAr: item.nameAr,
      price: item.price,
      quantity: item.quantity,
      image: item.images?.[0] || null
    }));

    // Create order data
    const orderData = {
      items: formattedItems,
      total,
      customerInfo,
      paymentMethod,
      customerType,
      customer: customerId,
      status: 'pending',
      ...(paymentInfo && { paymentInfo })
    };

    // Add payment info only if payment method is card
    if (paymentMethod === 'card') {
      if (!paymentInfo?.creditCard) {
        throw new Error('Missing card information');
      }
      
      // Store only last 4 digits of credit card
      const last4Digits = paymentInfo.creditCard.slice(-4);
      orderData.paymentInfo = {
        creditCard: `****-****-****-${last4Digits}`,
        expiryDate: paymentInfo.expiryDate
      };
    }

    // Create order
    const order = await Order.create([orderData], { session });

    // Add order to customer's orders array
    if (customerType === 'user') {
      await User.findByIdAndUpdate(
        customerId,
        { $push: { orders: order[0]._id } },
        { session }
      );
    } else {
      await Visitor.findByIdAndUpdate(
        customerId,
        { $push: { orders: order[0]._id } },
        { session }
      );
    }

    // Update product stock and sales
    for (const item of items) {
      const product = await Product.findById(item._id).session(session);
      
      if (!product) {
        throw new Error(`Product not found: ${item._id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // Update stock and sales
      product.stock -= item.quantity;
      product.sales = (product.sales || 0) + item.quantity;
      
      // Initialize salesHistory array if it doesn't exist
      if (!product.salesHistory) {
        product.salesHistory = [];
      }

      // Add to sales history
      product.salesHistory.push({
        quantity: item.quantity,
        orderId: order[0]._id
      });

      await product.save({ session });
    }

    // Get headers once at the start
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // Send confirmation emails
    try {
      // Send to customer
      await fetch(`${origin}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: order[0], type: 'customer' })
      });

      // Send to admin
      await fetch(`${origin}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: order[0], type: 'admin' })
      });
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Log more details about the error
      console.error('Email Error Details:', {
        message: emailError.message,
        order: order[0]._id,
        customerEmail: order[0].customerInfo.email
      });
    }

    // Commit the transaction
    await session.commitTransaction();

    return NextResponse.json({
      message: 'Order created successfully',
      orderId: order[0]._id
    }, { status: 201 });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
} 