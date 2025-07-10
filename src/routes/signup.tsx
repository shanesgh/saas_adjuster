import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

function Signup() {
  return (
    <div>
      <h1>Signup Page</h1>
    </div>
  );
}