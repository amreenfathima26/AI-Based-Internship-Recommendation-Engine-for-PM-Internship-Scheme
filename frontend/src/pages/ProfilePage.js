import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, Briefcase, GraduationCap, MapPin, Loader, Github, Linkedin, Award, BookOpen, Globe, Shield, Settings, Fingerprint, CheckCircle2, XCircle, Plus, Trash2, Cpu } from 'lucide-react';
import config from '../config';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        education: '',
        skills: '',
        interests: '',
        location: '',
        previous_experience: false,
        bio: '',
        institution: '',
        gpa: '',
        academic_score: '',
        languages: '',
        certifications: '',
        github: '',
        linkedin: '',
        projects_json: '[]',
        work_history_json: '[]'
    });

    // Parsed State
    const [projects, setProjects] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_BASE_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.user) {
                const p = data.user.profile || {};
                setProfile({
                    full_name: data.user.full_name || '',
                    email: data.user.email || '',
                    education: p.education || '',
                    skills: Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || '',
                    interests: Array.isArray(p.interests) ? p.interests.join(', ') : p.interests || '',
                    location: p.location || '',
                    previous_experience: p.previous_experience || false,
                    bio: p.bio || '',
                    institution: p.institution || '',
                    gpa: p.gpa || '',
                    academic_score: p.academic_score || '',
                    languages: p.languages || '',
                    certifications: p.certifications || '',
                    github: p.github || '',
                    linkedin: p.linkedin || '',
                    projects_json: p.projects_json || '[]',
                    work_history_json: p.work_history_json || '[]'
                });

                // Parse JSON fields safely
                try {
                    setProjects(JSON.parse(p.projects_json || '[]'));
                } catch { setProjects([]); }

                try {
                    setWorkHistory(JSON.parse(p.work_history_json || '[]'));
                } catch { setWorkHistory([]); }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Project Handlers
    const addProject = () => {
        setProjects([...projects, { title: '', description: '', link: '' }]);
    };
    const updateProject = (index, field, value) => {
        const newProjects = [...projects];
        newProjects[index][field] = value;
        setProjects(newProjects);
    };
    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    // Work History Handlers
    const addWork = () => {
        setWorkHistory([...workHistory, { role: '', company: '', duration: '', description: '' }]);
    };
    const updateWork = (index, field, value) => {
        const newWork = [...workHistory];
        newWork[index][field] = value;
        setWorkHistory(newWork);
    };
    const removeWork = (index) => {
        setWorkHistory(workHistory.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...profile,
                skills: profile.skills.split(',').map(s => s.trim()).filter(s => s),
                interests: profile.interests.split(',').map(s => s.trim()).filter(s => s),
                projects_json: JSON.stringify(projects),
                work_history_json: JSON.stringify(workHistory)
            };

            const response = await fetch(`${config.API_BASE_URL}/api/auth/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Bio Matrix updated successfully. Profiles synced.' });
            } else {
                setMessage({ type: 'error', text: 'Synchronization failed. Check secure link.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Critical Error: Link severed.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing Bio Records...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 pb-32"
        >
            {/* Header */}
            <div>
                <h1 className="text-5xl font-black text-white tracking-tight flex items-center gap-4">
                    <Shield className="text-primary" size={40} />
                    Bio Management
                </h1>
                <p className="text-zinc-500 mt-1 font-medium flex items-center gap-2">
                    <Fingerprint size={14} className="text-accent" />
                    Secure Identity & Career Preferences Hub
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* ID Card */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-10 rounded-[48px] text-center border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-[0_0_30px_rgba(139,92,246,0.5)] border-4 border-white/10">
                                {profile.full_name?.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black text-white">{profile.full_name}</h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">{profile.email}</p>

                            {/* Stats */}
                            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-white">{projects.length}</h3>
                                    <p className="text-[9px] text-zinc-500 uppercase font-black">Projects</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-white">{workHistory.length}</h3>
                                    <p className="text-[9px] text-zinc-500 uppercase font-black">History</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-600 font-bold uppercase">Account Status</span>
                                    <span className="text-green-500 font-black flex items-center gap-1">
                                        <CheckCircle2 size={12} /> VERIFIED
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-600 font-bold uppercase">Security Tier</span>
                                    <span className="text-primary font-black">TIER 1 ELITE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-8 space-y-6">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="glass-panel p-10 rounded-[48px] border-white/5 bg-white/[0.01]"
                    >
                        <AnimatePresence mode="wait">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`mb-10 p-5 rounded-[24px] text-sm font-black uppercase tracking-widest flex items-center gap-3 border shadow-2xl ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                                >
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-3">
                                <label className="corp-label flex items-center gap-2">
                                    <Book size={14} className="text-blue-500" /> Professional Summary (Bio)
                                </label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    placeholder="Brief professional summary..."
                                    className="corp-field w-full !h-24 py-3 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="corp-label flex items-center gap-2">
                                        <Book size={14} className="text-blue-500" /> Educational Background
                                    </label>
                                    <select
                                        name="education"
                                        value={profile.education}
                                        onChange={handleChange}
                                        className="corp-field w-full cursor-pointer"
                                    >
                                        <option value="" className="text-slate-400">Current Specialization...</option>
                                        <option value="B.Tech">B.Tech Engineering</option>
                                        <option value="M.Tech">M.Tech Advanced</option>
                                        <option value="BBA">BBA Core</option>
                                        <option value="MBA">MBA Strategy</option>
                                        <option value="BCA">BCA Fundamentals</option>
                                        <option value="MCA">MCA Advanced</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="corp-label flex items-center gap-2">
                                        <MapPin size={14} className="text-blue-500" /> Core Deployment Hub
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        placeholder="City, Remote, Global..."
                                        className="corp-field w-full"
                                    />
                                </div>
                            </div>

                            {/* NEW: Institution & GPA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="corp-label flex items-center gap-2">
                                        <Book size={14} className="text-blue-500" /> Institution
                                    </label>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={profile.institution}
                                        onChange={handleChange}
                                        placeholder="University Name"
                                        className="corp-field w-full"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="corp-label flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-green-500" /> GPA / Grade
                                    </label>
                                    <input
                                        type="text"
                                        name="gpa"
                                        value={profile.gpa}
                                        onChange={handleChange}
                                        placeholder="Ex: 3.8/4.0"
                                        className="corp-field w-full"
                                    />
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="corp-label flex items-center gap-2">
                                        <Fingerprint size={14} className="text-slate-500" /> GitHub / Portfolio
                                    </label>
                                    <input
                                        type="text"
                                        name="github"
                                        value={profile.github}
                                        onChange={handleChange}
                                        placeholder="github.com/username"
                                        className="corp-field w-full"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="corp-label flex items-center gap-2">
                                        <Linkedin size={14} className="text-blue-600" /> LinkedIn Profile
                                    </label>
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={profile.linkedin}
                                        onChange={handleChange}
                                        placeholder="linkedin.com/in/username"
                                        className="corp-field w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="corp-label flex items-center gap-2">
                                    <Cpu size={14} className="text-pink-500" /> Skillset Modules (CSV)
                                </label>
                                <textarea
                                    name="skills"
                                    value={profile.skills}
                                    onChange={handleChange}
                                    placeholder="React, Python, AWS, Product Analytics..."
                                    className="corp-field w-full !h-32 py-3 resize-none"
                                />
                            </div>

                            {/* PROJECTS SECTION */}
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className="corp-label flex items-center gap-2">
                                        <Award size={14} className="text-purple-500" /> Projects Portfolio
                                    </label>
                                    <button onClick={addProject} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-all">
                                        <Plus size={12} /> Add Project
                                    </button>
                                </div>
                                {projects.map((proj, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-2xl space-y-3 border border-white/5">
                                        <div className="flex justify-between gap-4">
                                            <input
                                                placeholder="Project Title"
                                                className="corp-field w-full !bg-black/20"
                                                value={proj.title}
                                                onChange={(e) => updateProject(idx, 'title', e.target.value)}
                                            />
                                            <button onClick={() => removeProject(idx)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                                        </div>
                                        <textarea
                                            placeholder="Description"
                                            className="corp-field w-full !bg-black/20 !h-16 resize-none"
                                            value={proj.description}
                                            onChange={(e) => updateProject(idx, 'description', e.target.value)}
                                        />
                                        <input
                                            placeholder="Link URL"
                                            className="corp-field w-full !bg-black/20"
                                            value={proj.link}
                                            onChange={(e) => updateProject(idx, 'link', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* WORK HISTORY SECTION */}
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className="corp-label flex items-center gap-2">
                                        <Briefcase size={14} className="text-emerald-500" /> Professional Experience
                                    </label>
                                    <button onClick={addWork} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full flex items-center gap-1 transition-all">
                                        <Plus size={12} /> Add Role
                                    </button>
                                </div>
                                {workHistory.map((work, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-2xl space-y-3 border border-white/5">
                                        <div className="flex justify-between gap-4">
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <input
                                                    placeholder="Role / Title"
                                                    className="corp-field w-full !bg-black/20"
                                                    value={work.role}
                                                    onChange={(e) => updateWork(idx, 'role', e.target.value)}
                                                />
                                                <input
                                                    placeholder="Company"
                                                    className="corp-field w-full !bg-black/20"
                                                    value={work.company}
                                                    onChange={(e) => updateWork(idx, 'company', e.target.value)}
                                                />
                                            </div>
                                            <button onClick={() => removeWork(idx)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Duration (e.g. 2022 - 2023)"
                                                className="corp-field w-full !bg-black/20"
                                                value={work.duration}
                                                onChange={(e) => updateWork(idx, 'duration', e.target.value)}
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Responsibilities / Achievements"
                                            className="corp-field w-full !bg-black/20 !h-16 resize-none"
                                            value={work.description}
                                            onChange={(e) => updateWork(idx, 'description', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex items-center justify-between">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="previous_experience"
                                            checked={profile.previous_experience}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${profile.previous_experience ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${profile.previous_experience ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400 transition-colors">Mark as Experienced</span>
                                </label>

                                <motion.button
                                    onClick={handleSave}
                                    disabled={saving}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl relative overflow-hidden group ${saving ? 'bg-slate-800 text-slate-500' : 'corp-btn-primary !w-auto'}`}
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={16} /> Save Full Profile
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
