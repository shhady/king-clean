'use client';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdvancedAnalytics({ orders = [] }) {
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 30)), 
    new Date()
  ]);
  const [startDate, endDate] = dateRange;
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [chartData, setChartData] = useState(null);

  const metrics = {
    revenue: {
      label: 'الإيرادات',
      color: '#40E0D0',
      format: (value) => `${value.toLocaleString()} شيكل`
    },
    orders: {
      label: 'الطلبات',
      color: '#4CAF50',
      format: (value) => value
    },
    avgOrderValue: {
      label: 'متوسط قيمة الطلب',
      color: '#FF9800',
      format: (value) => `${value.toLocaleString()} شيكل`
    }
  };

  useEffect(() => {
    if (!orders.length) return;

    // Filter orders by date range and status
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && 
             orderDate <= endDate && 
             order.status !== 'cancelled';
    });

    // Group orders by date
    const dailyData = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          revenue: 0,
          orders: 0,
          total: 0
        };
      }
      dailyData[date].revenue += order.total;
      dailyData[date].orders += 1;
      dailyData[date].total += order.total;
    });

    // Sort dates and prepare chart data
    const sortedDates = Object.keys(dailyData).sort();
    const chartLabels = sortedDates.map(date => 
      new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', month: 'short', day: 'numeric' })
    );

    const chartValues = sortedDates.map(date => {
      switch (activeMetric) {
        case 'revenue':
          return dailyData[date].revenue;
        case 'orders':
          return dailyData[date].orders;
        case 'avgOrderValue':
          return dailyData[date].orders ? dailyData[date].total / dailyData[date].orders : 0;
        default:
          return 0;
      }
    });

    setChartData({
      labels: chartLabels,
      datasets: [{
        label: metrics[activeMetric].label,
        data: chartValues,
        borderColor: metrics[activeMetric].color,
        backgroundColor: `${metrics[activeMetric].color}20`,
        tension: 0.4,
        fill: true
      }]
    });
  }, [orders, startDate, endDate, activeMetric]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `تحليل ${metrics[activeMetric].label}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Calculate summary metrics
  const summaryMetrics = orders.reduce((acc, order) => {
    if (order.status !== 'cancelled') {
      acc.totalRevenue += order.total;
      acc.totalOrders += 1;
    }
    return acc;
  }, { totalRevenue: 0, totalOrders: 0 });

  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const completionRate = orders.length ? (completedOrders / orders.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {Object.entries(metrics).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-4 py-2 rounded-lg ${
                activeMetric === key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
          <FiCalendar className="text-gray-400" />
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            dateFormat="dd/MM/yyyy"
            className="border-none focus:outline-none"
            placeholderText="اختر نطاق التاريخ"
          />
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>

      {/* Key Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-6">المؤشرات الرئيسية</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>إجمالي الإيرادات</span>
            <span className="font-bold text-primary">
              {summaryMetrics.totalRevenue.toLocaleString()} شيكل
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>عدد الطلبات</span>
            <span className="font-bold text-primary">
              {summaryMetrics.totalOrders}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>متوسط قيمة الطلب</span>
            <span className="font-bold text-primary">
              {summaryMetrics.totalOrders 
                ? (summaryMetrics.totalRevenue / summaryMetrics.totalOrders).toLocaleString() 
                : 0} شيكل
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>نسبة الطلبات المكتملة</span>
            <span className="font-bold text-primary">
              {completionRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 