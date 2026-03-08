import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0b0b0f' }}>
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        />
      </div>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0) 26.416%, rgba(10,10,10,1) 66.943%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 pt-[180px] sm:pt-[220px] md:pt-[260px] pb-16 flex flex-col items-center text-center gap-8">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="text-[36px] sm:text-[52px] md:text-[68px] lg:text-[80px] font-medium tracking-[-0.04em] text-foreground leading-[1.05]"
          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          Steal the{' '}
          <span
            className="italic bg-gradient-to-r from-[hsl(var(--cyan))] via-[hsl(var(--pink))] to-[hsl(var(--yellow))] bg-clip-text text-transparent"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: '1.15em',
            }}
          >
            Prompts
          </span>
          <br />
          Behind Beautiful Sites
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
          className="text-[15px] sm:text-[17px] md:text-[18px] max-w-[554px] text-muted-foreground leading-relaxed opacity-80"
        >
          Browse premium UI components and copy the exact AI prompts used to build them. 
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        {/* Email input block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="w-full max-w-[520px]"
        >
          <div
            className="flex items-center justify-between rounded-[40px] px-4 sm:px-6 py-3 sm:py-4 border gap-3"
            style={{
              backgroundColor: 'hsl(240 12% 7%)',
              borderColor: 'hsl(240 10% 16%)',
              boxShadow: '0px 10px 40px 5px rgba(0,0,0,0.45)',
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-[14px] sm:text-[15px] min-w-0"
            />
            <Link
              to="/auth?mode=signup"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-[30px] text-foreground font-medium text-[13px] sm:text-[14px] whitespace-nowrap transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(to bottom, hsl(240 10% 18%), hsl(240 12% 7%))',
                boxShadow: 'inset -4px -6px 25px 0px rgba(201,201,201,0.08), inset 4px 4px 10px 0px rgba(29,29,29,0.24)',
              }}
            >
              Get Started Free
            </Link>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
          className="flex items-center gap-3 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span>1,020+ Reviews</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
