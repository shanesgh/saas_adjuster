import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  // Sample data for analytics
  const monthlyData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Apr', value: 21000 },
    { name: 'May', value: 18000 },
    { name: 'Jun', value: 24000 },
    { name: 'Jul', value: 28000 },
  ];
  
  const statusData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
    { name: 'Under Review', value: 12, color: '#3B82F6' },
    { name: 'Cancelled', value: 8, color: '#EF4444' },
  ];
  
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
  
  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];
  
  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.value, 0);
  const totalReports = 142;
  const avgProcessingTime = '2.3 days';
  const completionRate = '92%';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="w-48">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
          />
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold">${totalRevenue.toLocaleString()}</h3>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-500">+12.5% from last period</span>
                </div>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Reports</p>
                <h3 className="text-2xl font-bold">{totalReports}</h3>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-500">+8.3% from last period</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Avg. Processing Time</p>
                <h3 className="text-2xl font-bold">{avgProcessingTime}</h3>
                <div className="flex items-center mt-2">
                  <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-500">-15.2% from last period</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Completion Rate</p>
                <h3 className="text-2xl font-bold">{completionRate}</h3>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-green-500">+3.7% from last period</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold">Revenue Over Time</h2>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `${label} 2025`}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Revenue" fill="#1A365D" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Report Status Distribution</h2>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Report Completed', description: 'Toyota Camry Assessment was marked as completed', time: '2 hours ago', icon: CheckCircle, iconColor: 'text-green-500', iconBg: 'bg-green-100' },
              { action: 'New Report Created', description: 'Honda Civic Valuation was created', time: '5 hours ago', icon: FileText, iconColor: 'text-blue-500', iconBg: 'bg-blue-100' },
              { action: 'Report Sent for Review', description: 'Nissan X-Trail Assessment was sent for review', time: '1 day ago', icon: Clock, iconColor: 'text-yellow-500', iconBg: 'bg-yellow-100' },
              { action: 'Payment Received', description: 'Invoice #INV-2025-042 was paid', time: '2 days ago', icon: DollarSign, iconColor: 'text-primary-500', iconBg: 'bg-primary-100' },
            ].map((item, index) => (
              <div key={index} className="flex">
                <div className={`${item.iconBg} p-2 rounded-lg mr-4`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.action}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="text-xs text-gray-400">{item.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};