import { useState } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
            <p className="text-gray-600 mb-3">
              We collect information you provide directly to us, such as when you create an account, 
              submit claims, or contact us for support.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
            <p className="text-gray-600 mb-3">
              We use the information we collect to provide, maintain, and improve our services, 
              process claims, and communicate with you.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Information Sharing</h3>
            <p className="text-gray-600 mb-3">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Data Security</h3>
            <p className="text-gray-600 mb-3">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@company.com or (555) 123-4567.
            </p>
          </section>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};