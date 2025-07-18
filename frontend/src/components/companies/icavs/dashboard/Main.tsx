import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

export const Main = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const authToken = await getToken();
        setToken(authToken);
        console.log('Clerk Token:', authToken);
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    fetchToken();
  }, [getToken]);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">ICAVS Dashboard Overview</h1>
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <p className="text-gray-600">Welcome to the ICAVS dashboard main overview page.</p>
        
        {/* Temporary Token Display for Testing */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🔧 Development Token (Remove in Production)</h3>
          {token ? (
            <div className="space-y-2">
              <p className="text-xs text-yellow-700">Copy this token for API testing:</p>
              <div className="bg-white p-2 rounded border font-mono text-xs break-all select-all">
                {token}
              </div>
              <p className="text-xs text-yellow-600">
                Use in API calls: <code>Authorization: Bearer {token.substring(0, 20)}...</code>
              </p>
            </div>
          ) : (
            <p className="text-xs text-yellow-700">Loading token...</p>
          )}
        </div>
      </div>
    </div>
  );
};