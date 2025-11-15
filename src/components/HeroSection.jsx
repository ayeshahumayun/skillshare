import React from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { FaArrowRight } from 'react-icons/fa';

// Animation variants (unchanged)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Avatar component (unchanged)
const Avatar = ({ src, alt }) => (
  <img
    className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
    src={src}
    alt={alt}
  />
);

const HeroSection = () => {
  return (
    // --- UPDATED: Main background color ---
    <section id="home" className="relative flex items-center justify-center min-h-screen bg-brand-light pt-20 overflow-hidden">
      
      {/* --- UPDATED: Animated blobs themed to new accent --- */}
      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          rotate: [0, 90, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-96 h-96 md:w-[500px] md:h-[500px] 
                   bg-gradient-to-r from-brand-accent/20 to-yellow-200/20 
                   opacity-60 rounded-full filter blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [50, -150, 50],
          rotate: [0, -90, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute bottom-0 right-0 w-96 h-96 md:w-[500px] md:h-[500px] 
                   bg-gradient-to-r from-orange-200/20 to-brand-accent/20 
                   opacity-60 rounded-full filter blur-3xl"
      />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Text Content */}
          <motion.div
            className="md:w-6/12 w-full text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* --- UPDATED: Heading text color and gradient --- */}
            <motion.h1
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark mb-6"
            >
              Share Skills,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-brand-accent">
                Build Your Campus
              </span>
            </motion.h1>

            {/* --- UPDATED: Paragraph text color (with opacity) --- */}
            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-lg md:text-xl text-brand-dark/80 mb-10 max-w-lg mx-auto md:mx-0"
            >
              Connect with peers, find tutors, and collaborate on projects. The ultimate skill-sharing network, exclusively for your university.
            </motion.p>

            {/* --- UPDATED: CTA Buttons --- */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="flex justify-center md:justify-start space-x-4"
            >
              {/* --- Primary Button: Uses brand-accent --- */}
              <ScrollLink
                to="features"
                smooth={true}
                duration={500}
                offset={-70}
                className="px-8 py-3 bg-brand-accent text-brand-dark text-lg font-semibold rounded-md 
                           hover:brightness-95 transition-all duration-300 
                           cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started
              </ScrollLink>
              {/* --- Secondary Button: Uses brand-dark text --- */}
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-70}
                className="px-8 py-3 flex items-center text-brand-dark text-lg font-semibold rounded-md 
                           hover:bg-brand-accent/20 transition-all duration-300 
                           cursor-pointer group"
              >
                Learn More
                <FaArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ScrollLink>
            </motion.div>

            {/* --- UPDATED: Small CTA Text --- */}
            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-sm text-brand-dark/70 mt-4 text-center md:text-left"
            >
              Join free forever. No credit card required.
            </motion.p>

            {/* --- UPDATED: Social Proof Text --- */}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center md:justify-start mt-10"
            >
              <div className="flex -space-x-4">
                <Avatar src="https://randomuser.me/api/portraits/women/10.jpg" alt="User 1" />
                <Avatar src="https://randomuser.me/api/portraits/men/22.jpg" alt="User 2" />
                <Avatar src="https://randomuser.me/api/portraits/women/33.jpg" alt="User 3" />
                <Avatar src="https://randomuser.me/api/portraits/men/44.jpg" alt="User 4" />
              </div>
              <p className="ml-4 font-semibold text-brand-dark/90">
                {/* --- Accent changed to a readable orange --- */}
                Join <span className="text-orange-600">500+</span> students already sharing skills!
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: "Product" Visual */}
          <motion.div 
            className="md:w-6/12 w-full mt-10 md:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* --- UPDATED: Frame background and accent dot --- */}
            <div className="bg-brand-light/70 backdrop-blur-md rounded-2xl shadow-2xl p-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-3">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <span className="w-3 h-3 bg-brand-accent rounded-full"></span> {/* Dot uses accent */}
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto-format&fit=crop" 
                alt="Campus Skill Share App" 
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;