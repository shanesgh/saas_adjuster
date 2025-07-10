export const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses and individual adjusters",
      features: [
        "Up to 50 claims per month",
        "Basic AI analysis",
        "Email support",
        "Standard reporting",
        "Mobile access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month", 
      description: "Ideal for growing insurance companies",
      features: [
        "Up to 200 claims per month",
        "Advanced AI analysis",
        "Priority support",
        "Custom reporting",
        "API access",
        "Team collaboration"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited claims",
        "Full AI suite",
        "24/7 dedicated support",
        "Advanced analytics",
        "Custom integrations",
        "White-label options"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features with no hidden fees.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-lg p-8 ${plan.popular ? 'ring-2 ring-primary-500 relative' : 'border border-secondary-200'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                  <span className="text-secondary-600">{plan.period}</span>
                </div>
                <p className="text-secondary-600">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};