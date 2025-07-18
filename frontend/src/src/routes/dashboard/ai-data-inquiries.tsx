import { createFileRoute } from '@tanstack/react-router';
import { AiDataInquiries } from '../../components/companies/icavs/dashboard/AiDataInquiries';

export const Route = createFileRoute('/dashboard/ai-data-inquiries')({
  component: AiDataInquiries,
});