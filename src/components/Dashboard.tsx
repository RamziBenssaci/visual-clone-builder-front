
import { BarChart3, Users, Award, Gift, Star, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "2,847",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Campaigns",
      value: "8",
      change: "+2",
      changeType: "positive", 
      icon: Star,
      color: "bg-purple-500"
    },
    {
      title: "Points Earned",
      value: "45,672",
      change: "+24%",
      changeType: "positive",
      icon: Award,
      color: "bg-green-500"
    },
    {
      title: "Points Redeemed",
      value: "32,108",
      change: "+18%",
      changeType: "positive",
      icon: Gift,
      color: "bg-orange-500"
    }
  ];

  const recentTransactions = [
    { id: "1", customer: "John Smith", type: "Earned", points: "+150", time: "2 hours ago" },
    { id: "2", customer: "Sarah Johnson", type: "Redeemed", points: "-200", time: "3 hours ago" },
    { id: "3", customer: "Mike Wilson", type: "Earned", points: "+75", time: "5 hours ago" },
    { id: "4", customer: "Emma Davis", type: "Redeemed", points: "-100", time: "1 day ago" },
    { id: "5", customer: "Tom Brown", type: "Earned", points: "+300", time: "1 day ago" },
  ];

  const topCustomers = [
    { name: "Alice Cooper", points: "5,420", level: "Gold" },
    { name: "Bob Johnson", points: "4,850", level: "Gold" },
    { name: "Carol White", points: "3,970", level: "Silver" },
    { name: "David Lee", points: "3,250", level: "Silver" },
    { name: "Eva Martinez", points: "2,890", level: "Bronze" },
  ];

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Overview</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Impact</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue from Loyalty</span>
              <span className="font-semibold text-gray-900">$24,580</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Retention</span>
              <span className="font-semibold text-green-600">+15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold text-gray-900">$45.20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repeat Purchases</span>
              <span className="font-semibold text-blue-600">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.customer}</p>
                    <p className="text-sm text-gray-500">{transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'Earned' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {transaction.points} pts
                    </p>
                    <p className="text-sm text-gray-500">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Top Customers</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{customer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.level} Member</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{customer.points}</p>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
