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
import { createCompany } from "@/lib/api";

// Country codes with validation
const countryCodes = [
  { code: "+1", country: "US/CA", digits: 10, flag: "🇺🇸" },
  { code: "+44", country: "UK", digits: 10, flag: "🇬🇧" },
  { code: "+1868", country: "TT", digits: 7, flag: "🇹🇹" },
  { code: "+1876", country: "JM", digits: 7, flag: "🇯🇲" },
  { code: "+1246", country: "BB", digits: 7, flag: "🇧🇧" },
];

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
    countryCode: z.string().min(1, "Please select country code"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    company: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be less than 200 characters"),
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
  })
  .refine((data) => {
    const country = countryCodes.find(c => c.code === data.countryCode);
    if (!country) return false;
    const phoneRegex = new RegExp(`^\\d{${country.digits}}$`);
    return phoneRegex.test(data.phoneNumber.replace(/\s/g, ''));
  }, {
    message: "Invalid phone number for selected country",
    path: ["phoneNumber"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
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
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      countryCode: "+1868", // Default to Trinidad
    },
  });

  const planOptions = [
    { value: "free", label: "Free Trial" },
    { value: "micro", label: "Micro - $2,500/year" },
    { value: "standard", label: "Standard - $4,000/year" },
    { value: "enterprise", label: "Enterprise - $6,200/year" },
  ];

  const watchedCountryCode = watch("countryCode");
  const selectedCountry = countryCodes.find(c => c.code === watchedCountryCode);

  const onSubmit = async (data: SignupFormData) => {
    console.log("Form values on submit:", data);
    setSignupError(""); // Clear previous errors

    try {
      const fullPhoneNumber = data.countryCode + data.phoneNumber.replace(/\s/g, '');
      
      // Step 1: Create Clerk user
      const signUpResult = await signUp?.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
      });

      if (signUpResult?.status === "complete") {
        const userId = signUpResult.createdUserId!;

        const companyData = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          company_name: data.company,
          phone: fullPhoneNumber,
          plan: data.plan,
          userId: userId,
          address: data.address,
        };

        console.log("Sending company data:", companyData);

        // Get token for API call
        const session = await setActive?.({ session: signUpResult.createdSessionId });
        const token = await session?.createdSessionId;
        const res = await createCompany(companyData, userId, token);

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


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-3">
              <UserPlus className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Create Account
              </h2>
            </div>

            {/* Display signup error */}
            {signupError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-2"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700">{signupError}</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {/* First Name */}
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  autoComplete="given-name"
                  {...register("first_name")}
                  type="text"
                  className={`w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                    errors.first_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {errors.first_name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.first_name.message}</span>
                  </motion.p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  autoComplete="family-name"
                  {...register("last_name")}
                  type="text"
                  className={`w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                    errors.last_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.last_name.message}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                autoComplete="email"
                {...register("email")}
                type="email"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="john@company.com"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email.message}</span>
                </motion.p>
              )}
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name *
              </label>
              <input
                autoComplete="organization"
                {...register("company")}
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                  errors.company ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Your Insurance Company"
              />
              {errors.company && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.company.message}</span>
                </motion.p>
              )}
            </div>
            
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Address *
              </label>
              <input
                autoComplete="street-address"
                {...register("address")}
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                  errors.address ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="123 Main Street, City, Country"
              />
              {errors.address && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.address.message}</span>
                </motion.p>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Phone Number */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <div className="flex">
                  <select
                    {...register("countryCode")}
                    className="px-2 py-1.5 border border-r-0 rounded-l-lg focus:ring-2 focus:ring-primary-500 text-sm bg-gray-50"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    inputMode="numeric"
                    className={`flex-1 px-2 py-1.5 border rounded-r-lg focus:ring-2 focus:ring-primary-500 text-sm ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={selectedCountry ? `${'0'.repeat(selectedCountry.digits)}` : "Phone number"}
                    maxLength={selectedCountry?.digits || 10}
                  />
                </div>
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phoneNumber.message}</span>
                  </motion.p>
                )}
                {errors.countryCode && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.countryCode.message}</span>
                  </motion.p>
                )}
              </div>
              
              {/* Plan Selection */}
              <div>
                <label
                  htmlFor="plan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Plan *
                </label>
                <select
                  {...register("plan")}
                  className={`w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                    errors.plan ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose plan</option>
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
                    className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.plan.message}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="mt-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-200 bg-${passwordStrength.color}-500`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs text-${passwordStrength.color}-600`}
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
                  className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password.message}</span>
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 text-sm ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.confirmPassword.message}</span>
                </motion.p>
              )}
            </div>


            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  {...register("acceptTerms")}
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
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
                  className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.acceptTerms.message}</span>
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-150 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
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
