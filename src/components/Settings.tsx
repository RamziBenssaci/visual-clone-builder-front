
import { useState } from "react";
import { Settings as SettingsIcon, User, Edit, Trash2, Plus } from "lucide-react";

interface AdminUser {
  username: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

const Settings = () => {
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [adminUsers] = useState<AdminUser[]>([
    { username: "admin", lastLogin: "Jul 3, 2025, 03:43 PM", status: "active" },
    { username: "manager", lastLogin: "Jul 2, 2025, 03:43 PM", status: "active" }
  ]);

  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating credentials...");
  };

  const handleAddNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new admin:", { username: newAdminUsername, password: newAdminPassword });
    setNewAdminUsername("");
    setNewAdminPassword("");
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">System Settings</h3>
            </div>
            <p className="text-blue-100 text-sm mt-1">Manage admin accounts and security settings</p>
          </div>

          <div className="p-6">
            {/* Update Credentials Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-800">Update Credentials</h4>
              </div>

              <div className="max-w-md mx-auto">
                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Username (Optional)
                    </label>
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

            {/* Admin Users Management */}
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
                      {adminUsers.map((user, index) => (
                        <tr key={index} className="border-t">
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
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

              {/* Add New Admin */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Plus className="w-5 h-5 text-green-600" />
                  <h5 className="font-semibold text-green-800">Add New Admin</h5>
                </div>

                <form onSubmit={handleAddNewAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="flex items-end">
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
