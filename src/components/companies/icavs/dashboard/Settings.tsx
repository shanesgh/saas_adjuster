import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';

const generateMixedCasePIN = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pin = '';
  for (let i = 0; i < 7; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)];
  }
  return pin;
};

export const Settings = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', role: 'adjuster' });
  const [showPins, setShowPins] = useState({});

  const isOwner = user?.unsafeMetadata?.role === 'owner';
  const company = user?.unsafeMetadata?.company;

  useEffect(() => {
    if (isOwner) loadUsers();
  }, [isOwner]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${await user.getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const addUser = async () => {
    if (!newUser.firstName || !newUser.lastName) return;
    
    const pin = generateMixedCasePIN();
    const userData = {
      ...newUser,
      company,
      pin,
      pinExpiry: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days
      pinAttempts: 0,
      pinLockout: null
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getToken()}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setNewUser({ firstName: '', lastName: '', role: 'adjuster' });
        setShowAddUser(false);
      }
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await user.getToken()}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const togglePinVisibility = (userId) => {
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
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="adjuster">Adjuster</option>
                <option value="clerical">Clerical</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={addUser}
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
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{u.firstName} {u.lastName}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {u.role}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {u.pin && (
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
                  onClick={() => deleteUser(u.id)}
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