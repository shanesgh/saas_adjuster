import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth, UserButton } from '@clerk/clerk-react';
import { Menu, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">ZenAssess</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-600 hover:text-primary-600 transition-colors duration-150 font-medium"
                activeProps={{ className: "text-primary-600" }}
              >
                {item.name}
              </Link>
            ))}
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-150 font-medium"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-150 font-medium"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/20"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors duration-150"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {isSignedIn ? (
                  <div className="mx-4 mt-4 flex items-center justify-between">
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-150 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <Link
                    to="/signup"
                    className="block mx-4 mt-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg text-center font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}