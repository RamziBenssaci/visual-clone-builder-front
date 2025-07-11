import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Edit, Trash2, Plus, Store, ChevronDown } from "lucide-react";
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

  const [storeOpen, setStoreOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);

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
    try {
      await updateStoreDetails(storeForm);
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
        {/* Store Details Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center"
            onClick={() => setStoreOpen(!storeOpen)}
          >
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Store Details</h3>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${storeOpen ? "rotate-180" : ""}`} />
          </div>

          {storeOpen && (
            <div className="p-6">
              <div className="max-w-md mx-auto">
                <form onSubmit={handleStoreSubmit} className="space-y-4">
                  {/* name / phone / address inputs + button */}
                </form>
              </div>
            </div>
          )}
        </div>

        {/* System Settings Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center"
            onClick={() => setSystemOpen(!systemOpen)}
          >
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">System Settings</h3>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${systemOpen ? "rotate-180" : ""}`} />
          </div>

          {systemOpen && (
            <div className="p-6 space-y-8">
              {/* Update Credentials Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Update Credentials</h4>
                </div>

                <div className="max-w-md mx-auto">
                  <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    {/* Username + password fields + button */}
                  </form>
                </div>
              </div>

              {/* Admin Users Management */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Admin Users Management</h4>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      {/* Table headers and map of adminUsers */}
                    </table>
                  </div>
                </div>

                {/* Add New Admin */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Plus className="w-5 h-5 text-green-600" />
                    <h5 className="font-semibold text-green-800">Add New Admin</h5>
                  </div>

                  <form onSubmit={handleAddNewAdmin} className="max-w-md mx-auto">
                    {/* Username + password + button */}
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
