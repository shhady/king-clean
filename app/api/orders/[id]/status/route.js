import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/app/models/Order';
import { Resend } from 'resend';
import { getOrderStatusUpdateEmail } from '@/app/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { status } = await request.json();

    console.log('Updating order status:', { orderId: id, newStatus: status });

    // Update order status and get full order details
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean(); // Use lean() for better performance

    if (!order) {
      console.log('Order not found:', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Order updated successfully:', {
      orderId: order._id,
      status: order.status,
      customerEmail: order.customerInfo.email
    });

    // Send status update email
    try {
      const { subject, html } = getOrderStatusUpdateEmail(order);
      
      console.log('Sending status update email to:', order.customerInfo.email);
      
      const emailResponse = await resend.emails.send({
        from: 'Prague Crystal <onboarding@resend.dev>',
        to: order.customerInfo.email,
        subject,
        html,
        tags: [{ name: 'statusUpdate' }]
      });

      console.log('Email sent successfully:', emailResponse);
    } catch (emailError) {
      console.error('Error sending status update email:', {
        error: emailError.message,
        orderId: order._id,
        customerEmail: order.customerInfo.email
      });
      
      if (emailError.response) {
        console.error('Resend API Error:', emailError.response.data);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', {
      error: error.message,
      orderId: params.id
    });
    return NextResponse.json(
      { error: 'Failed to update order status', details: error.message },
      { status: 500 }
    );
  }
} 