'use client';
import { useState, useEffect } from 'react';
import { FiDownload, FiFilter } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesPage() {
  const [salesData, setSalesData] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [chartType, setChartType] = useState('line'); // line, bar

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const processOrdersData = (orders = [], range) => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 12
    };

    let dateFormat;
    let groupingFunction;

    switch (range) {
      case 'week':
        dateFormat = (date) => date.toLocaleDateString('he-IL', { weekday: 'long' });
        groupingFunction = (date) => {
          // Get ISO string for consistent date comparison
          return date.toISOString().split('T')[0];
        };
        break;
      case 'month':
        dateFormat = (date) => date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
        groupingFunction = (date) => {
          return date.toISOString().split('T')[0];
        };
        break;
      case 'year':
        dateFormat = (date) => date.toLocaleDateString('he-IL', { month: 'long' });
        groupingFunction = (date) => {
          return date.getMonth() + '-' + date.getFullYear();
        };
        break;
    }

    // Initialize data structure with dates in correct order
    const salesByPeriod = new Map();
    const labels = [];

    // Set up periods with correct date order
    for (let i = periods[range] - 1; i >= 0; i--) {
      const date = new Date(now);
      if (range === 'year') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      const key = groupingFunction(date);
      const label = dateFormat(date);
      salesByPeriod.set(key, { label, orders: 0, sales: 0 });
      labels.push(label);
    }

    // Process orders
    const completedOrders = orders.filter(order => order.status !== 'cancelled');
    completedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const key = groupingFunction(orderDate);
      if (salesByPeriod.has(key)) {
        const data = salesByPeriod.get(key);
        data.orders++;
        data.sales += order.total;
        salesByPeriod.set(key, data);
      }
    });

    // Convert to arrays for chart
    const salesData = [];
    const ordersData = [];
    salesByPeriod.forEach(({ orders, sales }) => {
      ordersData.push(orders);
      salesData.push(sales);
    });

    return {
      labels,
      datasets: [
        {
          label: 'מכירות (₪)',
          data: salesData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'מספר הזמנות',
          data: ordersData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch('/api/orders?getAllOrders=true'),
        fetch('/api/products/sales') // New endpoint to fetch products with sales
      ]);

      if (!ordersResponse.ok || !productsResponse.ok) 
        throw new Error('Failed to fetch data');

      const [ordersData, productsData] = await Promise.all([
        ordersResponse.json(),
        productsResponse.json()
      ]);
      
      const orders = ordersData.orders || [];
      const completedOrders = orders.filter(order => order.status !== 'cancelled');
      
      // Calculate basic stats
      const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const uniqueCustomers = new Set(orders.map(order => order.customerInfo.email));
      
      setStats({
        totalSales: totalSales.toFixed(0),
        totalOrders: completedOrders.length,
        totalCustomers: uniqueCustomers.size,
        averageOrderValue: completedOrders.length ? (totalSales / completedOrders.length).toFixed(0) : 0
      });

      // Process top products from products data
      const topProducts = productsData.products
        .map(product => ({
          _id: product._id,
          name: product.name,
          sales: product.sales,
          revenue: product.sales * product.price
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      
      setTopProducts(topProducts);

      // Process chart data
      const chartData = processOrdersData(orders, timeRange);
      setSalesData(chartData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'ניתוח מכירות',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
          <h3 className="text-base lg:text-lg font-semibold mb-2">סה"כ מכירות</h3>
          <p className="text-2xl lg:text-3xl font-bold">{Number(stats.totalSales).toLocaleString()} ₪</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
          <h3 className="text-base lg:text-lg font-semibold mb-2">סה"כ הזמנות</h3>
          <p className="text-2xl lg:text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
          <h3 className="text-base lg:text-lg font-semibold mb-2">ממוצע הזמנה</h3>
          <p className="text-2xl lg:text-3xl font-bold">{Number(stats.averageOrderValue).toLocaleString()} ₪</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
          >
            <option value="week">שבוע אחרון</option>
            <option value="month">חודש אחרון</option>
            <option value="year">שנה אחרונה</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
          >
            <option value="line">גרף קווי</option>
            <option value="bar">גרף עמודות</option>
          </select>
        </div>
        <button
          onClick={() => {
            // Prepare data for export
            const exportData = {
              stats: {
                totalSales: stats.totalSales,
                totalOrders: stats.totalOrders,
                averageOrderValue: stats.averageOrderValue
              },
              topProducts: topProducts.map(product => ({
                name: product.name,
                sales: product.sales,
                revenue: product.revenue
              }))
            };

            // Create CSV content
            const csvContent = [
              // Headers
              ['Statistics'],
              ['Total Sales', ` ${stats.totalSales} shekel`],
              ['Total Orders', stats.totalOrders],
              ['Average Order Value', ` ${stats.averageOrderValue} shekel`],
              [''], // Empty row for spacing
              ['Top Products'],
              ['Product', 'Sales', 'Revenue'],
              ...topProducts.map(p => [p.name, p.sales, ` ${p.revenue} shekel`])
            ].map(row => row.join(',')).join('\n');

            // Create and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-primary-dark"
        >
          <FiDownload />
          ייצא דוח
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 lg:mb-8 overflow-x-auto">
        <div className="min-w-[300px]">
          {salesData && (
            chartType === 'line' ? (
              <Line options={chartOptions} data={salesData} />
            ) : (
              <Bar options={chartOptions} data={salesData} />
            )
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 lg:mt-8">
        <h2 className="text-lg lg:text-xl font-semibold mb-4">מוצרים מובילים</h2>
        
        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-gray-900">שם המוצר</th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-gray-900">כמות שנמכרה</th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-gray-900">הכנסות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product._id || `product-${product.name}`}>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{product.sales}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{Number(product.revenue).toLocaleString()} ₪</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {topProducts.map((product) => (
            <div key={product._id || `product-${product.name}`} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-600">כמות שנמכרה</p>
                  <p className="font-medium">{product.sales}</p>
                </div>
                <div>
                  <p className="text-gray-600">הכנסות</p>
                  <p className="font-medium">{Number(product.revenue).toLocaleString()} ₪</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
