
import { BarChart3, Users, Award, Gift, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "2",
      change: "+12% from last month",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Points Earned",
      value: "250",
      change: "+18% from last month",
      changeType: "positive", 
      icon: Award,
      color: "bg-green-500"
    },
    {
      title: "Points Redeemed",
      value: "500",
      change: "+8% from last month",
      changeType: "positive",
      icon: Gift,
      color: "bg-purple-500"
    },
    {
      title: "Total Sales",
      value: "$500",
      change: "+25% from last month",
      changeType: "positive",
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  const tierData = [
    { name: "Gold", value: 50, color: "#FFD700" },
    { name: "Silver", value: 50, color: "#C0C0C0" },
    { name: "Bronze", value: 0, color: "#CD7F32" }
  ];

  const monthlyData = [
    { month: "January", earned: 2500, redeemed: 1200 },
    { month: "February", earned: 1400, redeemed: 800 },
    { month: "March", earned: 4000, redeemed: 1300 },
    { month: "April", earned: 3800, redeemed: 1200 },
    { month: "May", earned: 5000, redeemed: 1500 },
    { month: "June", earned: 3500, redeemed: 1100 }
  ];

  const recentActivity = [
    { 
      id: 1, 
      user: "Ahmed Mohammed", 
      action: "Earned points", 
      points: "+250 points", 
      amount: "$500",
      type: "earned",
      icon: Award
    },
    { 
      id: 2, 
      user: "Sarah Wilson", 
      action: "Redeemed points", 
      points: "-500 points", 
      amount: "$25",
      type: "redeemed",
      icon: Gift
    }
  ];

  const activeCampaigns = [
    {
      id: 1,
      title: "Winter Golden Campaign",
      description: "Earn double points during winter season",
      earnRate: "2x",
      endDate: "Until 3/31/2024"
    }
  ];

  const chartConfig = {
    earned: {
      label: "Points Earned",
      color: "#3B82F6",
    },
    redeemed: {
      label: "Points Redeemed", 
      color: "#10B981",
    },
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
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
                    {stat.change}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Tier Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {tierData.map((tier) => (
                <div key={tier.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tier.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{tier.name} {tier.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Points Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Points Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="earned" fill="#3B82F6" />
                <Bar dataKey="redeemed" fill="#10B981" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'earned' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          activity.type === 'earned' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        activity.type === 'earned' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {activity.points}
                      </p>
                      <p className="text-sm text-gray-500">{activity.amount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Earn Rate: {campaign.earnRate}</span>
                    <span className="text-sm text-gray-500">{campaign.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
