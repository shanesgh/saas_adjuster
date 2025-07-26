import { createFileRoute } from '@tanstack/react-router';
import { Analytics } from '../../components/companies/icavs/dashboard/Analytics';

export const Route = createFileRoute('/dashboard/analytics')({
  component: Analytics,
});