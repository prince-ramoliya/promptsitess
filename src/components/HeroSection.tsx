import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

const HeroSection = () => {
  const [email, setEmail] = useState('');

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden" style={{ backgroundColor: '#0b0b0f' }}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0) 26.416%, rgba(10,10,10,1) 66.943%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-5 sm:px-6 pt-[180px] sm:pt-[220px] md:pt-[290px] flex flex-col gap-8">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="text-[40px] sm:text-[60px] md:text-[80px] font-medium leading-[1.05] tracking-[-0.04em] text-foreground"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Simple{' '}
          <span
            className="italic bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent sm:text-[75px] md:text-[100px] text-[50px]"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}
          >
            management
          </span>
          <br />
          for your remote team
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          className="text-[16px] sm:text-[18px] max-w-[554px] leading-relaxed opacity-80"
          style={{ color: '#a0a3ad' }}
        >
          Browse premium UI components and copy the exact AI prompts used to build them.
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="flex items-center justify-between rounded-[40px] px-4 sm:px-6 py-3 sm:py-4 max-w-[520px] w-full"
          style={{
            backgroundColor: '#111218',
            border: '1px solid #24262f',
            boxShadow: '0px 10px 40px 5px rgba(0,0,0,0.45)',
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-gray-500 text-[14px] sm:text-[15px] min-w-0"
          />
          <button
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-[30px] text-foreground font-medium text-sm whitespace-nowrap transition-transform hover:scale-[1.03] ml-3"
            style={{
              background: 'linear-gradient(to bottom, #2b2d38, #0f1118)',
              boxShadow:
                'inset -4px -6px 25px 0px rgba(201,201,201,0.08), inset 4px 4px 10px 0px rgba(29,29,29,0.24)',
            }}
          >
            Create Free Account
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
          className="flex items-center gap-3 text-sm"
          style={{ color: '#9ca3af' }}
        >
          <div className="flex items-center gap-0.5 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span>1,020+ Reviews</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
