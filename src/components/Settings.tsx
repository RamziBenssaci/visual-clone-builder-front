import { useState, useEffect, useRef } from "react";
import { Settings as SettingsIcon, User, Trash2, Plus, Store, ChevronDown, ChevronUp } from "lucide-react";
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", storeForm.name);
      formData.append("phone", storeForm.phone);
      formData.append("address", storeForm.address);
      if (imageFile) {
        formData.append("image", imageFile);
      }
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
      setSuccessMessage("Your credentials have been updated successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      console.error("Failed to update credentials:", error);
    }
  };

  const handleAddNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await adminApi.createAdmin({
        username: newAdminUsername,
        password: newAdminPassword
      });
      setNewAdminUsername("");
      setNewAdminPassword("");
      fetchAdminUsers();
      setSuccessMessage("New admin has been added successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      console.error("Failed to add admin:", error);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    setErrorMessage(null);
    if (id === 7) {
      setErrorMessage("You cannot delete the Super Admin. This account is essential to keep your store safe and always accessible.");
      return;
    }
    try {
      await adminApi.deleteAdmin(id);
      fetchAdminUsers();
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <strong className="font-semibold">Warning: </strong> {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
          <strong className="font-semibold">Success: </strong> {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Admin Users</h3>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Username</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Login</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-3 px-4 font-medium text-gray-800">{user.username}</td>
                  <td className="py-3 px-4 text-gray-600">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteAdmin(user.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 border-t px-6 py-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Add New Admin</h4>
          <form onSubmit={handleAddNewAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
            <input
              type="text"
              placeholder="Username"
              value={newAdminUsername}
              onChange={(e) => setNewAdminUsername(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Add Admin
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Your Credentials</h3>
        <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-lg">
          <input
            type="text"
            placeholder="New Username (optional)"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="New Password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
          >
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
