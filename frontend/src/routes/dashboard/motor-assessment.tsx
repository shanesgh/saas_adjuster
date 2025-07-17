import { createFileRoute } from '@tanstack/react-router';
import { MotorAssessment } from '../../components/companies/icavs/dashboard/MotorAssessment';

export const Route = createFileRoute('/dashboard/motor-assessment')({
  component: MotorAssessment,
});