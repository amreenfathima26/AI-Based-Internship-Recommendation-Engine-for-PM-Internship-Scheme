import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

function Login({ onLogin, onSwitchToRegister, loading, error }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Form data:', formData);
    console.log('Email:', formData.email);
    console.log('Password:', formData.password);
    console.log('Password length:', formData.password?.length);
    onLogin(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="auth-card-wrapper"
    >
      <div className="corp-card">
        <div className="flex justify-between items-center mb-2">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <ShieldCheck size={28} />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="mb-2">
          <h2 className="corp-header text-4xl">Sign In</h2>
          <p className="text-slate-400 font-medium text-sm tracking-tight">Enterprise Career Intelligence System</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 text-red-600 px-6 py-3 rounded-2xl text-xs font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
          <div className="corp-input-group">
            <label className="corp-label">Identifier</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                className="corp-field w-full pl-12"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="corp-input-group">
            <label className="corp-label">Credential</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className="corp-field w-full pl-12 pr-12"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="corp-btn-primary mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Initialize Access</span>
                <ArrowRight size={18} />
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            New operative?
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 ml-2 hover:underline"
            >
              Request Credentials
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
