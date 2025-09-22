'use client';
import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  FiHome, FiDollarSign, FiUsers, FiCalendar, FiTrendingUp, 
  FiActivity, FiMapPin, FiClock, FiPhone, FiMail, FiAlertCircle 
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
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
  ArcElement,
  BarElement
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatCard = ({ title, value, icon, trend, trendDirection = 'up', color = 'blue' }: StatCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <CardDescription className="text-slate-600">{title}</CardDescription>
          <CardTitle className="text-3xl mt-2 font-bold">{value}</CardTitle>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trendDirection === 'up' ? 'text-green-600' : 
              trendDirection === 'down' ? 'text-red-600' : 'text-slate-600'
            }`}>
              <FiTrendingUp className={`mr-1 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface RecentActivity {
  id: string;
  type: 'property' | 'appointment' | 'payment' | 'client';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'property',
    title: 'New Property Listed',
    description: '123 Oak Street, Downtown - $450,000',
    time: '2 hours ago',
    icon: <FiHome className="text-blue-600" />
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment Scheduled',
    description: 'Property viewing with John Smith',
    time: '4 hours ago',
    icon: <FiCalendar className="text-green-600" />
  },
  {
    id: '3',
    type: 'payment',
    title: 'Commission Received',
    description: '$12,500 from 456 Pine Avenue sale',
    time: '1 day ago',
    icon: <FiDollarSign className="text-purple-600" />
  },
  {
    id: '4',
    type: 'client',
    title: 'New Client Registration',
    description: 'Sarah Johnson - First-time buyer',
    time: '2 days ago',
    icon: <FiUsers className="text-orange-600" />
  }
];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    const token = localStorage.getItem('adminToken');

    if (!isAuthenticated || !token) {
      router.push('/admin/login?returnUrl=/admin/dashboard');
      return;
    }

    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-[400px] mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[140px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  const propertyMetricsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Properties Sold',
      data: [15, 23, 18, 32, 28, 41],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'New Listings',
      data: [25, 35, 28, 45, 38, 52],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const propertyTypeData = {
    labels: ['Houses', 'Condos', 'Apartments', 'Commercial', 'Land'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const revenueData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Revenue ($)',
      data: [125000, 185000, 220000, 280000],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Real Estate Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening with your properties today.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Properties" 
            value="248"
            icon={<FiHome size={24} />}
            trend="+12% from last month"
            color="blue"
          />
          <StatCard 
            title="Active Listings" 
            value="156"
            icon={<FiMapPin size={24} />}
            trend="+8% from last month"
            color="green"
          />
          <StatCard 
            title="Monthly Revenue" 
            value="$185,420"
            icon={<FiDollarSign size={24} />}
            trend="+23% from last month"
            color="purple"
          />
          <StatCard 
            title="Active Clients" 
            value="89"
            icon={<FiUsers size={24} />}
            trend="+15% from last month"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Sales & Listings Trend</CardTitle>
              <CardDescription>Monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={propertyMetricsData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Type Distribution</CardTitle>
              <CardDescription>Breakdown by property categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Doughnut data={propertyTypeData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Revenue Analysis</CardTitle>
              <CardDescription>Financial performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={revenueData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-1">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{activity.title}</h4>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used admin functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-16 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <FiHome />
                  <span className="text-xs">Add Property</span>
                </Button>
                <Button className="h-16 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <FiCalendar />
                  <span className="text-xs">Schedule Appointment</span>
                </Button>
                <Button className="h-16 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <FiUsers />
                  <span className="text-xs">Add Client</span>
                </Button>
                <Button className="h-16 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <FiDollarSign />
                  <span className="text-xs">Process Payment</span>
                </Button>
              </div>
              
              <div className="mt-6 space-y-3">
                <Alert>
                  <FiAlertCircle className="h-4 w-4" />
                  <AlertTitle>Upcoming Appointments</AlertTitle>
                  <AlertDescription>
                    You have 3 property viewings scheduled for today
                  </AlertDescription>
                </Alert>
                <Alert>
                  <FiClock className="h-4 w-4" />
                  <AlertTitle>Pending Tasks</AlertTitle>
                  <AlertDescription>
                    5 property documents awaiting your review
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
