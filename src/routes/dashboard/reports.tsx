import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '../../components/companies/icavs/dashboard/Reports';

export const Route = createFileRoute('/dashboard/reports')({
  component: Reports,
});