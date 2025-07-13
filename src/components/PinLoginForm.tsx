import { useState, useEffect } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export function PinLoginForm() {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    pin: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const checkUserExists = () => {
    const stored = localStorage.getItem(`company_users_${formData.company}`);
    if (!stored) return null;
    
    const users = JSON.parse(stored);
    return users.find(u => 
      u.firstName.toLowerCase() === formData.firstName.toLowerCase() &&
      u.lastName.toLowerCase() === formData.lastName.toLowerCase() &&
      u.company === formData.company
    );
  };

  const validatePin = (userData) => {
    if (!userData.pin || userData.isRegistered) return false;
    if (userData.pinExpiry < Date.now()) return false;
    if (userData.pinLockout && userData.pinLockout > Date.now()) return false;
    if (userData.pinAttempts >= 3) return false;
    
    if (userData.pin !== formData.pin) {
      // Update attempts
      const stored = localStorage.getItem(`company_users_${formData.company}`);
      const users = JSON.parse(stored);
      const userIndex = users.findIndex(u => u.id === userData.id);
      users[userIndex].pinAttempts++;
      
      if (users[userIndex].pinAttempts >= 3) {
        users[userIndex].pinLockout = Date.now() + (30 * 60 * 1000); // 30 min
      }
      
      localStorage.setItem(`company_users_${formData.company}`, JSON.stringify(users));
      return false;
    }
    
    return true;
  };

  const markUserRegistered = (userData) => {
    const stored = localStorage.getItem(`company_users_${formData.company}`);
    const users = JSON.parse(stored);
    const userIndex = users.findIndex(u => u.id === userData.id);
    users[userIndex].isRegistered = true;
    users[userIndex].pin = null; // Single use
    localStorage.setItem(`company_users_${formData.company}`, JSON.stringify(users));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = checkUserExists();
      
      if (!userData) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      if (userData.isRegistered) {
        // Returning user - regular login
        try {
          const email = `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}@${userData.company.toLowerCase().replace(/\s+/g, '')}.local`;
          const result = await signIn.create({
            identifier: email,
            password: formData.password
          });

          if (result.status === 'complete') {
            navigate({ to: '/dashboard' });
          }
        } catch {
          setError('Invalid credentials');
        }
      } else {
        // First-time user - validate PIN and register
        if (!formData.pin || !formData.password || formData.password !== formData.confirmPassword) {
          setError('Please fill all fields and ensure passwords match');
          setLoading(false);
          return;
        }

        if (!validatePin(userData)) {
          setError('Invalid PIN or PIN expired');
          setLoading(false);
          return;
        }

        // Register user with Clerk
        try {
          const email = `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}@${userData.company.toLowerCase().replace(/\s+/g, '')}.local`;
          const result = await signUp.create({
            emailAddress: email,
            password: formData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            unsafeMetadata: {
              company: userData.company,
              role: userData.role
            }
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            markUserRegistered(userData);
            navigate({ to: '/dashboard' });
          }
        } catch {
          setError('Registration failed');
        }
      }
    } catch {
      setError('Login failed');
    }

    setLoading(false);
  };

  // Check if user exists when form changes
  useEffect(() => {
    if (formData.firstName && formData.lastName && formData.company) {
      const userData = checkUserExists();
      setIsFirstTime(userData && !userData.isRegistered);
    }
  }, [formData.firstName, formData.lastName, formData.company]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <LogIn className="w-12 h-12 text-primary-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Team Login</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <input
          name="company"
          type="text"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />

        {isFirstTime && (
          <input
            name="pin"
            type="text"
            placeholder="7-Digit PIN"
            value={formData.pin}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            maxLength={7}
          />
        )}

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {isFirstTime && (
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}