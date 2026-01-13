import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Globe,
    BookOpen,
    ScanLine,
    LogOut,
    Cpu,
    User as UserIcon,
    ChevronRight
} from 'lucide-react';

const Navigation = ({ user, onLogout }) => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/jobs', label: 'Live Jobs', icon: <Globe size={20} /> },
        { path: '/rec', label: 'Recommended', icon: <BookOpen size={20} /> },
        { path: '/ats', label: 'ATS Scanner', icon: <ScanLine size={20} /> },
        { path: '/quiz', label: 'Skill Assessment', icon: <Cpu size={20} /> },
    ];

    return (
        <div className="w-64 bg-dark/60 backdrop-blur-3xl border-r border-white/5 min-h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="p-8 pb-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Cpu className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-white leading-none tracking-tight">
                            PM INTERN <span className="text-primary italic">AI</span>
                        </h1>
                        <div className="glass-pill mt-1 py-0 px-2 inline-block">
                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">System v2.5</span>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-1">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Link
                                    to={item.path}
                                    className={`flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'nav-item-active'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`${isActive ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </div>
                                    {isActive && <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto p-6 space-y-4">
                {/* User Profile Mini-Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-2xl flex items-center gap-3 border-white/5"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-full flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition">
                        <UserIcon size={20} className="text-zinc-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.full_name || 'System User'}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="text-zinc-600 hover:text-primary transition">
                        <ChevronRight size={16} />
                    </Link>
                </motion.div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Terminate Session
                </button>
            </div>
        </div>
    );
};

export default Navigation;
