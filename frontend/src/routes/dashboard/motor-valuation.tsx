import { createFileRoute } from '@tanstack/react-router';
import { MotorValuation } from '../../components/companies/icavs/dashboard/MotorValuation';

export const Route = createFileRoute('/dashboard/motor-valuation')({
  component: MotorValuation,
});