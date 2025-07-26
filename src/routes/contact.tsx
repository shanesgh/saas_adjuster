import { createFileRoute } from '@tanstack/react-router';
import { Navigation } from '../components/Navigation';
import { ContactForm } from '../components/ContactForm';

export const Route = createFileRoute('/contact')({
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to transform your claims processing? Let's discuss how ZenAssess can help your team.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}