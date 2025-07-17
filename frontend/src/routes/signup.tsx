import { createFileRoute } from '@tanstack/react-router';
import { SignupForm } from '../components/SignupForm';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-4">
              Start Your Journey
            </h1>
            <p className="text-gray-600">
              Create your account and unlock powerful business tools
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}