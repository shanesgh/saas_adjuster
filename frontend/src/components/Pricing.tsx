import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Rocket, Gift, FileText, BarChart3, Shield, Users, Clock, Mail, Database, Zap } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Gift,
      price: 'Free',
      period: '1-month trial',
      description: 'Standard access for 1 month',
      features: [
        { name: 'Full access to all Standard features', icon: Check },
        { name: 'No credit card required', icon: Check },
        { name: '1-month trial, plus 2 week post-trial access', icon: Clock },
        { name: 'Ideal for small teams evaluating the platform', icon: Users }
      ],
      buttonText: 'Start Free Trial',
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Micro',
      icon: Star,
      price: '$2,500',
      period: 'per month',
      description: '1–2 users',
      features: [
        { name: 'Adjuster report application', icon: FileText, description: 'Create comprehensive adjuster reports' },        { name: 'Report preview', icon: FileText, description: 'Preview reports before finalizing' },

        { name: 'PDF report generation', icon: FileText, description: 'Export professional PDF reports instantly' },
        { name: 'AI data inquiries', icon: Zap, description: 'Ask questions about your claims data in natural language' },
        { name: 'Basic analytics', icon: BarChart3, description: 'Essential metrics and performance tracking' },
        { name: 'Valuation reporting', icon: FileText, description: 'Automated vehicle and damage valuations' },
        { name: 'Invoice scheduler', icon: Clock, description: 'Monitor and schedule invoice updates' },
        { name: 'Email support', icon: Mail, description: 'Standard email support during business hours' }
      ],
      buttonText: 'Get Started',
      popular: false,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Standard',
      icon: Rocket,
      price: '$4,000',
      period: 'per month',
      description: '3–4 users',
      features: [
        { name: 'Everything in Micro', icon: Check },
        { name: 'Advanced analytics', icon: BarChart3, description: 'Charts, estimations, trends from your own data' },
        { name: 'Priority email support', icon: Mail, description: '24-48 hour response time guarantee' },
        { name: 'Workflow edits', icon: Zap, description: 'Customize workflows to match your processes' },
        { name: 'Cloud storage media', icon: Database, description: 'Secure cloud storage for photos and documents' },
        { name: 'Cloud storage reports', icon: Database, description: 'Unlimited report storage and retrieval' },
        { name: 'Backup & recovery', icon: Shield, description: 'Automated backups with point-in-time recovery' }
      ],
      buttonText: 'Get Started',
      popular: true,
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: '$6,500',
      period: 'per month',
      description: '5–12 users',
      features: [
        { name: 'Everything in Standard', icon: Check },
        { name: '5-12 users included', icon: Users, description: 'Support for larger teams with role-based access' },
        { name: 'Enterprise security', icon: Shield, description: 'Advanced security features and compliance' },
        { name: 'Custom features & add-ons', icon: Zap, description: 'Tailored features for your specific needs' },
        { name: 'Secure infrastructure guarantees', icon: Shield, description: 'Dedicated infrastructure with uptime SLA' },
        { name: 'SLA guarantees', icon: Shield, description: '99.9% uptime guarantee with penalties' },
        { name: 'Global data access', icon: Database, description: 'Access your data from anywhere in the world' },
        { name: 'Internal vendor analytics', icon: BarChart3, description: 'Advanced analytics with vendor comparisons for business continuity and expansion' }
      ],
      buttonText: 'Get Started',
      popular: false,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing designed to grow with your claims processing needs.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 ${
                  plan.popular ? 'border-primary-200 ring-4 ring-primary-100' : 'border-gray-100'
                } hover:shadow-2xl transition-all duration-200`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Details */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="space-y-1 mb-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                      {plan.price !== 'Free' && <span className="text-lg text-gray-500 font-normal"> /{plan.period}</span>}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={typeof feature === 'string' ? feature : feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="flex items-start space-x-3">
                        {typeof feature === 'string' ? (
                          <>
                            <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </>
                        ) : (
                          <>
                            <feature.icon className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-gray-900 font-medium">{feature.name}</div>
                              {feature.description && (
                                <div className="text-sm text-gray-500 mt-1">{feature.description}</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg text-gray-600 mb-6">
              All plans can be upgraded or downgraded at any time.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <span>❤️ No setup fees</span>
              <span>❤️ Cancel anytime</span>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}