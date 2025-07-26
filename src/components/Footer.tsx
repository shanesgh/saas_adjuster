import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Linkedin, Mail } from "lucide-react";
import { PrivacyModal } from "./PrivacyModal";
import { TermsModal } from "./TermsModal";

export function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePricingClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const links = {
    product: [
      { name: "Features", path: "/" },
      { name: "Pricing", path: "/pricing", onClick: handlePricingClick },
    ],
    legal: [
      { name: "Privacy", action: () => setShowPrivacyModal(true) },
      { name: "Terms", action: () => setShowTermsModal(true) },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-24">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ZenAssess</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transform your adjusting workflow with AI-powered tools designed
              for insurance motor adjusters and assessors.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, categoryLinks]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {categoryLinks.map((link) => (
                  <li key={link.name}>
                    {"path" in link ? (
                      <Link
                        to={link.path}
                        onClick={link.onClick}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={link.action}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 ZenAssess. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">
              Made with ❤️ for assessment automation
            </span>
          </div>
        </div>
      </div>

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </footer>
  );
}
