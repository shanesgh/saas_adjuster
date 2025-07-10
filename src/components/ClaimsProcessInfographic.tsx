export const ClaimsProcessInfographic = () => {
  const steps = [
    {
      number: "01",
      title: "Submit Claim",
      description: "Upload your claim details and supporting documents through our secure platform."
    },
    {
      number: "02", 
      title: "AI Analysis",
      description: "Our advanced AI system analyzes your claim for accuracy and completeness."
    },
    {
      number: "03",
      title: "Expert Review",
      description: "Qualified adjusters review and validate the AI analysis for final approval."
    },
    {
      number: "04",
      title: "Settlement",
      description: "Receive your settlement quickly through our streamlined payment process."
    }
  ];

  return (
    <section className="py-20 bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            How Our Claims Process Works
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Our streamlined digital process ensures fast, accurate, and transparent claim handling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {step.title}
              </h3>
              <p className="text-secondary-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};