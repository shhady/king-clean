import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/app/models/Order';

// GET /api/orders/[id] - Get order details
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'حالة الطلب غير صحيحة' },
        { status: 400 }
      );
    }

    const timelineEntry = {
      status: data.status,
      date: new Date(),
      note: data.note || getStatusNote(data.status)
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status: data.status,
          updatedAt: new Date()
        },
        $push: {
          timeline: timelineEntry
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    );
  }
}

// Update the valid statuses and status notes
const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

function getStatusNote(status) {
  switch (status) {
    case 'pending':
      return 'تم استلام الطلب';
    case 'processing':
      return 'جاري معالجة الطلب';
    case 'completed':
      return 'تم اكتمال الطلب';
    case 'cancelled':
      return 'تم إلغاء الطلب';
    default:
      return 'تم تحديث حالة الطلب';
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const result = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'cancelled',
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إلغاء الطلب' },
      { status: 500 }
    );
  }
}

// Update the PUT handler to handle status updates
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // If status is being updated, add to timeline
    if (body.status && validStatuses.includes(body.status)) {
      const timelineEntry = {
        status: body.status,
        date: new Date(),
        note: body.note || getStatusNote(body.status)
      };

      const order = await Order.findByIdAndUpdate(
        id,
        {
          $set: { 
            ...body,
            updatedAt: new Date()
          },
          $push: { timeline: timelineEntry }
        },
        { new: true }
      ).select('-paymentInfo.creditCard');

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    // Handle other updates
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).select('-paymentInfo.creditCard');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 