export const Features = () => {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze claims for faster processing and improved accuracy.",
      icon: "🤖"
    },
    {
      title: "Real-time Tracking",
      description: "Track your claim status in real-time with detailed updates and transparent communication.",
      icon: "📊"
    },
    {
      title: "Secure Document Upload",
      description: "Upload and manage all your claim documents securely with enterprise-grade encryption.",
      icon: "🔒"
    },
    {
      title: "Expert Adjusters",
      description: "Our certified adjusters provide professional evaluation and personalized service.",
      icon: "👨‍💼"
    },
    {
      title: "Mobile Friendly",
      description: "Access your claims anytime, anywhere with our responsive mobile-optimized platform.",
      icon: "📱"
    },
    {
      title: "Fast Settlements",
      description: "Get your settlements processed quickly with our streamlined approval workflow.",
      icon: "⚡"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Experience the future of claims processing with our innovative features and technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border border-secondary-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};