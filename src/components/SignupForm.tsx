import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PrivacyModal } from "./PrivacyModal";
import { TermsModal } from "./TermsModal";
import { PinLoginForm } from "./PinLoginForm";
import { createCompany } from "@/lib/api";

const signupSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name must be less than 30 characters"),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name must be less than 30 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .regex(
        /^\+(?:[0-9] ?){6,14}[0-9]$/,
        "Phone number may start with '+' and but must contain 7–15 digits, optionally separated by spaces"
      ),
    company: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    plan: z.string().min(1, "Please select a plan"),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [signupError, setSignupError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const planOptions = [
    { value: "free", label: "Free Trial" },
    { value: "micro", label: "Micro - $2,500/year" },
    { value: "standard", label: "Standard - $4,000/year" },
    { value: "enterprise", label: "Enterprise - $6,200/year" },
  ];

  const onSubmit = async (data: SignupFormData) => {
    console.log("Form values on submit:", data);
    setSignupError(""); // Clear previous errors

    try {
      // Step 1: Create Clerk user
      const signUpResult = await signUp?.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        unsafeMetadata: {
          company: data.company,
          role: "owner",
        },
      });

      if (signUpResult?.status === "complete") {
        const userId = signUpResult.createdUserId!;

        const companyData = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          company_name: data.company,
          phone: data.phoneNumber,
          plan: data.plan,
          userId: userId,
          address: "",
        };

        console.log("Sending company data:", companyData);

        const res = await createCompany(companyData, userId);

        if (!res.success) {
          if (res.error === "Company already exists") {
            setSignupError(
              "A company with this email already exists. Please use a different email or contact support."
            );
          } else {
            setSignupError(
              `Company creation failed: ${res.error || "Unknown error"}`
            );
          }
          return;
        }

        // Step 4: Set active session and redirect
        await setActive?.({ session: signUpResult.createdSessionId });
        console.log("✅ Signup complete, redirecting to dashboard");
        navigate({ to: "/dashboard" });
      } else if (signUpResult?.status === "missing_requirements") {
        console.log("Email verification required");
        setSignupError("Please check your email for a verification link.");
      } else {
        console.error("Unexpected signup status:", signUpResult?.status);
        setSignupError(
          "Signup failed: Unexpected response from authentication service."
        );
      }
    } catch (error) {
      console.error("❌ Signup error:", error);

      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          setSignupError(
            "An account with this email already exists. Please try logging in instead."
          );
        } else if (error.message.includes("password")) {
          setSignupError(
            "Password does not meet requirements. Please try a different password."
          );
        } else {
          setSignupError(`Signup failed: ${error.message}`);
        }
      } else {
        setSignupError("Signup failed: Please try again.");
      }
    }
  };

  // Handle redirect after sign in - only redirect if user is actually signed in
  useEffect(() => {
    if (isSignedIn) {
      console.log("User is signed in, redirecting to dashboard");
      navigate({ to: "/dashboard" });
    }
  }, [isSignedIn, navigate]);

  const watchedPassword = watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["red", "orange", "yellow", "blue", "green"];

    return {
      strength: (strength / 5) * 100,
      label: labels[Math.min(strength - 1, 4)] || "",
      color: colors[Math.min(strength - 1, 4)] || "gray",
    };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  if (showLogin) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <PinLoginForm />
        <div className="text-center mt-4">
          <button
            onClick={() => setShowLogin(false)}
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Need to create an account?
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-6">
              <UserPlus className="w-12 h-12 text-primary-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Create Account
              </h2>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </div>
            </div>

            {/* Display signup error */}
            {signupError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">{signupError}</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  autoComplete="given-name"
                  {...register("first_name")}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                    errors.first_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {errors.first_name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.first_name.message}</span>
                  </motion.p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  autoComplete="family-name"
                  {...register("last_name")}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                    errors.last_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.last_name.message}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                autoComplete="email"
                {...register("email")}
                type="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="john@company.com"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email.message}</span>
                </motion.p>
              )}
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Name *
              </label>
              <input
                autoComplete="organization"
                {...register("company")}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                  errors.company ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Your Insurance Company"
              />
              {errors.company && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.company.message}</span>
                </motion.p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  autoComplete="tel"
                  {...register("phoneNumber")}
                  type="tel"
                  inputMode="tel"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                    errors.phoneNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="+18685551212"
                />
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phoneNumber.message}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-200 bg-${passwordStrength.color}-500`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm text-${passwordStrength.color}-600`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password.message}</span>
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword.message}</span>
                </motion.p>
              )}
            </div>

            {/* Plan Selection */}
            <div>
              <label
                htmlFor="plan"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Plan *
              </label>
              <select
                {...register("plan")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 ${
                  errors.plan ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Choose your plan</option>
                {planOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.plan && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.plan.message}</span>
                </motion.p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  {...register("acceptTerms")}
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.acceptTerms && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.acceptTerms.message}</span>
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-150 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Clerk CAPTCHA Element */}
            <div id="clerk-captcha"></div>
          </form>
        </div>
      </motion.div>

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
}
