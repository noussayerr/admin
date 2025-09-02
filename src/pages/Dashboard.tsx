import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Users, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, 
  Clock, TrendingUp, PieChart, Shield, ChevronDown 
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, PieChart as RechartsPie, Pie, Cell, AreaChart, Area 
} from "recharts";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { useEffect, useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const iconComponents = {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Users,
  Wallet,
  DollarSign,
  Shield
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/authroutes/dashboard`);
        const data = await response.json();
        if (data.success) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate success rate for fraud attempts
  const fraudSuccessRate = dashboardData.fraudAttempts.reduce((sum, fa) => sum + fa.blocked, 0) / 
                         dashboardData.fraudAttempts.reduce((sum, fa) => sum + fa.attempts, 0) * 100;

  return (
    <div className="min-h-screen">
      <main className="p-6 space-y-6">
        {/* Dashboard Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banking Dashboard</h1>
            <p className="text-gray-600">Overview of your financial institution's performance and metrics</p>
          </div>
          <div className="flex space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>
                    {timeRange === '7days' ? 'Last 7 days' : 
                     timeRange === '30days' ? 'Last 30 days' : 
                     timeRange === 'quarter' ? 'Last quarter' : 'Last year'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeRange('7days')}>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('30days')}>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('quarter')}>Last quarter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('year')}>Last year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-blue-800">Total Customers</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{dashboardData.totalCustomers.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-blue-700">+{dashboardData.newCustomersLast30Days} from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-green-800">Active Cards</CardTitle>
              <CreditCard className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{dashboardData.activeCards.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-green-700">+{Math.round(dashboardData.activeCards * 0.12)} from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-purple-800">Total Accounts</CardTitle>
              <Wallet className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{dashboardData.totalAccounts.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-purple-700">+{Math.round(dashboardData.totalAccounts * 0.08)} from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-amber-800">Total Assets</CardTitle>
              <DollarSign className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{(dashboardData.totalAssets / 1000000).toFixed(1)}M DT</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-amber-700">+12% from last quarter</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Transaction Volume */}
          <Card className="lg:col-span-4 border-0 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Transaction Volume</CardTitle>
                  <CardDescription>24-hour transaction activity</CardDescription>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Real-time
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.transactionVolume} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions + Notifications */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Latest customer activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {dashboardData.recentTransactions.map((transaction) => {
                  const IconComponent = iconComponents[transaction.icon];
                  return (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className={
                            transaction.type === "deposit" ? "bg-green-100 text-green-800" :
                            transaction.type === "withdrawal" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }>
                            {transaction.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{transaction.user}</p>
                          <p className="text-xs text-muted-foreground">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === "deposit" ? "text-green-600" :
                          transaction.type === "withdrawal" ? "text-red-600" :
                          "text-blue-600"
                        }`}>
                          {transaction.amount}
                        </p>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "success" :
                            transaction.status === "pending" ? "warning" : "destructive"
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                  View all transactions
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Security Alerts</CardTitle>
                <CardDescription>Recent fraud attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.fraudAttempts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="attempts" fill="#f43f5e" name="Attempts" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="blocked" fill="#10b981" name="Blocked" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {fraudSuccessRate.toFixed(1)}% success rate
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account Distribution</CardTitle>
              <CardDescription>Types of accounts in your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={dashboardData.accountDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData.accountDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Customer Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Customer Activity</CardTitle>
              <CardDescription>Monthly active and new customers</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.customerActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" fill="#3b82f6" name="Active Customers" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="new" fill="#93c5fd" name="New Customers" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription>Recent system alerts</CardDescription>
                </div>
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  {dashboardData.notifications.filter(n => !n.read).length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                  {!notification.read && (
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 mt-2">
                      View details
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                View all notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}