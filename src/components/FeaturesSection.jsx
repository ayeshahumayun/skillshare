import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaUsers, FaComments } from 'react-icons/fa';

// Animation settings
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const FeatureCard = ({ icon, title, description, iconBgClass }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-brand-light p-8 rounded-2xl shadow-lg border border-transparent
                 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-accent/50
                 transition-all duration-300 transform group"
    >
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 
                    transition-all duration-300 group-hover:scale-105 ${iconBgClass}`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-brand-dark mb-3">{title}</h3>
      <p className="text-brand-dark/80 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    // Set section to bg-white to contrast with brand-light
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          {/* Header "Badge" */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-brand-accent/20 text-orange-600 rounded-full text-sm font-semibold uppercase tracking-wider">
              Core Features
            </span>
            <h2 className="text-4xl font-extrabold text-brand-dark mt-4 mb-4">
              Unlock Your Campus Potential
            </h2>
            <p className="text-xl text-brand-dark/80 max-w-2xl mx-auto">
              Go beyond the curriculum. Share, learn, and collaborate with peers who are just as passionate as you are.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={sectionVariants}
          >
            {/* All cards now use the brand-accent theme */}
            <FeatureCard
              icon={<FaBookOpen className="text-orange-600 text-3xl" />}
              iconBgClass="bg-brand-accent/20"
              title="Share Skills"
              description="Offer your expertise in coding, design, math, or music to other students."
            />
            <FeatureCard
              icon={<FaUsers className="text-orange-600 text-3xl" />}
              iconBgClass="bg-brand-accent/20"
              title="Find Tutors"
              description="Get one-on-one help from talented peers who have mastered the subjects you're working on."
            />
            <FeatureCard
              icon={<FaComments className="text-orange-600 text-3xl" />}
              iconBgClass="bg-brand-accent/20"
              title="Collaborate"
              description="Find project partners, form study groups, and build amazing things together."
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;