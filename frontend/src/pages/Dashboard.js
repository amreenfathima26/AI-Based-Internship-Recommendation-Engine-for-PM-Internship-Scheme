import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart2, Briefcase, CheckCircle,
    ArrowRight, BookOpen, Trophy, User, Zap, XCircle, Award, Target, Star
} from 'lucide-react';
import config from './config';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showArchive, setShowArchive] = useState(false);
    const [optimizationResult, setOptimizationResult] = useState(null);
    const [optimizing, setOptimizing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch dashboard stats
                const statsRes = await fetch(`${config.API_BASE_URL}/api/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                setStats(statsData);

                // Fetch user profile
                const userRes = await fetch(`${config.API_BASE_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();
                setUser(userData.user);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Synchronizing Data...</p>
        </div>
    );

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 10 } } },
            tooltip: {
                backgroundColor: 'rgba(10, 10, 12, 0.9)',
                titleFont: { family: 'Outfit', size: 14 },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 12,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };

    const doughnutData = {
        labels: Object.keys(stats?.applications?.breakdown || {}),
        datasets: [{
            data: Object.values(stats?.applications?.breakdown || {}),
            backgroundColor: ['#8b5cf6', '#d946ef', '#3b82f6', '#10b981'],
            hoverOffset: 10,
            borderWidth: 0
        }]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 15 } }
    };




    const handleArchive = () => {
        setShowArchive(true);
    };

    const handleOptimization = async () => {
        setOptimizing(true);
        try {
            const token = localStorage.getItem('token');
            // Use the Chat API to get optimization tips based on current profile
            const profileContext = user?.profile ? JSON.stringify(user.profile) : "No profile data";
            const res = await fetch(`${config.API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: `Analyze my profile and suggest 3 key optimizations. Profile: ${profileContext}`,
                    history: []
                })
            });
            const data = await res.json();
            setOptimizationResult(data.reply);
        } catch (err) {
            console.error(err);
            setOptimizationResult("Could not generate optimization tips at this time.");
        } finally {
            setOptimizing(false);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 max-w-7xl mx-auto space-y-8"
        >
            {/* Corporate Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="corp-header text-6xl">Intelligence Center</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-blue-600 rounded-full"></div>)}
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Quantum Analysis Active</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleArchive}
                        className="bg-slate-50 border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                    >
                        Archive
                    </button>
                    <button
                        onClick={handleOptimization}
                        disabled={optimizing}
                        className="corp-btn-primary shadow-lg shadow-blue-500/20 px-8 py-3"
                    >
                        {optimizing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        ) : (
                            <Zap size={14} fill="currentColor" />
                        )}
                        Optimization
                    </button>
                </div>
            </div>

            {/* Archive Modal */}
            {showArchive && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowArchive(false)}>
                    <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">Archived Applications</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold">Product Intern @ Google</h4>
                                <p className="text-xs text-slate-500">Archived on Dec 15, 2024</p>
                                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-600 mt-2 inline-block">Withdrawn</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold">APM @ Uber</h4>
                                <p className="text-xs text-slate-500">Archived on Nov 20, 2024</p>
                                <span className="text-[10px] bg-red-100 px-2 py-1 rounded text-red-600 mt-2 inline-block">Rejected</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowArchive(false)}
                            className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs"
                        >
                            Close Archive
                        </button>
                    </div>
                </div>
            )}

            {/* Optimization Result Modal */}
            {optimizationResult && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setOptimizationResult(null)}>
                    <div className="bg-white p-8 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Zap className="text-yellow-500" fill="currentColor" />
                                AI Optimization Report
                            </h2>
                            <button onClick={() => setOptimizationResult(null)} className="p-2 hover:bg-slate-100 rounded-full"><XCircle size={24} className="text-slate-400" /></button>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-600">
                            {optimizationResult.split('\n').map((line, i) => (
                                <p key={i} className="mb-2">{line}</p>
                            ))}
                        </div>
                        <button
                            onClick={() => setOptimizationResult(null)}
                            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-blue-700"
                        >
                            Acknowledge Report
                        </button>
                    </div>
                </div>
            )}

            {/* ===== NEW: Comprehensive User Profile Section ===== */}
            <motion.div
                variants={itemVariants}
                className="corp-card !p-8 bg-gradient-to-br from-white to-blue-50/30"
            >
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-1">{user?.full_name || 'User'}</h2>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                            <p className="text-xs text-slate-400 mt-1">{user?.phone || 'No phone provided'}</p>
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                        <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Active</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Biography Section */}
                    <div>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <BookOpen size={16} className="text-blue-600" />
                            Biography
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {user?.profile?.bio ||
                                "Aspiring professional seeking internship opportunities in Product Management and Strategic Planning. Passionate about leveraging data-driven insights to create impactful solutions."}
                        </p>
                    </div>

                    {/* Education Section */}
                    <div>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Award size={16} className="text-indigo-600" />
                            Education
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-bold text-slate-800">{user?.profile?.education || 'Bachelor in Computer Science'}</p>
                                <p className="text-xs text-slate-500">GPA: {user?.profile?.gpa || '8.5/10'}</p>
                            </div>
                            {user?.profile?.institution && (
                                <p className="text-xs text-slate-600">{user.profile.institution}</p>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-emerald-600" />
                            Core Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(user?.profile?.skills && typeof user.profile.skills === 'string'
                                ? user.profile.skills.split(',')
                                : ['Product Strategy', 'Data Analysis', 'Agile', 'Python', 'Communication']
                            ).map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Academic Performance / Marks */}
                    <div>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <BarChart2 size={16} className="text-purple-600" />
                            Performance Metrics
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600">Quiz Average</span>
                                <span className="text-sm font-black text-slate-900">{stats?.learning?.avg_quiz_score || 0}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600">Applications</span>
                                <span className="text-sm font-black text-slate-900">{stats?.applications?.total || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600">Academic Score</span>
                                <span className="text-sm font-black text-green-600">{user?.profile?.academic_score || '85%'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Location & Interests */}
                    <div>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Target size={16} className="text-amber-600" />
                            Interests & Goals
                        </h3>
                        <div className="space-y-2">
                            <p className="text-xs text-slate-600">
                                <span className="font-bold">Location:</span> {user?.profile?.location || 'Bangalore, India'}
                            </p>
                            <p className="text-xs text-slate-600">
                                <span className="font-bold">Areas of Interest:</span> {user?.profile?.interests || 'Product Management, AI/ML, Data Science'}
                            </p>
                            <p className="text-xs text-slate-600">
                                <span className="font-bold">Experience:</span> {user?.profile?.previous_experience || 0} months
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Star size={16} className="text-pink-600" />
                            Additional Details
                        </h3>
                        <div className="space-y-2 text-xs text-slate-600">
                            <p><span className="font-bold">Languages:</span> {user?.profile?.languages || 'English, Hindi'}</p>
                            <p><span className="font-bold">Certifications:</span> {user?.profile?.certifications || 'Google PM Certificate, AWS Cloud Practitioner'}</p>
                            <p><span className="font-bold">GitHub:</span> {user?.profile?.github || 'github.com/username'}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Corporate Bento Grid: Vital Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Applications', value: stats?.applications?.total || 0, icon: Briefcase, color: 'text-blue-600', trend: 'ACTIVE SUBSYSTEM' },
                    { label: 'Competency', value: `${stats?.learning?.avg_quiz_score || 0}%`, icon: Award, color: 'text-indigo-600', trend: 'BETA-RATED' },
                    { label: 'Live Market Jobs', value: stats?.market?.live_opportunities || '120+', icon: Target, color: 'text-emerald-500', trend: 'REAL-TIME' },
                    { label: 'Security', value: 'SSL-ENC', icon: Star, color: 'text-slate-800', trend: 'VERIFIED' }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="corp-card !p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-slate-50 rounded-xl ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase letter-spacing-1">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="corp-header text-3xl mb-0">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Corporate Intelligence & Activity Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Analytic View */}
                <motion.div variants={itemVariants} className="lg:col-span-8 corp-card !p-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="corp-header text-2xl mb-1">Affinity Metrics</h3>
                            <p className="text-slate-400 text-xs font-medium">Real-time mapping of professional alignment</p>
                        </div>
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full border border-emerald-100">
                            Secure Data
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="h-64 relative flex items-center justify-center">
                            {Object.keys(stats?.applications?.breakdown || {}).length > 0 ? (
                                <>
                                    <Doughnut data={doughnutData} options={chartOptions} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Score</p>
                                        <p className="text-4xl font-black text-slate-900 leading-none">84</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8 bg-slate-50 rounded-[32px] w-full">
                                    <BarChart2 size={32} className="text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Awaiting Metrics</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Product Strategy', val: 88, color: 'bg-blue-600' },
                                { label: 'Agile Integration', val: 72, color: 'bg-slate-800' },
                                { label: 'Market Logic', val: 45, color: 'bg-slate-300' }
                            ].map((sector, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-slate-700 uppercase">{sector.label}</span>
                                        <span className="text-xs font-bold text-slate-400">{sector.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sector.val}%` }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className={`h-full rounded-full ${sector.color} shadow-sm`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Enterprise Log */}
                <motion.div variants={itemVariants} className="lg:col-span-4 corp-card !p-10">
                    <h3 className="corp-header text-xl mb-8 flex items-center gap-3">
                        Enterprise Log
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                        </div>
                    </h3>
                    <div className="space-y-8 relative">
                        <div className="absolute left-3.5 top-0 bottom-0 w-[2px] bg-slate-50"></div>

                        {(stats?.recent_activity?.length > 0 ? stats.recent_activity : [
                            { title: "SECURE_INIT", subtitle: "Kernel Ready", date: new Date(), type: "System" },
                            { title: "AUTH_PROTOCOL", subtitle: "Handshake Verified", date: new Date(), type: "Auth" }
                        ]).map((item, idx) => (
                            <div key={idx} className="relative pl-10 group">
                                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10 group-hover:border-blue-200 transition-all">
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                                </div>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                                    {item.title || item.company_name || 'System Event'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                                    {item.subtitle || item.role_title || `Status: OK`}
                                </p>
                                <div className="h-px w-8 bg-slate-50 mb-1"></div>
                                <p className="text-[9px] text-slate-300 font-bold">{new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default Dashboard;
