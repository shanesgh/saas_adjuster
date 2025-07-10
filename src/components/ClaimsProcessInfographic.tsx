import { motion } from 'framer-motion';
import { Car, Camera, Tablet, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export function ClaimsProcessInfographic() {
  const steps = [
    {
      icon: Car,
      title: 'Accident Occurs',
      description: 'Vehicle damage from collision',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Camera,
      title: 'Photo Assessment',
      description: 'Adjuster takes photos of damage',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Tablet,
      title: 'ZenAssess Analysis',
      description: 'Adjuster inputs information on application',
      color: 'from-primary-500 to-secondary-500'
    },
    {
      icon: FileText,
      title: 'Report Generation',
      description: 'Automated report created',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CheckCircle,
      title: 'Workflow Completed',
      description: 'Fast resolution for customer',
      color: 'from-accent-500 to-accent-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-4">
              From Crash to Report in Minutes
            </h2>
            <p className="text-xl text-gray-600">
              See how ZenAssess transforms the traditional adjusting process
            </p>
          </motion.div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 via-primary-300 to-accent-300 transform -translate-y-1/2"></div>
              
              <div className="flex justify-between items-center relative z-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center max-w-xs"
                  >
                    {/* Icon Circle */}
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Step Number */}
                    <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 mb-3">
                      {index + 1}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                {/* Icon Circle */}
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 lg:hidden" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to streamline your assessment process?
              </h3>
             
              <div className="flex items-center justify-center space-x-4">
                <div className="text-sm text-gray-500">
                  ⏱️ 60% faster processing
                </div>
                <div className="text-sm text-gray-500">
                  📱 Mobile-first design
                </div>
                <div className="text-sm text-gray-500">
                  🤖 AI-powered accuracy
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}