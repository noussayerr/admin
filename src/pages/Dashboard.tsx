import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Users, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const transactionData = [
  { time: "00:00", amount: 1200 },
  { time: "03:00", amount: 900 },
  { time: "06:00", amount: 1500 },
  { time: "09:00", amount: 2800 },
  { time: "12:00", amount: 3200 },
  { time: "15:00", amount: 4100 },
  { time: "18:00", amount: 3600 },
  { time: "21:00", amount: 2400 },
]

const userActivityData = [
  { month: "Jan", active: 400, new: 240 },
  { month: "Feb", active: 300, new: 139 },
  { month: "Mar", active: 200, new: 980 },
  { month: "Apr", active: 278, new: 390 },
  { month: "May", active: 189, new: 480 },
  { month: "Jun", active: 239, new: 380 },
  { month: "Jul", active: 349, new: 430 },
]

const recentTransactions = [
  {
    id: "1",
    user: "Ahmed Ben Ali",
    type: "Withdrawal",
    amount: "1,200 DT",
    time: "10:30 AM",
    status: "completed",
  },
  {
    id: "2",
    user: "Sarra Mansour",
    type: "Deposit",
    amount: "3,500 DT",
    time: "11:45 AM",
    status: "completed",
  },
  {
    id: "3",
    user: "Mohamed Karim",
    type: "Transfer",
    amount: "750 DT",
    time: "12:15 PM",
    status: "pending",
  },
  {
    id: "4",
    user: "Leila Trabelsi",
    type: "Card Payment",
    amount: "450 DT",
    time: "1:30 PM",
    status: "completed",
  },
  {
    id: "5",
    user: "Kamel Gharbi",
    type: "Withdrawal",
    amount: "900 DT",
    time: "2:45 PM",
    status: "failed",
  },
]

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your banking system's performance and activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,764</div>
            <p className="text-xs text-muted-foreground">+340 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,672</div>
            <p className="text-xs text-muted-foreground">+520 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M DT</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>Live transaction volume over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#0284c7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.type === "Deposit"
                        ? "bg-green-100 text-green-600"
                        : transaction.type === "Withdrawal"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {transaction.type === "Deposit" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : transaction.type === "Withdrawal" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{transaction.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.type} • {transaction.time}
                    </p>
                  </div>
                  <div className="text-sm font-medium">{transaction.amount}</div>
                  <div
                    className={`text-xs ${
                      transaction.status === "completed"
                        ? "text-green-600"
                        : transaction.status === "pending"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {transaction.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Monthly active users and new registrations</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#0284c7" name="Active Users" />
                  <Bar dataKey="new" fill="#0ea5e9" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Popularity of different banking products</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "STB Travel", value: 400 },
                    { name: "STB Epargne", value: 300 },
                    { name: "Visa Electron", value: 500 },
                    { name: "CIB3", value: 280 },
                    { name: "C Cash", value: 200 },
                    { name: "C Pay", value: 180 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
