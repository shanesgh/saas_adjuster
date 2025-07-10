import { createFileRoute } from '@tanstack/react-router';
import { Navigation } from '../components/SignupForm';
import { SignupForm } from '../components/SignupForm';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

function Signup() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join ZenAssess</h1>
              <p className="text-gray-600">Start your free trial today</p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}