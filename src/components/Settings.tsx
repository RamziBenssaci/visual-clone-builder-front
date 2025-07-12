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

  // feedback banner
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, message: msg });
    setTimeout(() => setFeedback(null), 4000);
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
      showFeedback("success", "Store details updated successfully.");
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to update store details.");
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
      showFeedback("success", "Admin credentials updated successfully.");
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to update credentials.");
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
      showFeedback("success", "New admin added successfully.");
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to add new admin.");
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (id === 7) {
      showFeedback("error", "You cannot delete the Super Admin , this account is required for system integrity.");
      return;
    }
    try {
      await adminApi.deleteAdmin(id);
      fetchAdminUsers();
      showFeedback("success", "Admin deleted successfully.");
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to delete admin.");
    }
  };

  return (
    <div>
      {feedback && (
        <div
          className={`max-w-xl mx-auto mb-4 p-3 rounded ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Store Details */}
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
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={storeForm.phone}
                      onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                    <textarea
                      value={storeForm.address}
                      onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
                    <div className="flex items-center space-x-4">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 border flex items-center justify-center text-sm text-gray-400 rounded-lg">
                          No Image
                        </div>
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
                    <p className="text-xs text-gray-500 mt-2">
                      JPEG, PNG, JPG, WEBP — max 2MB
                    </p>
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

        {/* System Settings */}
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
              {/* Update Credentials */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Username (optional)</label>
                      <input
                        type="text"
                        placeholder="Leave blank to keep current"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      />
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                      Update Credentials
                    </button>
                  </form>
                </div>
              </div>

              {/* Admin Table and Add Admin */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4">Username</th>
                        <th className="text-left py-3 px-4">Last Login</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4">{user.lastLogin}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteAdmin(user.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Admin */}
                <form onSubmit={handleAddNewAdmin} className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Add Admin
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
