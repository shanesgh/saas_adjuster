import { createFileRoute } from '@tanstack/react-router';
import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { ClaimsProcessInfographic } from '../components/ClaimsProcessInfographic';
import { Features } from '../components/Features';
import { Pricing } from '../components/Pricing';
import { CTA } from '../components/CTA';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="space-y-0">
      <Navigation />
      <Hero />
      <ClaimsProcessInfographic />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
}