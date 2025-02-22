'use client';
import { useState, useEffect } from 'react';
import { FiUsers, FiRepeat, FiDollarSign, FiPercent } from 'react-icons/fi';

export default function CustomerStats({sales}) {
  const [statsData, setStatsData] = useState({
    totalCustomers: 0,
    returningCustomers: 0,
    averageOrderValue: 0,
    retentionRate: 0
  });

  useEffect(() => {
    fetch('/api/usersStats')
      .then(res => res.json())
      .then(data => {
        // Combine users and visitors
        const allCustomers = [...data.users, ...data.visitors];
        
        // Get customers with at least one order
        const customersWithOrders = allCustomers.filter(customer => 
          customer.orders && customer.orders.length > 0
        );

        setStatsData({
          totalCustomers: allCustomers.length,
          returningCustomers: allCustomers.filter(customer => 
            customer.orders && customer.orders.length > 1).length,
          averageOrderValue: customersWithOrders.length ? 
            Math.round(Number(sales) / customersWithOrders.length) : 0,
          retentionRate: Math.round((allCustomers.filter(customer => 
            customer.orders && customer.orders.length > 1).length / allCustomers.length) * 100)
        });
      });
  }, [sales]);

  const stats = [
    {
      title: 'סך הכל לקוחות',
      value: statsData.totalCustomers,
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'לקוחות חוזרים',
      value: statsData.returningCustomers,
      icon: FiRepeat,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'ממוצע הוצאה ללקוח',
      value: `₪${statsData.averageOrderValue}`,
      icon: FiDollarSign,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'אחוז שימור',
      value: `${statsData.retentionRate}%`,
      icon: FiPercent,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 