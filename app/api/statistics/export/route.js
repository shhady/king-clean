import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/app/models/Order';
import Product from '@/app/models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Fetch statistics data
    const orders = await Order.find()
      .select('-paymentInfo.creditCard')
      .sort({ createdAt: -1 });
      
    const products = await Product.find()
      .sort({ sales: -1 });

    // Format data for CSV
    const csvData = [
      // Headers
      ['Order ID', 'Customer Name', 'Total', 'Status', 'Date'].join(','),
      // Data rows
      ...orders.map(order => [
        order._id,
        order.customerInfo.fullName,
        order.total,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Create response with CSV data
    const response = new NextResponse(csvData);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', 'attachment; filename=statistics.csv');

    return response;
  } catch (error) {
    console.error('Error exporting statistics:', error);
    return NextResponse.json(
      { error: 'Failed to export statistics' },
      { status: 500 }
    );
  }
} 