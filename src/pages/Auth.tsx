import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { z } from 'zod';
import Logo from '@/components/Logo';
import { lovable } from '@/integrations/lovable/index';

const emailSchema = z.string().trim().email('Invalid email').max(255);
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(128);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) { toast.error(emailResult.error.errors[0].message); return; }
    const passResult = passwordSchema.safeParse(password);
    if (!passResult.success) { toast.error(passResult.error.errors[0].message); return; }

    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else if (isSignUp) {
      toast.success('Account created! You are now signed in.');
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 noise-bg opacity-30" />
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-accent/8 rounded-full blur-[120px]" />
      
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass-card p-8"
        >
          <div className="mb-6">
            <Logo size="lg" linkTo="" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-1 font-display">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-muted-foreground text-sm mb-8">{isSignUp ? 'Sign up to access PromptSites' : 'Log in to your account'}</p>

          {/* Google Sign In */}
          <button
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) toast.error(error.message);
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 text-foreground text-sm font-medium hover:bg-muted/50 hover:border-border/60 transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.15)] transition-all duration-300 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.15)] transition-all duration-300 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="glow-button w-full text-sm !py-3.5 disabled:opacity-50 font-semibold">
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
