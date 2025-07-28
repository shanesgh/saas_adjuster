import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

export function Hero() {
  const features = [
    'Instant Historical Data Access',
    'Paperless Workflow Management',
    'AI-Powered Assistance',
,
  ];

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce-subtle"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce-subtle" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Trusted by many</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Automate Your{' '}
                  <span className="text-gradient"> Adjusting Workflow</span>
                  <br />
                  with AI
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Eliminate paperwork, accelerate decisions and leverage AI to instantly access insights from your historical data. Built specifically for insurance motor adjusters and assessors.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center space-x-4"
              >
                <Link
                  to="/signup"
                  className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 font-semibold"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

              </motion.div>
            </motion.div>

            {/* Right Column - Dashboard Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">Dashboard Overview</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary-700">$520,000</div>
                        <div className="text-sm text-primary-600">Reports Processed</div>
                      </div>
                      <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-accent-700">14</div>
                        <div className="text-sm text-accent-600">Active Surveys</div>
                      </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-32 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
  {(() => {
    const data = [
      { month: 'Jan', value: 120 },
      { month: 'Feb', value: 90 },
      { month: 'Mar', value: 150 },
      { month: 'Apr', value: 80 },
      { month: 'May', value: 130 },
      { month: 'Jun', value: 100 },
      { month: 'Jul', value: 170 },
      { month: 'Aug', value: 140 },
      { month: 'Sep', value: 110 },
      { month: 'Oct', value: 160 },
      { month: 'Nov', value: 95 },
      { month: 'Dec', value: 180 },
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <div style={{ width: '100%', padding: '0 1rem', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '80px', gap: '4px' }}>
          {data.map((point, index) => {
            const height = (point.value / maxValue) * 60; // bar height
            return (
              <div key={index} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '10px', marginBottom: '2px', color: '#333' }}>
                  {point.value}
                </div>
                <div
                  style={{
                    height: `${height}px`,
                    background: '#4f76e5',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
                <div style={{ fontSize: '10px', marginTop: '2px' }}>{point.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  })()}
</div>

                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent-500" />
                    <span className="text-sm font-medium">-60% Processing Time</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Real-time Case Updates</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}