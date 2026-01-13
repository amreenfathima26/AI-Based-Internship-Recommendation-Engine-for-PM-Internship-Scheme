import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, XCircle, AlertTriangle, ScanLine, FileText, Cpu, Sparkles } from 'lucide-react';
import config from '../config';

const ATSScanner = () => {
    const [file, setFile] = useState(null);
    const [jobDesc, setJobDesc] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);

    const handleScan = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_description', jobDesc);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${config.API_BASE_URL}/api/resume/analyze`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 md:p-10 max-w-6xl mx-auto space-y-10"
        >
            {/* Header */}
            <div>
                <h1 className="text-5xl font-black text-white tracking-tight flex items-center gap-4">
                    <ScanLine className="text-primary" size={40} />
                    ATS Shield
                </h1>
                <p className="text-zinc-500 mt-2 font-medium flex items-center gap-2">
                    <Cpu size={14} className="text-accent" />
                    Neural Keyword Comparison Engine v4.0
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[40px] border-white/5 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                1. Source Document (PDF)
                            </label>
                            {file && <span className="text-[10px] text-green-500 font-bold uppercase">Ready for Analysis</span>}
                        </div>
                        <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer relative group overflow-hidden">
                            <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className="relative z-0 space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl w-fit mx-auto group-hover:bg-primary/10 transition-colors">
                                    <Upload className="text-zinc-600 group-hover:text-primary transition-colors" size={28} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">
                                        {file ? file.name : "Inject Resume Module"}
                                    </p>
                                    <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-tighter">
                                        Drop secure PDF or click to browse
                                    </p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            2. Target Specification (JD)
                        </label>
                        <div className={`glass-panel p-1 rounded-3xl transition-all ${focused ? 'ring-2 ring-primary/20' : ''}`}>
                            <textarea
                                className="w-full bg-transparent p-6 rounded-[22px] h-48 outline-none text-white text-sm font-medium placeholder:text-zinc-700 resize-none"
                                placeholder="Paste the job requirements here..."
                                value={jobDesc}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                onChange={(e) => setJobDesc(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        onClick={handleScan}
                        disabled={loading || !file}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 overflow-hidden group shadow-2xl relative ${loading || !file ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'btn-primary'}`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Decrypting Match Profile...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} className="text-white fill-white group-hover:animate-pulse" />
                                <span>Execute Neural Scan</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Results Section */}
                <motion.div variants={itemVariants} className="glass-card p-8 rounded-[40px] border-white/5 relative overflow-hidden bg-white/[0.01]">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center space-y-6">
                            <div className="p-8 rounded-full bg-white/[0.02] border border-white/5">
                                <AlertTriangle className="w-20 h-20 opacity-10" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-zinc-500 uppercase tracking-widest">Waiting for Input</h3>
                                <p className="text-xs text-zinc-600 max-w-[200px] mt-2">Neural engine requires source data to begin analysis</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Score Ring */}
                            <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] rounded-[32px] border border-white/5">
                                <div className="relative inline-block">
                                    <svg className="w-44 h-44 transform -rotate-90">
                                        <circle cx="88" cy="88" r="80" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="transparent" />
                                        <motion.circle
                                            cx="88" cy="88" r="80"
                                            stroke={result.score > 70 ? "#10B981" : "#8b5cf6"}
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            initial={{ strokeDasharray: 502, strokeDashoffset: 502 }}
                                            animate={{ strokeDashoffset: 502 - (502 * result.score) / 100 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <span className="text-5xl font-black text-white block">
                                            {result.score}
                                        </span>
                                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Match Index</span>
                                    </div>
                                </div>
                                <h2 className={`text-xl font-black mt-6 uppercase tracking-widest ${result.score > 70 ? 'text-green-500' : 'text-primary'}`}>
                                    {result.score > 70 ? "Ready for Deployment" : "Optimization Required"}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="glass-panel p-6 rounded-3xl border-red-500/10 bg-red-500/[0.01]">
                                    <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-red-500 mb-4">
                                        <XCircle size={14} /> Missing Neural Links
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missing_keywords.map((kw, idx) => (
                                            <span key={idx} className="glass-pill text-[9px] font-bold py-1.5 px-3 text-red-400 border-red-500/20 uppercase tracking-tight">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-panel p-6 rounded-3xl border-green-500/10 bg-green-500/[0.01]">
                                    <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-green-500 mb-4">
                                        <CheckCircle size={14} /> Established Connections
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matched_keywords.map((kw, idx) => (
                                            <span key={idx} className="glass-pill text-[9px] font-bold py-1.5 px-3 text-green-400 border-green-500/20 uppercase tracking-tight">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ATSScanner;
