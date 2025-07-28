import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";

export function PinLoginForm() {
  const { signIn } = useSignIn();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      const result = await signIn?.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result?.status === "complete") {
        navigate({ to: "/dashboard" });
      } else {
        setError("Login failed - please try again");
      }
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
      <div className="text-center mb-4">
        <LogIn className="w-8 h-8 text-primary-500 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}