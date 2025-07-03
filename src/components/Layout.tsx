
import { Users, User, Award, Gift, Star, CreditCard, Settings as SettingsIcon, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: BarChart3, label: "Dashboard" },
    { path: "/customers", icon: Users, label: "Customers" },
    { path: "/register", icon: User, label: "Register" },
    { path: "/earn", icon: Award, label: "Earn" },
    { path: "/redeem", icon: Gift, label: "Redeem" },
    { path: "/campaigns", icon: Star, label: "Campaigns" },
    { path: "/transactions", icon: CreditCard, label: "Transactions" },
    { path: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold">Merchant Admin Panel</h1>
            <p className="text-blue-100 text-xs lg:text-sm hidden sm:block">Complete loyalty program management</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button className="bg-white/20 hover:bg-white/30 px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors hidden sm:block">
            Customer Portal
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs lg:text-sm hidden md:inline">Welcome</span>
            <span className="font-medium text-xs lg:text-sm">Admin</span>
            <div className="bg-white/20 p-2 rounded-full">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Responsive Grid */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-2 lg:px-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "text-blue-600 border-blue-600 bg-blue-50"
                      : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation - 4x2 Grid */}
          <div className="grid grid-cols-4 gap-1 lg:hidden py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-3 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
