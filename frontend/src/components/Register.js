import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, UserPlus, Zap } from 'lucide-react';

function Register({ onRegister, onSwitchToLogin, loading, error }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Verification failed: Passwords do not match!");
      return;
    }
    const { confirm_password, ...data } = formData;
    onRegister(data);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="auth-card-wrapper"
    >
      <div className="corp-card max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <UserPlus size={28} />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
          </div>
        </div>

        <div className="mb-2">
          <h2 className="corp-header text-4xl">Onboarding</h2>
          <p className="text-slate-400 font-medium text-sm tracking-tight">Establish your professional operative profile.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="corp-input-group">
              <label className="corp-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="full_name"
                  type="text"
                  className="corp-field w-full pl-12"
                  placeholder="Operative Name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="corp-input-group">
              <label className="corp-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="email"
                  type="email"
                  className="corp-field w-full pl-12"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="corp-input-group">
              <label className="corp-label">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="phone"
                  type="tel"
                  className="corp-field w-full pl-12"
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="corp-input-group">
              <label className="corp-label">Password Policy</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="corp-field w-full pl-12"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="corp-input-group">
            <label className="corp-label">Confirm Credential</label>
            <div className="relative">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                className="corp-field w-full pl-12"
                placeholder="••••••••"
                required
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors tracking-widest">
              {showPassword ? "Conceal" : "Verify Policy"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="corp-btn-primary mt-2 py-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Finalize Onboarding</span>
                <ArrowRight size={18} />
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Already verified?
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 ml-2 hover:underline"
            >
              Resume Session
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Register;
