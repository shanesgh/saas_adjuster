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
                <p className="text-sm text-gray-500 mb-4">Last updated: January 15, 2025</p>
                
                <h3 className="text-lg font-semibold mb-3">1. Service Agreement</h3>
                <p className="mb-4">By using ZenAssess claims processing platform, you agree to these terms. ZenAssess provides AI-powered insurance claims management, document processing, and workflow automation for insurance professionals.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. Account Responsibilities</h3>
                <p className="mb-4">You are responsible for account security, accurate information, and all activities under your account. Notify us immediately of unauthorized access or security breaches.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Acceptable Use</h3>
                <p className="mb-4">Use ZenAssess only for legitimate insurance claims processing. Prohibited: illegal activities, data breaches, system interference, or violating insurance regulations and privacy laws.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Subscription and Billing</h3>
                <p className="mb-4">Subscriptions are billed monthly or annually in advance. Free trials convert to paid plans automatically. Fees are non-refundable except as required by law or our refund policy.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Data Ownership</h3>
                <p className="mb-4">You retain ownership of your claims data. ZenAssess owns the platform, AI algorithms, and aggregated analytics. We may use anonymized data to improve our services.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Service Availability</h3>
                <p className="mb-4">We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance. Enterprise plans include SLA guarantees.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
                <p className="mb-4">ZenAssess liability is limited to your subscription fees. We are not liable for indirect damages, data loss, or business interruption. Insurance decisions remain your responsibility.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Termination</h3>
                <p className="mb-4">Either party may terminate with 30 days notice. We may suspend accounts for terms violations. Upon termination, you can export your data for 90 days.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Updates and Changes</h3>
                <p className="mb-4">Terms may be updated with 30 days notice for material changes. Continued use constitutes acceptance. We'll notify you via email and dashboard announcements.</p>
                
                <h3 className="text-lg font-semibold mb-3">10. Contact and Support</h3>
                <p className="mb-4">For questions about these terms, contact legal@zenassess.com. For technical support, use our help center or contact support@zenassess.com.</p>
                <h3 className="text-lg font-semibold mb-3">1. Service Agreement</h3>
                <p className="mb-4">By using ZenAssess claims processing platform, you agree to these terms. ZenAssess provides AI-powered insurance claims management, document processing, and workflow automation for insurance professionals.</p>
                
                <h3 className="text-lg font-semibold mb-3">2. Account Responsibilities</h3>
                <p className="mb-4">You are responsible for account security, accurate information, and all activities under your account. Notify us immediately of unauthorized access or security breaches.</p>
                
                <h3 className="text-lg font-semibold mb-3">3. Acceptable Use</h3>
                <p className="mb-4">Use ZenAssess only for legitimate insurance claims processing. Prohibited: illegal activities, data breaches, system interference, or violating insurance regulations and privacy laws.</p>
                
                <h3 className="text-lg font-semibold mb-3">4. Subscription and Billing</h3>
                <p className="mb-4">Subscriptions are billed monthly or annually in advance. Free trials convert to paid plans automatically. Fees are non-refundable except as required by law or our refund policy.</p>
                
                <h3 className="text-lg font-semibold mb-3">5. Data Ownership</h3>
                <p className="mb-4">You retain ownership of your claims data. ZenAssess owns the platform, AI algorithms, and aggregated analytics. We may use anonymized data to improve our services.</p>
                
                <h3 className="text-lg font-semibold mb-3">6. Service Availability</h3>
                <p className="mb-4">We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance. Enterprise plans include SLA guarantees.</p>
                
                <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
                <p className="mb-4">ZenAssess liability is limited to your subscription fees. We are not liable for indirect damages, data loss, or business interruption. Insurance decisions remain your responsibility.</p>
                
                <h3 className="text-lg font-semibold mb-3">8. Termination</h3>
                <p className="mb-4">Either party may terminate with 30 days notice. We may suspend accounts for terms violations. Upon termination, you can export your data for 90 days.</p>
                
                <h3 className="text-lg font-semibold mb-3">9. Updates and Changes</h3>
                <p className="mb-4">Terms may be updated with 30 days notice for material changes. Continued use constitutes acceptance. We'll notify you via email and dashboard announcements.</p>
                
                <h3 className="text-lg font-semibold mb-3">10. Contact and Support</h3>
                <p className="mb-4">For questions about these terms, contact legal@zenassess.com. For technical support, use our help center or contact support@zenassess.com.</p>
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