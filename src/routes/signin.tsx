import { createFileRoute } from "@tanstack/react-router";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

function SignInPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: "/dashboard" });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {/* {fallbackurl instead of redirect - dep} */}
        <SignIn
          routing="path"
          path="/signin"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary-500 hover:bg-primary-600",
              card: "shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
