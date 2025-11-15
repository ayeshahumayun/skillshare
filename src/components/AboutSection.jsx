import React from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll'; // <-- Make sure this import is present
import { FaLightbulb, FaUserGraduate, FaUsers } from 'react-icons/fa';

// Animation variants (unchanged)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection = () => {
  return (
    // --- UPDATED: Background Gradient ---
<section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-20">
          
          {/* Image Section (unchanged) */}
          <motion.div
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Students collaborating"
              className="object-cover w-full h-full rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Text Content Section */}
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* --- UPDATED: "Badge" style with accent color --- */}
            <motion.span 
              className="inline-block px-4 py-1.5 bg-brand-accent/20 text-orange-600 rounded-full text-sm font-semibold uppercase tracking-wider"
              variants={itemVariants}
            >
              Our Mission
            </motion.span>
            
            {/* --- UPDATED: Text colors --- */}
            <motion.h2 
              className="text-4xl font-extrabold text-brand-dark my-4" // Added margin
              variants={itemVariants}
            >
              Empowering Student Success
            </motion.h2>
            <motion.p 
              className="text-brand-dark/80 text-lg mb-8"
              variants={itemVariants}
            >
              We believe every student has a skill to share and something new to learn. Our mission is to break down barriers and create a campus community where knowledge flows freely.
            </motion.p>

            {/* --- UPDATED: Scannable Feature List colors --- */}
            <motion.ul className="space-y-6 mb-10" variants={itemVariants}>
              <li className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-brand-accent/20 text-orange-600 rounded-full">
                  <FaLightbulb className="text-xl" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-brand-dark">Share Your Expertise</h4>
                  <p className="text-brand-dark/80">
                    Reinforce your knowledge by teaching peers and building your reputation on campus.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-brand-accent/20 text-orange-600 rounded-full">
                  <FaUserGraduate className="text-xl" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-brand-dark">Find Instant Help</h4>
                  <p className="text-brand-dark/80">
                    Get unstuck on a tough problem by connecting with a fellow student who has been there.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-brand-accent/20 text-orange-600 rounded-full">
                  <FaUsers className="text-xl" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-brand-dark">Build Your Network</h4>
                  <p className="text-brand-dark/80">
                    Collaborate on projects, form study groups, and meet like-minded individuals.
                  </p>
                </div>
              </li>
            </motion.ul>

            {/* --- UPDATED: Button colors --- */}
            <motion.div variants={itemVariants}>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                offset={-70}
                className="px-8 py-3 bg-brand-accent text-brand-dark text-lg font-semibold rounded-md 
                           hover:brightness-95 transition-all duration-300 
                           cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get In Touch
              </ScrollLink>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;