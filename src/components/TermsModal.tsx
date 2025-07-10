import { useState } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
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
            <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
            <p className="text-gray-600 mb-3">
              By accessing and using our service, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Use License</h3>
            <p className="text-gray-600 mb-3">
              Permission is granted to temporarily use our service for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">User Account</h3>
            <p className="text-gray-600 mb-3">
              You are responsible for safeguarding the password and for maintaining the 
              confidentiality of your account information.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Prohibited Uses</h3>
            <p className="text-gray-600 mb-3">
              You may not use our service for any unlawful purpose or to solicit others to 
              perform unlawful acts.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
            <p className="text-gray-600 mb-3">
              We reserve the right to modify or discontinue our service at any time without notice.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at 
              legal@company.com or (555) 123-4567.
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