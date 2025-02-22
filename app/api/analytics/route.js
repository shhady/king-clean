import { NextResponse } from 'next/server';

export async function GET(request) {
  // This would normally come from a database
  const analytics = {
    overview: {
      totalSales: {
        value: 9328.55,
        change: 15.6,
        orders: 731
      },
      visitors: {
        value: 12302,
        change: 12.7,
        avgTime: '4:30'
      },
      refunds: {
        value: 963,
        change: -12.7,
        disputes: 2
      }
    },
    salesByDay: {
      labels: Array.from({ length: 14 }, (_, i) => i + 1),
      earnings: [30, 40, 45, 35, 40, 45, 35, 40, 45, 35, 40, 45, 35, 40],
      costs: [20, 25, 30, 22, 28, 32, 24, 28, 32, 24, 28, 32, 24, 28]
    },
    topCategories: {
      crystal: { value: 40, revenue: 2480 },
      gems: { value: 30, revenue: 1860 },
      chandeliers: { value: 20, revenue: 1240 },
      accessories: { value: 10, revenue: 620 }
    },
    recentOrders: [
      // ... existing orders data
    ],
    topProducts: [
      // ... existing products data
    ],
    customerStats: {
      newCustomers: 245,
      returningCustomers: 486,
      averageOrderValue: 731,
      customerRetentionRate: 68.5
    }
  };

  return NextResponse.json(analytics);
} 