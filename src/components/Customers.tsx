import { useState, useEffect } from "react";
import { Users, Edit, Trash2, Search } from "lucide-react";
import { customersApi } from "../services/api";
import EditCustomerModal from "./modals/EditCustomerModal";
import DeleteCustomerModal from "./modals/DeleteCustomerModal";

interface Customer {
  id: number;
  name: string;
  phone: string;
  points: number;
  tier: string;
  cashValue: string;
  gender: string;
  joined: string;
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPoints: 0,
    goldPlatinum: 0,
    totalValue: "$0.00"
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchCustomers();
    }
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersApi.getAll();
      setCustomers(response.data.data);
      
      // Calculate stats
      const totalCustomers = response.data.data.length;
      const totalPoints = response.data.data.reduce((sum: number, customer: Customer) => sum + customer.points, 0);
      const goldPlatinum = response.data.data.filter((customer: Customer) => customer.tier === 'Gold' || customer.tier === 'Platinum').length;
      const totalValue = (totalPoints * 0.05).toFixed(2); // Assuming 20:1 point to dollar ratio
      
      setStats({
        totalCustomers,
        totalPoints,
        goldPlatinum,
        totalValue: `$${totalValue}`
      });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      // Fallback to mock data
      const mockCustomers = [
        {
          id: 1,
          name: "Ahmed Mohammed",
          phone: "0551234567",
          points: 2500,
          tier: "Silver",
          cashValue: "$125.00",
          gender: "Male",
          joined: "7/3/2025"
        },
        {
          id: 2,
          name: "Sarah Wilson",
          phone: "0559876543",
          points: 6000,
          tier: "Gold",
          cashValue: "$300.00",
          gender: "Female",
          joined: "7/3/2025"
        }
      ];
      setCustomers(mockCustomers);
      setStats({
        totalCustomers: 2,
        totalPoints: 8500,
        goldPlatinum: 1,
        totalValue: "$425.00"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      const response = await customersApi.search(searchTerm);
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleSaveCustomer = async (updatedCustomer: Customer) => {
    try {
      await customersApi.update(updatedCustomer.id, updatedCustomer);
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        await customersApi.delete(selectedCustomer.id);
        setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
        setShowDeleteModal(false);
        setSelectedCustomer(null);
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

const filteredCustomers = searchTerm.trim()
  ? customers.filter((customer) => {
      const nameMatch = customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const phoneMatch = customer?.phone?.includes(searchTerm);
      return nameMatch || phoneMatch;
    })
  : customers;


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
      </div>

      {/* Customer Management Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Customer Management</h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or tier..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                    <p className="text-sm text-gray-600">📞 {customer.phone}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Balance</span>
                  <span className="font-semibold text-green-600">🏆 {customer.points.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Membership Tier</span>
                  <span className={px-2 py-1 rounded text-xs font-medium ${
                    customer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }}>
                    {customer.tier === 'Gold' ? '👑' : '🥈'} {customer.tier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Value</span>
                  <span className="font-semibold text-blue-600">{customer.cashValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="text-gray-800">{customer.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined</span>
                  <span className="text-gray-800">{customer.joined}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.goldPlatinum}</div>
            <div className="text-sm text-gray-600">Gold/Platinum</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalValue}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {showDeleteModal && selectedCustomer && (
        <DeleteCustomerModal
          customer={selectedCustomer}
          onConfirm={handleDeleteCustomer}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};
