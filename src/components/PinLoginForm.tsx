import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { validatePin } from "@/lib/api";

export function PinLoginForm() {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    pin: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
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

    console.log("=== PIN LOGIN FORM SUBMISSION ===");
    console.log("Form data:", formData);
    console.log("Is new user:", isNewUser);

    try {
      if (isNewUser) {
        console.log("Processing new user registration...");

        // New user flow - validate PIN and create account
        if (
          !formData.pin ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.company ||
          !formData.password ||
          formData.password !== formData.confirmPassword
        ) {
          console.log("Validation failed: Missing fields or password mismatch");
          setError("Please fill all fields and ensure passwords match");
          setLoading(false);
          return;
        }

        console.log("Validating PIN with database...");

        const pinUserData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          pin: formData.pin,
        };
        // Call API to validate PIN
        try {
          const pinResponse = await validatePin(pinUserData);
          console.log("PIN validation response:", pinResponse);

          if (!pinResponse.ok || !pinResponse.valid) {
            console.log("PIN validation failed");
            setError("Invalid credentials or PIN has expired");
            setLoading(false);
            return;
          }

          console.log("PIN validated successfully, creating Clerk account...");

          // Create Clerk account using validated data
          try {
            const email = `generic.${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@${formData.company
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/[^a-z0-9]/g, "")}.com`;

            const pinNewUserData = {
              emailAddress: email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              unsafeMetadata: {
                company: formData.company,
                role: pinResponse.userRole,
              },
            };
            console.log("Creating signup with data:", pinNewUserData);

            const result = await signUp?.create({
              emailAddress: email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              unsafeMetadata: {
                company: formData.company,
                role: pinResponse.userRole,
              },
            });

            console.log("Signup result:", result);
            console.log("Signup status:", result?.status);

            if (result?.status === "complete") {
              console.log("Signup complete, setting active session...");
              await setActive?.({ session: result.createdSessionId });

              // console.log("Deleting used PIN from database...");
              // // Delete the PIN record since it's no longer needed
              // await fetch("/api/delete-pin", {
              //   method: "POST",
              //   headers: { "Content-Type": "application/json" },
              //   body: JSON.stringify({
              //     pinId: pinData.pinId,
              //   }),
              // });

              console.log("Navigating to dashboard...");
              navigate({ to: "/dashboard" });
            } else {
              console.log("Signup not complete, status:", result?.status);
              setError("Registration incomplete - please try again");
            }
          } catch (clerkError) {
            console.error("Clerk signup error:", clerkError);
            console.error(
              "Error details:",
              JSON.stringify(clerkError, null, 2)
            );
            setError("Registration failed");
          }
        } catch (apiError) {
          console.error("PIN validation API error:", apiError);
          setError("Unable to validate PIN - please try again");
          setLoading(false);
          return;
        }
      } else {
        console.log("Processing returning user login...");
        // Returning user flow - regular login
        if (!formData.password || !formData.company) {
          console.log("Missing fields, please try again");
          setError("Please enter your password");
          setLoading(false);
          return;
        }

        try {
          const email = `generic.${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@${formData.company
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9]/g, "")}.com`;
          console.log("Attempting login with email:", email);

          const result = await signIn?.create({
            identifier: email,
            password: formData.password,
          });

          console.log("Login result:", result);
          console.log("Login status:", result?.status);

          if (result?.status === "complete") {
            console.log("Login successful, navigating to dashboard...");
            navigate({ to: "/dashboard" });
          } else {
            console.log("Login not complete, status:", result?.status);
            setError("Login incomplete - please try again");
          }
        } catch (loginError) {
          console.error("Login error:", loginError);
          console.error("Error details:", JSON.stringify(loginError, null, 2));
          setError("Invalid credentials");
        }
      }
    } catch (generalError) {
      console.error("General error:", generalError);
      console.error("Error details:", JSON.stringify(generalError, null, 2));
      setError("Login failed");
    }

    console.log("=== END PIN LOGIN FORM SUBMISSION ===");
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
                ? "bg-primary-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Returning User
          </button>
          <button
            type="button"
            onClick={() => setIsNewUser(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isNewUser
                ? "bg-primary-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
            placeholder="8-Digit PIN"
            value={formData.pin}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            maxLength={8}
            required
          />
        )}

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="password"
            className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {isNewUser && (
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
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
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
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
          {loading ? "Processing..." : isNewUser ? "Register & Login" : "Login"}
        </button>
      </form>
    </div>
  );
}
