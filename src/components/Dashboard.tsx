
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Dashboard content will be displayed here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
