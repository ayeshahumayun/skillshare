import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { 
  FaChalkboardTeacher, 
  FaTwitter, 
  FaFacebook, 
  FaGithub,
  FaPaperPlane
} from 'react-icons/fa';

const Footer = () => {
  return (
    // --- UPDATED: Main background to brand-dark ---
    <footer className="bg-brand-dark text-gray-400">
      <div className="container mx-auto px-6 py-24"> 
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-3">
            <RouterLink to="/" className="flex items-center space-x-2 text-2xl font-bold text-white mb-4 transition-opacity hover:opacity-80">
              {/* --- UPDATED: Accent color --- */}
              <FaChalkboardTeacher className="text-brand-accent" />
              <span>Campus Skill Share</span>
            </RouterLink>
            <p className="text-gray-500 pr-4">
              Connecting students, one skill at a time. Join our community to learn, share, and grow together.
            </p>
          </div>
          
          {/* Explore Links */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Explore</h4>
            <ul className="space-y-3">
              <li><FooterScrollLink to="features">Features</FooterScrollLink></li>
              <li><FooterScrollLink to="about">About Us</FooterScrollLink></li>
              <li><FooterScrollLink to="contact">Contact</FooterScrollLink></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Account</h4>
            <ul className="space-y-3">
              <li><FooterRouterLink to="/login">Login</FooterRouterLink></li>
              <li><FooterRouterLink to="/register">Register</FooterRouterLink></li>
              <li><FooterRouterLink to="/dashboard">Dashboard</FooterRouterLink></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Legal</h4>
            <ul className="space-y-3">
              <li><FooterRouterLink to="/privacy">Privacy Policy</FooterRouterLink></li>
              <li><FooterRouterLink to="/terms">Terms of Service</FooterRouterLink></li>
              <li><FooterRouterLink to="/cookies">Cookie Policy</FooterRouterLink></li>
            </ul>
          </div>
          
          {/* Newsletter Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Stay Updated</h4>
            <p className="mb-4">
              Subscribe to our newsletter to get the latest news and updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md 
                           text-white focus:outline-none focus:border-brand-accent transition-colors"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-5 py-3 bg-brand-accent text-brand-dark rounded-md 
                           font-semibold hover:brightness-95 transition-colors
                           flex-shrink-0 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row 
                        justify-between items-center text-sm text-gray-500">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Campus Skill Share. All rights reserved.
          </p>
          <div className="flex space-x-5">
            <SocialIcon href="#" icon={<FaTwitter />} label="Twitter" />
            <SocialIcon href="#" icon={<FaFacebook />} label="Facebook" />
            <SocialIcon href="#" icon={<FaGithub />} label="GitHub" />
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- Helper Components --- */

// Helper for Social Media Icons
const SocialIcon = ({ href, icon, label }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-500 hover:text-brand-accent 
               transition-all duration-300 transform hover:scale-110"
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })} 
  </a>
);

// Helper for Footer Scroll Links
const FooterScrollLink = ({ to, children }) => (
  <ScrollLink
    to={to}
    smooth={true}
    duration={500}
    offset={-70}
    className="text-gray-300 hover:text-brand-accent hover:translate-x-1 transition-all duration-300 cursor-pointer block"
  >
    {children}
  </ScrollLink>
);

// Helper for Footer Router Links
const FooterRouterLink = ({ to, children }) => (
  <RouterLink
    to={to}
    className="text-gray-300 hover:text-brand-accent hover:translate-x-1 transition-all duration-300 cursor-pointer block"
  >
    {children}
  </RouterLink>
);

export default Footer;