import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Edit,
  Trash2,
  Plus,
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

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updateStoreDetails(formData);
    } catch (error) {
      console.error("Failed to update store details:", error);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.updateCredentials({
        newUsername: newUsername || undefined,
        currentPassword,
        newPassword: newPassword || undefined,
        confirmPassword: confirmPassword || undefined
      });
      setNewUsername("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to update credentials:", error);
    }
  };

  const handleAddNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createAdmin({
        username: newAdminUsername,
        password: newAdminPassword
      });
      setNewAdminUsername("");
      setNewAdminPassword("");
      fetchAdminUsers();
    } catch (error) {
      console.error("Failed to add admin:", error);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    try {
      await adminApi.deleteAdmin(id);
      fetchAdminUsers();
    } catch (error) {
      console.error("Failed to delete admin:", error);
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
                      placeholder="Enter store name"
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="055-123-4567"
                      value={storeForm.phone}
                      onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                    <textarea
                      placeholder="Enter store address"
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                      required
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm file:bg-green-600 file:text-white file:px-4 file:py-2 file:border-none file:rounded-md file:cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    <Store className="w-4 h-4" />
                    <span>Update Store Details</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* System Settings ... unchanged */}
      </div>
    </div>
  );
};

export default Settings;

