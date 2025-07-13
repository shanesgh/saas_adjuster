import { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
export const Settings = () => {
  const { user } = useUser();
  const { users, addUser, removeUser } = useUserStore();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', role: 'adjuster' as const });
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});

  const isOwner = user?.unsafeMetadata?.role === 'owner';
  const company = user?.unsafeMetadata?.company as string;

  const companyUsers = users.filter(u => u.company === company);

  const handleAddUser = () => {
    if (!newUser.firstName || !newUser.lastName || !company) return;
    
    addUser({
      ...newUser,
      company,
      pinExpiry: Date.now() + (3 * 24 * 60 * 60 * 1000),
    });
    
    setNewUser({ firstName: '', lastName: '', role: 'adjuster' });
    setShowAddUser(false);
  };

  const togglePinVisibility = (userId: string) => {
    setShowPins(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  if (!isOwner) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Access restricted to owners only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">User Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>

        {showAddUser && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Add New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as 'owner' | 'adjuster' | 'clerical'})}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="adjuster">Adjuster</option>
                <option value="clerical">Clerical</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleAddUser}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create User
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {companyUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{u.firstName} {u.lastName}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {u.role}
                </span>
                {!u.isRegistered && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Pending
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {u.pin && !u.isRegistered && (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">PIN:</span>
                    <span className="font-mono text-sm">
                      {showPins[u.id] ? u.pin : '•••••••'}
                    </span>
                    <button
                      onClick={() => togglePinVisibility(u.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPins[u.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}
                <button
                  onClick={() => removeUser(u.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};