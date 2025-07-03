
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

      <div className="space-y-8">
        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 p-4 border-b">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">systemSettings</h3>
            <span className="text-sm text-gray-500">Manage admin accounts and security settings</span>
          </div>

          {/* Update Credentials */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold">updateCredentials</h4>
            </div>

            <form onSubmit={handleUpdateCredentials} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">newUsernameOptional</label>
                <input
                  type="text"
                  placeholder="user"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">leaveBlankToKeep (user).</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">changePasswordOptional</label>
                <label className="block text-sm text-gray-600 mb-1">fillAllThreeFields</label>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">currentPassword</label>
                    <input
                      type="password"
                      placeholder="••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">newPassword</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">minimumSixCharacters</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">confirmNewPassword</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SettingsIcon className="w-4 h-4" />
                <span>updateCredentials</span>
              </button>
            </form>
          </div>

          {/* Admin Users Management */}
          <div className="p-6 border-t">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold">adminUsersManagement</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-600">username</th>
                    <th className="text-left py-2 text-gray-600">lastLogin</th>
                    <th className="text-left py-2 text-gray-600">status</th>
                    <th className="text-left py-2 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium">{user.username}</td>
                      <td className="py-3 text-gray-600">{user.lastLogin}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Admin */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Plus className="w-5 h-5 text-green-600" />
                <h5 className="font-semibold text-green-800">addNewAdmin</h5>
              </div>

              <form onSubmit={handleAddNewAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">username</label>
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
                  <label className="block text-sm text-gray-600 mb-1">newPassword</label>
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
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>addNewAdmin</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
