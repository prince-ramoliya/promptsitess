import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Create Your Free Account',
    description: 'Sign up in seconds using your email address or mobile number.',
  },
  {
    title: 'Connect Your Bank Accounts',
    description: 'Securely link your bank accounts, cards, or digital wallets.',
  },
  {
    title: 'Set Your Financial Goals',
    description: 'Customize your savings, spending, or investment goals with ease.',
  },
  {
    title: 'Track, Grow, and Optimize',
    description: 'Watch your money work for you in real time and receive insights.',
  },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-150 object-left-top origin-top-left"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center gap-8 mt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white text-sm px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
        >
          Real-Time Budget Tracking
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white font-semibold leading-tight tracking-[-0.02em] max-w-[900px] text-[44px] sm:text-[72px] lg:text-[100px] font-display"
        >
          Build Wealth That Lasts Generations
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/80 text-[18px] max-w-[640px] leading-relaxed"
        >
          Transform today's earnings into tomorrow's family fortune with proven wealth-building strategies
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/auth?mode=signup"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform"
          >
            Start Building Wealth
          </Link>
        </motion.div>
      </div>

      {/* Bottom Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[1100px] px-6 z-10"
      >
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-2">
                <h3 className="text-white font-medium">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
