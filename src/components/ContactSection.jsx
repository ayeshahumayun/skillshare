import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlinePaperAirplane
} from 'react-icons/hi';

const ContactSection = () => {
  return (
    // Set section to bg-brand-light
    <section id="contact" className="py-24 bg-brand-light">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 bg-brand-accent/20 text-orange-600 rounded-full text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </span>
            <h2 className="text-4xl font-extrabold text-brand-dark mt-4 mb-4">
              Have Questions? Get in Touch!
            </h2>
            <p className="text-lg text-brand-dark/80 mb-8">
              We'd love to hear from you. Fill out the form, or reach us directly using the details below. We'll get back to you as soon as possible.
            </p>

            {/* Contact Details List */}
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-brand-accent/20 text-orange-600 rounded-lg">
                  <HiOutlineMail className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-brand-dark">Email</h4>
                  <a href="mailto:info@campusskillshare.com" className="text-brand-dark/80 hover:text-brand-accent transition-colors">
                    info@campusskillshare.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-brand-accent/20 text-orange-600 rounded-lg">
                  <HiOutlinePhone className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-brand-dark">Phone</h4>
                  <a href="tel:+123456789" className="text-brand-dark/80 hover:text-brand-accent transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-brand-accent/20 text-orange-600 rounded-lg">
                  <HiOutlineLocationMarker className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-brand-dark">Address</h4>
                  <p className="text-brand-dark/80">
                    123 University Ave, Your City, Pakistan
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Form Card (bg-white) */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-dark mb-6">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-dark/90 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full p-4 bg-brand-light border border-transparent rounded-lg 
                               focus:border-brand-accent focus:bg-white focus:ring-0 transition-all duration-300"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-dark/90 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full p-4 bg-brand-light border border-transparent rounded-lg
                               focus:border-brand-accent focus:bg-white focus:ring-0 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-dark/90 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className="block w-full p-4 bg-brand-light border border-transparent rounded-lg
                               focus:border-brand-accent focus:bg-white focus:ring-0 transition-all duration-300"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-10 py-3 bg-brand-accent text-brand-dark 
                               text-lg font-semibold rounded-lg hover:brightness-95
                               transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span>Send Message</span>
                    <HiOutlinePaperAirplane className="w-5 h-5 transform rotate-45" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;