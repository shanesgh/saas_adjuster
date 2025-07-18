import { createFileRoute } from '@tanstack/react-router';
import { Main } from '../../components/companies/icavs/dashboard/Main';

export const Route = createFileRoute('/dashboard/')({
  component: Main,
});