import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export function PinLoginForm() {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const { findUser, validatePin, markUserRegistered } = useUserStore();
  
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
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNewUser) {
        // New user flow - validate PIN and create account
        if (!formData.pin || !formData.password || formData.password !== formData.confirmPassword) {
          setError('Please fill all fields and ensure passwords match');
          setLoading(false);
          return;
        }

        const userData = findUser(formData.firstName, formData.lastName, formData.company);
        
        if (!userData || !validatePin(userData.id, formData.pin)) {
          setError('Invalid credentials');
          setLoading(false);
          return;
        }

        // Create Clerk account
        try {
          const email = `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}@${userData.company.toLowerCase().replace(/\s+/g, '')}.local`;
          const result = await signUp?.create({
            emailAddress: email,
            password: formData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            unsafeMetadata: {
              company: userData.company,
              role: userData.role
            }
          });

          if (result?.status === 'complete') {
            await setActive?.({ session: result.createdSessionId });
            markUserRegistered(userData.id);
            navigate({ to: '/dashboard' });
          }
        } catch {
          setError('Registration failed');
        }
      } else {
        // Returning user flow - regular login
        if (!formData.password) {
          setError('Please enter your password');
          setLoading(false);
          return;
        }

        try {
          const email = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@${formData.company.toLowerCase().replace(/\s+/g, '')}.local`;
          const result = await signIn?.create({
            identifier: email,
            password: formData.password
          });

          if (result?.status === 'complete') {
            navigate({ to: '/dashboard' });
          }
        } catch {
          setError('Invalid credentials');
        }
      }
    } catch {
      setError('Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <LogIn className="w-12 h-12 text-primary-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Team Login</h2>
      </div>

      {/* User Type Selection */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsNewUser(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              !isNewUser 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Returning User
          </button>
          <button
            type="button"
            onClick={() => setIsNewUser(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isNewUser 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            New User
          </button>
        </div>
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

        {isNewUser && (
          <input
            name="pin"
            type="text"
            placeholder="7-Digit PIN"
            value={formData.pin}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            maxLength={7}
            required
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

        {isNewUser && (
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
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

        <div id="clerk-captcha"></div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : isNewUser ? 'Register & Login' : 'Login'}
        </button>
      </form>
    </div>
  );
}