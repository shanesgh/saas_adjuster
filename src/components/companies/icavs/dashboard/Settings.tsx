import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  UserPlus,
  Trash2,
  Eye,
  EyeOff,
  Building,
  Phone,
  Mail,
  MapPin,
  Save,
} from "lucide-react";
import { User, useUserStore } from "@/store/userStore";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePin } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";

type Role = User["role"];

export const Settings = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { users, addUser, removeUser } = useUserStore();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<{
    firstName: string;
    lastName: string;
    role: Role;
  }>({
    firstName: "",
    lastName: "",
    role: "adjuster",
  });

  const [showPins, setShowPins] = useState<Record<string, boolean>>({});
  const [companySettings, setCompanySettings] = useState({
    name: (user?.unsafeMetadata?.company as string) || "ZenAssess",
    address: "139 Eastern Main Road, Barataria, Trinidad and Tobago",
    phone: "1 (868) 235-5069",
    email: "info@zenassess.com",
    vatNumber: "131269",
    website: "www.zenassess.com",
  });
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = user?.unsafeMetadata?.role === "owner";
  const company = user?.unsafeMetadata?.company as string;

  const companyUsers = users.filter((u) => u.company === company);
  const handleAddUser = async () => {
    try {
      const token = await getToken();
      const result = await generatePin({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        userId: user?.id,
      }, token);

      if (!result || !result.success) {
        console.warn("Failed to generate PIN");
        return;
      }

      console.log(`PIN created:`);

      // Optionally show PIN in UI
      const updatedUser = {
        ...newUser,
        company,
        pin: result.pin,
        isRegistered: false, // assuming they haven't signed up yet
        id: user?.id,
        pinExpiry: new Date().getDate() + 5, // again: this must be the new user's ID
      };

      addUser(updatedUser); // 💡 Inject the user with PIN into your store

      // setExpiry(result.expiresAt);
    } catch (err) {
      console.error("Error generating PIN:", err);
      console.warn("Something went wrong while generating the PIN.");
    } finally {
      // This always runs—even if there's an error
      setNewUser({ firstName: "", lastName: "", role: "adjuster" });
      setShowAddUser(false);
    }
  };

  const togglePinVisibility = (userId: string) => {
    setShowPins((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings((prev) => ({ ...prev, [name]: value }));
  };

  const saveCompanySettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Company settings saved successfully!");
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <Tabs defaultValue="company">
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Company Information</h2>
              <p className="text-sm text-gray-500">
                Update your company details
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Building className="w-4 h-4 mr-2" />
                      Company Name
                    </label>
                    <Input
                      name="name"
                      value={companySettings.name}
                      onChange={handleCompanyChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <Input
                      name="email"
                      value={companySettings.email}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      value={companySettings.phone}
                      onChange={handleCompanyChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      Website
                    </label>
                    <Input
                      name="website"
                      value={companySettings.website}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Address
                  </label>
                  <Input
                    name="address"
                    value={companySettings.address}
                    onChange={handleCompanyChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Building className="w-4 h-4 mr-2" />
                    VAT Registration Number
                  </label>
                  <Input
                    name="vatNumber"
                    value={companySettings.vatNumber}
                    onChange={handleCompanyChange}
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={saveCompanySettings}
                    disabled={isSaving}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-600 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Team Members</h2>
                  <p className="text-sm text-gray-500">Manage your team</p>
                </div>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddUser && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-3">Add New User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={newUser.firstName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, firstName: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={newUser.lastName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lastName: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value as Role })
                      }
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
                {companyUsers.length > 0 ? (
                  companyUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">
                          {u.firstName} {u.lastName}
                        </span>
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
                              {showPins[u.id] ? u.pin : "•••••••"}
                            </span>
                            <button
                              onClick={() => togglePinVisibility(u.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {showPins[u.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No team members found</p>
                    <button
                      onClick={() => setShowAddUser(true)}
                      className="mt-2 text-blue-500 hover:text-blue-700 underline"
                    >
                      Add your first team member
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Billing Information</h2>
              <p className="text-sm text-gray-500">
                Manage your subscription and payment methods
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Current Plan
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-900">
                        Standard
                      </p>
                      <p className="text-sm text-blue-700">$4,000 per month</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Payment Method</h3>
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded p-2 mr-3">
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M3 10H21"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Billing History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            July 1, 2025
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            $4,000.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                            Download
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            June 1, 2025
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            $4,000.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                            Download
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Notification Settings</h2>
              <p className="text-sm text-gray-500">
                Manage your email preferences
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Report Status Updates</h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications when report status changes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">New Team Members</h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications when new users are added
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Marketing Updates</h3>
                    <p className="text-sm text-gray-500">
                      Receive product updates and marketing emails
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Billing Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive invoices and payment reminders
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 mt-4">
                  Save Preferences
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
