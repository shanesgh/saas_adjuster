import { createFileRoute } from '@tanstack/react-router';
import { Navigation } from '../components/Navigation';
import { Pricing as PricingComponent } from '../components/Pricing';
import { FAQ } from '../components/FAQ';

export const Route = createFileRoute('/pricing')({
  component: Pricing,
});

function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20">
        <PricingComponent />
        <FAQ />
      </div>
    </div>
  );
}