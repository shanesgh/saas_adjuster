import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

// PIN Login Schema
const pinLoginSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().min(1, "Company name is required"),
  pin: z.string().min(1, "PIN is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Regular Login Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type PinLoginData = z.infer<typeof pinLoginSchema>;
type LoginData = z.infer<typeof loginSchema>;

function SignInPage() {
  const { isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const pinForm = useForm<PinLoginData>({
    resolver: zodResolver(pinLoginSchema),
    mode: "onChange",
  });

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Redirect if already signed in
  if (isSignedIn) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const handlePinLogin = async (data: PinLoginData) => {
    setLoginError("");
    try {
      // Step 1: Validate PIN
      const pinResponse = await fetch("/api/users/validate-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          pin: data.pin,
        }),
      });

      const pinResult = await pinResponse.json();
      
      if (!pinResult.valid) {
        setLoginError(pinResult.error || "Invalid PIN");
        return;
      }

      // Step 2: Create Clerk account
      const signUpResult = await signIn?.create({
        identifier: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          company: data.company,
          role: pinResult.role,
          companyId: pinResult.companyId,
        },
      });

      if (signUpResult?.status === "complete") {
        await setActive?.({ session: signUpResult.createdSessionId });
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      console.error("PIN login error:", error);
      setLoginError("Login failed. Please try again.");
    }
  };

  const handleRegularLogin = async (data: LoginData) => {
    setLoginError("");
    try {
      const result = await signIn?.create({
        identifier: data.email,
        password: data.password,
      });

      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="text-center mb-6">
            <LogIn className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <div className="flex justify-center space-x-2 mt-3">
              <button
                type="button"
                onClick={() => setIsNewUser(false)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  !isNewUser
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Returning User
              </button>
              <button
                type="button"
                onClick={() => setIsNewUser(true)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  isNewUser
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                New User (PIN)
              </button>
            </div>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-700">{loginError}</p>
              </div>
            </motion.div>
          )}

          {isNewUser ? (
            <form onSubmit={pinForm.handleSubmit(handlePinLogin)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  {...pinForm.register("firstName")}
                  placeholder="First Name"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <input
                  {...pinForm.register("lastName")}
                  placeholder="Last Name"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              
              <input
                {...pinForm.register("company")}
                placeholder="Company Name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              />
              
              <input
                {...pinForm.register("pin")}
                placeholder="PIN (from owner)"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              />
              
              <input
                {...pinForm.register("email")}
                type="email"
                placeholder="Your Email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              />
              
              <div className="relative">
                <input
                  {...pinForm.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={pinForm.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg hover:shadow-lg transition-all"
              >
                {pinForm.formState.isSubmitting ? "Creating Account..." : "Create Account with PIN"}
              </button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(handleRegularLogin)} className="space-y-4">
              <input
                {...loginForm.register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              />
              
              <div className="relative">
                <input
                  {...loginForm.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg hover:shadow-lg transition-all"
              >
                {loginForm.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Need an account?{" "}
              <button
                onClick={() => navigate({ to: "/signup" })}
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}