import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Store,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useStore } from "../contexts/StoreContext";
import { adminApi } from "../services/api";

interface AdminUser {
  id: number;
  username: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

const Settings = () => {
  const { storeDetails, updateStoreDetails } = useStore();

  const [storeForm, setStoreForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);

  useEffect(() => {
    if (storeDetails) {
      setStoreForm({
        name: storeDetails.name,
        phone: storeDetails.phone,
        address: storeDetails.address
      });
    }
    fetchAdminUsers();
  }, [storeDetails]);

  const fetchAdminUsers = async () => {
    try {
      const response = await adminApi.getAdmins();
      setAdminUsers(response.data.data);
    } catch (error) {
      setAdminUsers([
        { id: 1, username: "admin", lastLogin: "Jul 3, 2025, 03:43 PM", status: "active" },
        { id: 2, username: "manager", lastLogin: "Jul 2, 2025, 03:43 PM", status: "active" }
      ]);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", storeForm.name);
    formData.append("phone", storeForm.phone);
    formData.append("address", storeForm.address);

    if (imageFile instanceof File) {
      formData.append("image", imageFile);
    }

    // Debug: log all FormData entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      await updateStoreDetails(formData);
    } catch (error) {
      console.error("Failed to update store details:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg cursor-pointer flex items-center justify-between"
            onClick={() => setShowStoreDetails(!showStoreDetails)}
          >
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Store Details</h3>
            </div>
            {showStoreDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>

          {showStoreDetails && (
            <div className="p-6">
              <div className="max-w-md mx-auto">
                <form onSubmit={handleStoreSubmit} className="space-y-4" encType="multipart/form-data">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={storeForm.phone}
                      onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                    <textarea
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    Update Store Details
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
