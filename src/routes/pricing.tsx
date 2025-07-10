import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pricing')({
  component: Pricing,
});

function Pricing() {
  return (
    <div>
      <h1>Pricing Page</h1>
    </div>
  );
}