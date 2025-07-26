import { motion } from "framer-motion";
import { FileText, Search, Shield } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Smart Historical Search",
      description:
        'Ask questions like "Where can I get parts for a 2019 Corolla?" and get instant answers from your entire claims database. No more digging through files.',
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: FileText,
      title: "Paperless Workflow",
      description:
        "Complete digital claims processing from first view to report. Eliminate physical paperwork and reduce processing time by up to 60%.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Secure Claims Database",
      description:
        "All your claims data centralized and searchable with enterprise-grade security. HIPAA compliant and insurance industry certified.",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
              Everything Your Team Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline report processing and
              eliminate administrative bottlenecks
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-200"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mt-32 grid md:grid-cols-4 gap-8 text-center"
          >
            {[
              // { number: '2.1M+', label: 'Claims Processed' },
              // { number: '60%', label: 'Time Reduction' },
              // { number: '847', label: 'Active Adjusters' },
              // { number: '24/7', label: 'AI Support' }
            ].map((stat, index) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-4xl font-bold text-gradient">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
