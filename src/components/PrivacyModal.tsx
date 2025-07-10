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
                <p className="text-sm text-gray-500 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                
                <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                <p className="mb-4">We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, company information, and usage data.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and comply with legal obligations.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
                <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
                <p className="mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption and security protocols.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
                <p className="mb-4">We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
                <p className="mb-4">You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. Contact us to exercise these rights.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Cookies and Tracking</h3>
                <p className="mb-4">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Changes to This Policy</h3>
                <p className="mb-4">We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Contact Us</h3>
                <p className="mb-4">If you have any questions about this privacy policy or our data practices, please contact us at privacy@zenassess.com or through our contact form.</p>
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