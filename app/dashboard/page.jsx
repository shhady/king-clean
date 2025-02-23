'use client';
import { useState, useEffect } from 'react';
import { FiShoppingBag, FiUsers, FiRefreshCcw, FiTrendingUp, FiSearch, FiDownload, FiDollarSign } from 'react-icons/fi';
import SalesChart from '../components/dashboard/SalesChart';
import StatCard from '../components/dashboard/StatCard';
import TopCategories from '../components/dashboard/TopCategories';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopProducts from '../components/dashboard/TopProducts';
import Link from 'next/link';
import CustomerStats from '../components/dashboard/CustomerStats';
import { exportToExcel, exportToPDF, prepareDataForExport } from '../utils/exportData';
import AdvancedAnalytics from '../components/dashboard/AdvancedAnalytics';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import { useRouter } from 'next/navigation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('Last 14 Days');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [salesChartData, setSalesChartData] = useState(null);
  const [ordersChartData, setOrdersChartData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchStats();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Use the existing orders API endpoint
      const response = await fetch('/api/orders?getAllOrders=true');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      // Calculate stats from orders
      const orders = data.orders || [];
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const uniqueCustomers = new Set(orders.map(order => order.customerInfo.email));
      
      setStats({
        totalSales: totalSales.toFixed(0),
        totalOrders: orders.length,
        totalCustomers: uniqueCustomers.size,
        averageOrderValue: orders.length ? (totalSales / orders.length).toFixed(0) : 0
      });

      const { salesData, ordersData } = processChartData(orders);
      setSalesChartData(salesData);
      setOrdersChartData(ordersData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleExport = (type, format) => {
    if (!analytics) return;

    const data = prepareDataForExport(analytics, type);
    const filename = `${type}-report-${new Date().toISOString().split('T')[0]}`;

    if (format === 'excel') {
      exportToExcel(data, filename);
    } else if (format === 'pdf') {
      exportToPDF(data, filename);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'מכירות והזמנות',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Process orders data for charts
  const processChartData = (orders) => {
    // Get last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Initialize data objects
    const salesByDay = {};
    const ordersByDay = {};
    last7Days.forEach(day => {
      salesByDay[day] = 0;
      ordersByDay[day] = 0;
    });

    // Process orders
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (salesByDay.hasOwnProperty(orderDate)) {
        salesByDay[orderDate] += order.total;
        ordersByDay[orderDate]++;
      }
    });

    // Create chart data
    const labels = last7Days.map(day => 
      new Date(day).toLocaleDateString('he-IL', { weekday: 'long' })
    );

    const salesData = {
      labels,
      datasets: [{
        label: 'מכירות (₪)',
        data: Object.values(salesByDay),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1
      }]
    };

    const ordersData = {
      labels,
      datasets: [{
        label: 'מספר הזמנות',
        data: Object.values(ordersByDay),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }]
    };

    return { salesData, ordersData };
  };

  const handleEditProduct = (product) => {
    router.push(`/dashboard/products/${product._id}/edit`);
  };

  if (isLoading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add LowStockAlert at the top */}
      <LowStockAlert />
      
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">ברוך הבא בחזרה</h1>
          <p className="text-gray-600">סטטיסטיקות החנות שלך להיום</p>
        </div>
        <div className="flex items-center gap-4">
          {/* <div className="relative">
            <input
              type="text"
              placeholder="חיפוש..."
              className="w-64 p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div> */}
          <div className="relative">
            {/* <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              4
            </span> */}
            <button className="p-2 hover:bg-gray-100 rounded-full" onClick={fetchStats}>
              <FiRefreshCcw className="text-xl" />
            </button>
          </div>
          {/* <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="week">שבוע אחרון</option>
            <option value="month">חודש אחרון</option>
            <option value="year">שנה אחרונה</option>
          </select> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="סך המכירות"
            value={`₪${stats.totalSales}`}
            icon={FiDollarSign}
          />
          <StatCard
            title="מספר הזמנות"
            value={stats.totalOrders}
            icon={FiShoppingBag}
          />
          <StatCard
            title="מספר לקוחות"
            value={stats.totalCustomers}
            icon={FiUsers}
          />
          <StatCard
            title="ממוצע הזמנה"
            value={`₪${stats.averageOrderValue}`}
            icon={FiTrendingUp}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            {salesChartData && <Bar options={chartOptions} data={salesChartData} />}
          </div>
          {/* <div className="bg-white p-4 rounded-lg shadow">
            {ordersChartData && <Bar options={chartOptions} data={ordersChartData} />}
          </div> */}
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">הזמנות אחרונות</h2>
              <Link href="/dashboard/orders" className="text-primary hover:underline">
                הצג הכל
              </Link>
            </div>
            <RecentOrders />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">מוצרים הכי נמכרים</h2>
              <Link href="/dashboard/products" className="text-primary hover:underline">
                הצג הכל
              </Link>
            </div>
            <TopProducts />
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">סטטיסטיקות לקוחות</h2>
        <CustomerStats sales={stats.totalSales}/>
      </div>

      {/* Advanced Analytics */}
      {/* <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">ניתוח מתקדם</h2>
          <button
            onClick={() => handleExport('analytics', 'excel')}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <FiDownload />
            ייצא דוח
          </button>
        </div>
        <AdvancedAnalytics orders={analytics.orders} />
      </div> */}

      {/* Export Buttons */}
      {/* <div className="mt-8 flex gap-4">
        <div className="dropdown relative">
          <button className="btn bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FiDownload />
            ייצא דוחות
          </button>
          <div className="dropdown-menu absolute hidden group-hover:block">
            <button onClick={() => handleExport('sales', 'excel')}>
              ייצא מכירות (Excel)
            </button>
            <button onClick={() => handleExport('sales', 'pdf')}>
              ייצא מכירות (PDF)
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
} 