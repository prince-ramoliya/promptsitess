import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Sparkles, Layers, Zap } from 'lucide-react';
import { useMemo } from 'react';

const platformFeatures = [
{
  icon: <Copy className="w-5 h-5" />,
  title: 'Copy Any Prompt',
  description: 'Browse components, click copy, and get the exact AI prompt used to build it.'
},
{
  icon: <Sparkles className="w-5 h-5" />,
  title: 'Paste & Generate',
  description: 'Drop the prompt into Lovable, Cursor, or Bolt and watch it come to life.'
},
{
  icon: <Layers className="w-5 h-5" />,
  title: 'Premium Library',
  description: 'Access 100+ hand-crafted UI components across 50+ categories.'
},
{
  icon: <Zap className="w-5 h-5" />,
  title: 'Ship 10x Faster',
  description: 'Stop writing prompts from scratch. Use battle-tested ones that actually work.'
}];


const FloatingOrb = ({ delay, duration, x, y, size, color }: {delay: number;duration: number;x: string;y: string;size: string;color: string;}) =>
<motion.div
  className={`absolute rounded-full blur-3xl opacity-20 ${size} ${color}`}
  style={{ left: x, top: y }}
  animate={{
    y: [0, -30, 0, 30, 0],
    x: [0, 20, 0, -20, 0],
    scale: [1, 1.2, 1, 0.8, 1],
    opacity: [0.15, 0.3, 0.15, 0.25, 0.15]
  }}
  transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }} />;



const GridLine = ({ orientation, position, delay }: {orientation: 'h' | 'v';position: string;delay: number;}) =>
<motion.div
  className={`absolute ${orientation === 'h' ? 'w-full h-px' : 'h-full w-px'} bg-gradient-to-${orientation === 'h' ? 'r' : 'b'} from-transparent via-primary/[0.07] to-transparent`}
  style={orientation === 'h' ? { top: position, left: 0 } : { left: position, top: 0 }}
  initial={{ opacity: 0 }}
  animate={{ opacity: [0, 0.5, 0] }}
  transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }} />;



const HeroSection = () => {
  const particles = useMemo(() =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 3
  })), []
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Video — hidden on mobile, shown on sm+ */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-150 object-left-top origin-top-left hidden sm:block">
        
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4"
          type="video/mp4" />
        
      </video>

      {/* Dark overlay — desktop only over video */}
      <div className="absolute inset-0 bg-background sm:bg-background/80" />

      {/* Mobile gradient background */}
      <div className="absolute inset-0 sm:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-emerald/6 blur-[80px]" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <FloatingOrb delay={0} duration={8} x="10%" y="20%" size="w-72 h-72" color="bg-primary" />
        <FloatingOrb delay={2} duration={10} x="70%" y="10%" size="w-96 h-96" color="bg-accent" />
        <FloatingOrb delay={4} duration={12} x="50%" y="60%" size="w-64 h-64" color="bg-emerald" />
        <FloatingOrb delay={1} duration={9} x="85%" y="70%" size="w-56 h-56" color="bg-yellow" />
        <FloatingOrb delay={3} duration={7} x="20%" y="75%" size="w-48 h-48" color="bg-pink" />

        {/* Grid Lines */}
        <GridLine orientation="h" position="25%" delay={0} />
        <GridLine orientation="h" position="50%" delay={1.5} />
        <GridLine orientation="h" position="75%" delay={3} />
        <GridLine orientation="v" position="25%" delay={0.5} />
        <GridLine orientation="v" position="50%" delay={2} />
        <GridLine orientation="v" position="75%" delay={3.5} />

        {/* Floating Particles */}
        {particles.map((p) =>
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            y: [0, -60, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />

        )}

        {/* Diagonal streaks */}
        <motion.div
          className="absolute w-[600px] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent rotate-[35deg]"
          style={{ left: '5%', top: '30%' }}
          animate={{ x: [-200, 800], opacity: [0, 0.6, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }} />
        
        <motion.div
          className="absolute w-[400px] h-px bg-gradient-to-r from-transparent via-pink/20 to-transparent rotate-[-25deg]"
          style={{ right: '10%', top: '60%' }}
          animate={{ x: [200, -600], opacity: [0, 0.5, 0] }}
          transition={{ duration: 5, delay: 2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }} />
        
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 flex-col text-center gap-4 sm:gap-8 pt-14 sm:pt-32 flex items-center justify-start py-[23px]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[11px] sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border/40 bg-card/40 backdrop-blur-md text-muted-foreground">
          
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Premium UI Prompts for AI Tools
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground font-extrabold tracking-tight max-w-[900px] leading-[1.15] text-[26px] sm:text-5xl lg:text-6xl">
          
          Steal the Prompts{' '}
          <br className="sm:hidden" />
          Behind <span className="gradient-text" style={{ fontFamily: "'Caveat', cursive" }}>Beautiful</span>{' '}
          <span className="gradient-text">Websites</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg max-w-[640px] leading-relaxed px-2 sm:px-0">
          
          Browse premium UI components and copy the exact AI prompts used to build them.
          Paste into Lovable, Cursor, or Bolt to generate instantly.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          
          <a href="#gallery" className="glow-button glow-button-animated flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center">
            Browse Components <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Platform Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6 mt-8 sm:mt-20 pb-8 sm:pb-10">
        
        {/* Desktop: glass card grid */}
        <div className="hidden sm:block bg-card/50 backdrop-blur-xl border border-border/30 rounded-2xl p-8 shadow-2xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, i) =>
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="flex flex-col gap-3 text-left">
              
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-foreground font-semibold text-sm">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile: compact inline chips */}
        <div className="sm:hidden flex flex-wrap justify-center gap-3">
          {platformFeatures.map((feature, i) =>
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-card/40 backdrop-blur-md border border-border/30">
            
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                {feature.icon}
              </div>
              <span className="text-foreground text-xs font-medium">{feature.title}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>);

};

export default HeroSection;