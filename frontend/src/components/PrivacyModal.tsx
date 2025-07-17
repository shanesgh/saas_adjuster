import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-gray max-w-none">
                <p className="text-sm text-gray-500 mb-4">Last updated: January 15, 2025</p>
                
                <h3 className="text-lg font-semibold mb-3">1. Information Collection</h3>
                <p className="mb-4">ZenAssess collects information you provide when creating accounts, using our claims processing services, and contacting support. This includes personal details, company information, claims data, and usage analytics.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. Data Usage</h3>
                <p className="mb-4">We use collected information to provide claims processing services, generate reports, improve our AI algorithms, process payments, and communicate important updates about your account and services.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
                <p className="mb-4">ZenAssess does not sell personal information. We may share data with service providers, legal authorities when required, and with your explicit consent for specific business purposes.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
                <p className="mb-4">We implement enterprise-grade security measures including encryption, secure data centers, regular security audits, and compliance with insurance industry standards to protect your sensitive claims data.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
                <p className="mb-4">Claims data is retained according to insurance industry requirements and legal obligations. Personal account information is kept while your account is active and for a reasonable period thereafter.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
                <p className="mb-4">You can access, update, or request deletion of your personal information. You may also export your claims data, opt out of marketing communications, and request data portability.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Cookies and Analytics</h3>
                <p className="mb-4">We use cookies for authentication, preferences, and analytics. Our AI systems analyze usage patterns to improve claims processing accuracy and user experience.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Policy Updates</h3>
                <p className="mb-4">Privacy policy updates will be communicated via email and dashboard notifications. Continued use of ZenAssess after changes constitutes acceptance of the updated policy.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Contact Information</h3>
                <p className="mb-4">For privacy questions or to exercise your rights, contact us at privacy@zenassess.com or use our secure contact form. Response time is typically 48 hours.</p>
                <h3 className="text-lg font-semibold mb-3">1. Information Collection</h3>
                <p className="mb-4">ZenAssess collects information you provide when creating accounts, using our claims processing services, and contacting support. This includes personal details, company information, claims data, and usage analytics.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. Data Usage</h3>
                <p className="mb-4">We use collected information to provide claims processing services, generate reports, improve our AI algorithms, process payments, and communicate important updates about your account and services.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
                <p className="mb-4">ZenAssess does not sell personal information. We may share data with service providers, legal authorities when required, and with your explicit consent for specific business purposes.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
                <p className="mb-4">We implement enterprise-grade security measures including encryption, secure data centers, regular security audits, and compliance with insurance industry standards to protect your sensitive claims data.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
                <p className="mb-4">Claims data is retained according to insurance industry requirements and legal obligations. Personal account information is kept while your account is active and for a reasonable period thereafter.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
                <p className="mb-4">You can access, update, or request deletion of your personal information. You may also export your claims data, opt out of marketing communications, and request data portability.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Cookies and Analytics</h3>
                <p className="mb-4">We use cookies for authentication, preferences, and analytics. Our AI systems analyze usage patterns to improve claims processing accuracy and user experience.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Policy Updates</h3>
                <p className="mb-4">Privacy policy updates will be communicated via email and dashboard notifications. Continued use of ZenAssess after changes constitutes acceptance of the updated policy.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Contact Information</h3>
                <p className="mb-4">For privacy questions or to exercise your rights, contact us at privacy@zenassess.com or use our secure contact form. Response time is typically 48 hours.</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-150 font-medium"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}