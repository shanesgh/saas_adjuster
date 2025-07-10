import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/contact')({
  component: Contact,
});

function Contact() {
  return (
    <div>
      <h1>Contact Page</h1>
    </div>
  );
}