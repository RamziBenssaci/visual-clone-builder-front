
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { customersApi } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    pinCode: "",
  });

  const [recentCustomers, setRecentCustomers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRecentCustomers();
  }, []);

  const fetchRecentCustomers = async () => {
    try {
      const response = await customersApi.getAll({ limit: 5, sort: 'recent' });
      setRecentCustomers(response.data.data.slice(0, 2));
    } catch (error) {
      console.error('Failed to fetch recent customers:', error);
      // Fallback to mock data
      setRecentCustomers([
        { name: "Sarah Wilson", phone: "0559876543", tier: "Gold", points: 6000 },
        { name: "Ahmed Mohammed", phone: "0551234567", tier: "Silver", points: 2500 }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customerData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: "", // Optional field
        gender: formData.gender,
        pinCode: formData.pinCode
      };

      await customersApi.create(customerData);
      
      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        gender: "",
        pinCode: "",
      });

      // Refresh recent customers list
      fetchRecentCustomers();
      
      console.log("Customer registered successfully!");
    } catch (error) {
      console.error("Failed to register customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Register New Customer</h2>
      </div>

      {/* Register Form */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Register New Customer</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <span>📞</span>
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <span>🔒</span>
                  <span>PIN Code (4 digits)</span>
                </label>
                <input
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This code is used to access the customer portal
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : 'Register Customer'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 p-4 rounded-lg mt-6 max-w-md mx-auto">
          <h4 className="font-medium text-blue-800 mb-2">Important Information:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Customer will receive a Bronze tier account</li>
            <li>• Customer can login using phone number and PIN</li>
            <li>• Points start from zero and can be earned from purchases</li>
          </ul>
        </div>

        {/* Recently Registered Customers */}
        <div className="mt-8 max-w-2xl mx-auto">
          <h4 className="font-semibold text-gray-800 mb-4">Recently Registered Customers</h4>
          <div className="space-y-3">
            {recentCustomers.map((customer, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.phone}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded ${
                    customer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.tier === 'Gold' ? '👑' : '🥈'} {customer.tier}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{customer.points.toLocaleString()} points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
