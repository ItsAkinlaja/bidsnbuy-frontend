import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, Chrome } from 'lucide-react';
import { authService, type AuthResponse } from '../services/auth';
import { useNotification } from '../context/NotificationContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: (userData: AuthResponse) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { showNotification } = useNotification();

  // Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        // For login, we can use username or email as the 'username' field for JWT
        const response = await authService.login(formData.username, formData.password);
        showNotification({
          title: 'Welcome Back!',
          message: `Successfully logged in as ${response.user_display_name}`,
          type: 'success'
        });
        if (onSuccess) {
          onSuccess(response);
        } else {
          window.location.reload();
        }
      } else {
        // For registration, we use the fullName as username if username is empty, 
        // but typically username is mapped to the email field in the UI
        const registerUsername = formData.username.split('@')[0]; // Simple fallback for username
        const response = await authService.register(
          formData.username, // UI uses 'username' field for email
          formData.fullName || registerUsername, 
          formData.password
        );
        showNotification({
          title: 'Account Created!',
          message: `Welcome to BidsnBuy, ${response.user_display_name}!`,
          type: 'success'
        });
        if (onSuccess) {
          onSuccess(response);
        } else {
          window.location.reload();
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4 md:p-10 pointer-events-none">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[12px] animate-fade-in pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal Content Wrapper - to ensure centering */}
      <div className="relative w-full max-w-[1000px] h-full sm:h-auto sm:max-h-[90vh] flex pointer-events-auto">
        {/* Modal Content Container */}
        <div 
          className="w-full bg-white sm:rounded-[40px] shadow-[0_32px_120px_-24px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col sm:flex-row animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side: Brand & Visual (Desktop Only) */}
          <div className="hidden lg:flex w-[45%] bg-brand-dark relative overflow-hidden flex-col justify-between p-12 text-white shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 via-transparent to-brand-orange/20" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40" />
            
            <div className="relative z-10">
              <img 
                src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
                alt="BidsnBuy" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>

            <div className="relative z-10 space-y-6">
              <h1 className="text-4xl font-black leading-tight tracking-tighter">
                {mode === 'login' ? 'Welcome back to the elite circle.' : 'Join Nigeria\'s premier bidding platform.'}
              </h1>
              <p className="text-gray-300 font-medium text-lg leading-relaxed">
                Experience the thrill of the auction. Secure, transparent, and built for you.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-200 overflow-hidden shadow-xl">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-brand-orange">
                  +15.4k Bidders
                </p>
              </div>
            </div>

            <div className="relative z-10 text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
              &copy; 2026 BidsnBuy Nigeria
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="flex-grow bg-white overflow-y-auto custom-scrollbar relative flex flex-col">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-3 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-2xl transition-all z-20 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="p-8 sm:p-16 lg:p-20 my-auto">
              {/* Header (Mobile) */}
              <div className="lg:hidden text-center mb-10">
                <img 
                  src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
                  alt="BidsnBuy" 
                  className="h-10 w-auto mx-auto mb-6"
                />
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
              </div>

              {/* Header (Desktop) */}
              <div className="hidden lg:block mb-10">
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-gray-500 font-medium">
                  Please enter your credentials to continue.
                </p>
              </div>

              {/* Social Auth */}
            <div className="mb-8">
              <button className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-50 hover:border-brand-blue/20 hover:bg-gray-50 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest text-gray-700 shadow-sm group">
                <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span>Continue with Google</span>
              </button>
            </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                  <span className="bg-white px-6">Or use email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center animate-shake rounded-r-xl">
                    {error}
                  </div>
                )}

                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                      <input 
                        type="text" 
                        name="fullName"
                        placeholder="John Doe" 
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="text" 
                      name="username"
                      placeholder="you@example.com" 
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                    {mode === 'login' && (
                      <button type="button" className="text-[9px] font-black text-brand-blue hover:text-brand-orange uppercase tracking-widest transition-colors">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      placeholder="••••••••" 
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-14 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-blue text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:bg-brand-dark transition-all flex items-center justify-center space-x-3 active:scale-[0.98] transform disabled:opacity-50 mt-8"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>{mode === 'login' ? 'Sign In Securely' : 'Create Account'}</span>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-10 text-center">
                <p className="text-xs font-bold text-gray-400">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="ml-3 text-brand-blue font-black uppercase tracking-widest text-[10px] hover:text-brand-orange transition-colors"
                  >
                    {mode === 'login' ? 'Sign Up Free' : 'Sign In Now'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;