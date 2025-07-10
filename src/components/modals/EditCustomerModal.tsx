import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { customersApi } from "../../services/api"; // adjust if needed

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

interface EditCustomerModalProps {
  customer: Customer;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const EditCustomerModal = ({ customer, onSave, onCancel }: EditCustomerModalProps) => {
  const [formData, setFormData] = useState({
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender,
    points: customer.points.toString(),
  });

  const [pinCode, setPinCode] = useState("••••");

  useEffect(() => {
    customersApi.get(`/customers/${customer.id}`).then(res => {
      const realPin = res.data.data.customer.pin_code;
      if (realPin) setPinCode(realPin);
    }).catch(err => {
      console.error("Failed to fetch pin_code", err);
    });
  }, [customer.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCustomer: Customer = {
      ...customer,
      name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      points: parseInt(formData.points),
      cashValue: `$${(parseInt(formData.points) * 0.05).toFixed(2)}`,
    };
    onSave(updatedCustomer);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Customer</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Update customer information and points balance.</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
              <input
                type="text"
                value={pinCode}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points Balance</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;
