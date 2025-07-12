// ... same import and setup at the top
import { useState, useEffect, useRef } from "react";
import { Settings as SettingsIcon, User, Edit, Trash2, Plus, Store, ChevronDown, ChevronUp } from "lucide-react";
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
                <form onSubmit={handleStoreSubmit} className="space-y-4">
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
                    <div className="flex items-center space-x-4">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 border flex items-center justify-center text-sm text-gray-400 rounded-lg">No Image</div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
                      >
                        Choose Image
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">JPEG, PNG, JPG, WEBP — max 2MB</p>
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

        <div className="bg-white rounded-lg shadow-sm">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg cursor-pointer flex items-center justify-between"
            onClick={() => setShowSystemSettings(!showSystemSettings)}
          >
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">System Settings</h3>
            </div>
            {showSystemSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>

          {showSystemSettings && (
            <div className="p-6 space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Update Credentials</h4>
                </div>
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Username (Optional)</label>
                      <input
                        type="text"
                        placeholder="Current: admin"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave blank to keep current username</p>
                    </div>
                    <div className="border-t pt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Change Password (Optional)</h5>
                      <p className="text-xs text-gray-500 mb-3">Fill all three fields to change password</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span>Update Credentials</span>
                    </button>
                  </form>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Admin Users Management</h4>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
                  <div className="overflow-x-auto">
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
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(user.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Plus className="w-5 h-5 text-green-600" />
                    <h5 className="font-semibold text-green-800">Add New Admin</h5>
                  </div>
                  <form onSubmit={handleAddNewAdmin} className="max-w-md mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          placeholder="Enter username"
                          value={newAdminUsername}
                          onChange={(e) => setNewAdminUsername(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          placeholder="Enter password (min 6 chars)"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          minLength={6}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Admin</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
