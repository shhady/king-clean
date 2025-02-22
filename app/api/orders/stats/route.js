import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

// GET /api/orders/stats - Get order statistics
export async function GET(request) {
  try {
    const conn = await dbConnect();
    const db = conn.connection.db;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : new Date();

    // Get total stats
    const totalStats = await db.collection('orders').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]).toArray();

    // Get stats by status
    const statsByStatus = await db.collection('orders').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get daily stats
    const dailyStats = await db.collection('orders').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]).toArray();

    return NextResponse.json({
      total: totalStats[0] || { orders: 0, revenue: 0, avgOrderValue: 0 },
      byStatus: Object.fromEntries(
        statsByStatus.map(stat => [stat._id, stat.count])
      ),
      byDay: dailyStats
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب إحصائيات الطلبات' },
      { status: 500 }
    );
  }
} 