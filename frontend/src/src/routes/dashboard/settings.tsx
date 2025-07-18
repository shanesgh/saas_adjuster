import { createFileRoute } from '@tanstack/react-router';
import { Settings } from '../../components/companies/icavs/dashboard/Settings';

export const Route = createFileRoute('/dashboard/settings')({
  component: Settings,
});