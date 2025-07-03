
import { BarChart3, Users, Award, Gift, Star, TrendingUp, Minus, Search, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Dashboard = () => {
  const [searchPhone, setSearchPhone] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deductionComplete, setDeductionComplete] = useState(false);

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
    { month: "Jan", earned: 2500, redeemed: 1200 },
    { month: "Feb", earned: 1400, redeemed: 800 },
    { month: "Mar", earned: 4000, redeemed: 1300 },
    { month: "Apr", earned: 3800, redeemed: 1200 },
    { month: "May", earned: 5000, redeemed: 1500 },
    { month: "Jun", earned: 3500, redeemed: 1100 }
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

  const handleSearchCustomer = () => {
    if (searchPhone) {
      // Mock customer data
      setFoundCustomer({
        name: "Ahmed Mohammed",
        phone: searchPhone,
        currentPoints: 1250,
        lastTransaction: "$75.00",
        transactionDate: "2024-01-15",
        tier: "Gold"
      });
    }
  };

  const handleDeductPoints = () => {
    if (refundAmount && foundCustomer) {
      const pointsToDeduct = Math.floor(parseFloat(refundAmount) * 5); // 5 points per dollar
      setShowConfirmation(true);
    }
  };

  const confirmDeduction = () => {
    setDeductionComplete(true);
    setShowConfirmation(false);
    setTimeout(() => {
      setDeductionComplete(false);
      setFoundCustomer(null);
      setSearchPhone("");
      setRefundAmount("");
    }, 3000);
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

      {/* Point Deduction Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minus className="w-5 h-5" />
            Point Deduction (Refund Handling)
          </CardTitle>
          <CardDescription>
            Deduct loyalty points from customers when processing refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!foundCustomer && !deductionComplete && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="phone-search">Customer Phone Number</Label>
                  <Input
                    id="phone-search"
                    type="tel"
                    placeholder="Enter phone number"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearchCustomer} className="mt-6">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          )}

          {foundCustomer && !showConfirmation && !deductionComplete && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Customer Found</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Name: {foundCustomer.name}</p>
                    <p className="text-sm text-blue-700">Phone: {foundCustomer.phone}</p>
                    <p className="text-sm text-blue-700">Tier: {foundCustomer.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Current Points: {foundCustomer.currentPoints}</p>
                    <p className="text-sm text-blue-700">Last Transaction: {foundCustomer.lastTransaction}</p>
                    <p className="text-sm text-blue-700">Date: {foundCustomer.transactionDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="refund-amount">Refund Amount ($)</Label>
                  <Input
                    id="refund-amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter refund amount"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                  />
                  {refundAmount && (
                    <p className="text-sm text-gray-600 mt-1">
                      Points to deduct: {Math.floor(parseFloat(refundAmount) * 5)} points
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDeductPoints} disabled={!refundAmount}>
                    Deduct Points
                  </Button>
                  <Button variant="outline" onClick={() => setFoundCustomer(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Minus className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-yellow-900">Confirm Point Deduction</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-yellow-800">Customer: {foundCustomer.name}</p>
                <p className="text-yellow-800">Refund Amount: ${refundAmount}</p>
                <p className="text-yellow-800">Points to Deduct: {Math.floor(parseFloat(refundAmount) * 5)} points</p>
                <p className="text-yellow-800">Remaining Points: {foundCustomer.currentPoints - Math.floor(parseFloat(refundAmount) * 5)} points</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmDeduction} className="bg-red-600 hover:bg-red-700">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Deduction
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {deductionComplete && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Points Successfully Deducted</h3>
                  <p className="text-green-800">The customer has been notified of the point deduction.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
