import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, ExternalLink, Clock, Building2, Globe, DollarSign, Filter, RefreshCcw } from 'lucide-react';
import config from './../config';

const LiveJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('Product Management');
    const [location, setLocation] = useState('India');
    const [focused, setFocused] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/internships/live?query=${query}&location=${location}`);
            const data = await res.json();
            setJobs(data.jobs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleApply = async (job) => {
        window.open(job.apply_url, '_blank');
        const token = localStorage.getItem('token');
        if (token) {
            const res = await fetch(`${config.API_BASE_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    company: job.company,
                    role: job.title,
                    link: job.apply_url
                })
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-8 max-w-7xl mx-auto space-y-12"
        >
            {/* Corporate Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="corp-header text-6xl flex items-center gap-4">
                        <Globe className="text-blue-600" size={48} />
                        Live Explorer
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-slate-800 rounded-full"></div>)}
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Global Recruitment Vector Synced</p>
                    </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    Real-time Intelligence
                </div>
            </div>

            {/* Premium Corporate Search Bar */}
            <motion.div
                variants={cardVariants}
                className="corp-card !p-3 flex flex-col md:flex-row gap-4 !bg-slate-50 border border-slate-200"
            >
                <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        className="w-full pl-14 pr-6 py-4 rounded-xl outline-none text-sm font-medium transition-all !bg-white !text-black !text-opacity-100 placeholder-slate-500 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 opacity-100"
                        placeholder="Target Role / Vertical"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ color: '#000000', backgroundColor: '#ffffff', opacity: 1 }}
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        className="w-full pl-14 pr-6 py-4 rounded-xl outline-none text-sm font-medium transition-all !bg-white !text-black !text-opacity-100 placeholder-slate-500 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 opacity-100"
                        placeholder="Global Territory"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ color: '#000000', backgroundColor: '#ffffff', opacity: 1 }}
                    />
                </div>
                <button
                    onClick={fetchJobs}
                    className="corp-btn-primary px-12 h-auto py-4 rounded-xl"
                >
                    Establish Scan
                </button>
            </motion.div>

            {/* Results Grid */}
            <AnimatePresence mode="popLayout">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="corp-card h-72 animate-pulse !bg-white"></div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                variants={cardVariants}
                                layout
                                className="corp-card group hover:!border-blue-200 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Briefcase size={28} />
                                    </div>
                                    <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase bg-slate-50 px-3 py-1 rounded-full">{job.source}</span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                        {job.title}
                                    </h3>
                                    <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mt-1 mb-4">
                                        {job.company}
                                    </p>

                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-tight">
                                        <MapPin size={12} className="text-slate-300" />
                                        {job.location}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                                    >
                                        Establish Access <ExternalLink size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LiveJobs;
