
import { BarChart3, Users, Award, Gift, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { analyticsApi } from "../services/api";

const Dashboard = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [stats, setStats] = useState([]);
  const [tierData, setTierData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminRoles = [
    "View all customer data and analytics",
    "Manage loyalty campaigns and rewards",
    "Process point transactions (earn/redeem/deduct)",
    "Access customer registration and management",
    "Generate reports and view transaction history",
    "Configure system settings and parameters"
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data
      const [statsRes, chartRes, activityRes, campaignsRes] = await Promise.all([
        analyticsApi.getDashboardStats(),
        analyticsApi.getChartData(),
        analyticsApi.getRecentActivity(),
        analyticsApi.getActiveCampaigns()
      ]);

      setStats(statsRes.data.data.stats);
      setTierData(chartRes.data.data.tierDistribution);
      setMonthlyData(chartRes.data.data.monthlyActivity);
      setRecentActivity(activityRes.data.data);
      setActiveCampaigns(campaignsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to mock data for development
      setStats([
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
      ]);

      setTierData([
        { name: "Gold", value: 50, color: "#FFD700" },
        { name: "Silver", value: 50, color: "#C0C0C0" },
        { name: "Bronze", value: 0, color: "#CD7F32" }
      ]);

      setMonthlyData([
        { month: "Jan", earned: 2500, redeemed: 1200 },
        { month: "Feb", earned: 1400, redeemed: 800 },
        { month: "Mar", earned: 4000, redeemed: 1300 },
        { month: "Apr", earned: 3800, redeemed: 1200 },
        { month: "May", earned: 5000, redeemed: 1500 },
        { month: "Jun", earned: 3500, redeemed: 1100 }
      ]);

      setRecentActivity([
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
      ]);

      setActiveCampaigns([
        {
          id: 1,
          title: "Winter Golden Campaign",
          description: "Earn double points during winter season",
          earnRate: "2x",
          endDate: "Until 3/31/2024"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const cookies = document.cookie.split(';').reduce((acc, curr) => {
    const [key, value] = curr.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  if (cookies.admin_id_plain) {
    console.log('Admin ID is:', cookies.admin_id_plain);
  } else {
    console.warn('Admin ID not found in cookies');
  }
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon || Users;
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="earned" fill="#3B82F6" />
                  <Bar dataKey="redeemed" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                const Icon = activity.icon || Award;
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

      {/* Floating Help Button */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <span className="text-lg font-bold">?</span>
      </button>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Admin Roles & Permissions</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {adminRoles.map((role, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {role}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
