import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
              <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
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
                
                <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="mb-4">By accessing and using ZenAssess, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. Description of Service</h3>
                <p className="mb-4">ZenAssess provides AI-powered claims processing software for insurance companies and adjusters. Our service includes document analysis, workflow management, and historical data access.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. User Accounts</h3>
                <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Acceptable Use</h3>
                <p className="mb-4">You agree to use our service only for lawful purposes and in accordance with these terms. You may not use our service to transmit harmful, offensive, or illegal content, or to violate any applicable laws or regulations.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Intellectual Property</h3>
                <p className="mb-4">The service and its original content, features, and functionality are and will remain the exclusive property of ZenAssess and its licensors. The service is protected by copyright, trademark, and other laws.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Payment Terms</h3>
                <p className="mb-4">Paid services are billed in advance on a monthly or annual basis. Fees are non-refundable except as required by law or as specifically stated in our refund policy.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Data and Privacy</h3>
                <p className="mb-4">Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding your personal information.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Service Availability</h3>
                <p className="mb-4">We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend service for maintenance, updates, or other operational reasons.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Limitation of Liability</h3>
                <p className="mb-4">In no event shall ZenAssess be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                
                <h3 className="text-lg font-semibold mb-3">10. Termination</h3>
                <p className="mb-4">We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including breach of terms.</p>
                
                <h3 className="text-lg font-semibold mb-3">11. Changes to Terms</h3>
                <p className="mb-4">We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>
                
                <h3 className="text-lg font-semibold mb-3">12. Contact Information</h3>
                <p className="mb-4">If you have any questions about these Terms of Service, please contact us at legal@zenassess.com or through our contact form.</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-150 font-medium"
              >
                I Agree
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}