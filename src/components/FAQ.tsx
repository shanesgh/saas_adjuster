export const FAQ = () => {
  const faqs = [
    {
      question: "How long does the claims process take?",
      answer: "Most claims are processed within 24-48 hours using our AI-powered analysis. Complex cases may take up to 5 business days."
    },
    {
      question: "Is my data secure on your platform?",
      answer: "Yes, we use enterprise-grade encryption and comply with all industry security standards including SOC 2 Type II certification."
    },
    {
      question: "Can I integrate with my existing systems?",
      answer: "Absolutely! We offer robust API integrations and work with most major insurance management systems."
    },
    {
      question: "What types of claims do you support?",
      answer: "We support auto, property, liability, and workers' compensation claims. Custom claim types can be configured for enterprise clients."
    },
    {
      question: "Do you offer training for new users?",
      answer: "Yes, we provide comprehensive onboarding, training materials, and ongoing support to ensure your team is successful."
    },
    {
      question: "What happens if I need to cancel?",
      answer: "You can cancel anytime with 30 days notice. We'll help you export your data and ensure a smooth transition."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Find answers to common questions about our claims processing platform.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-secondary-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};