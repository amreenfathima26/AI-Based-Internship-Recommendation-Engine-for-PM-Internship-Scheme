import React, { useState } from 'react';
import { BookOpen, Check, Award, Cpu, Code, ArrowRight, Sparkles, Globe, Target } from 'lucide-react';
import config from '../config';
import { motion } from 'framer-motion';

const QuizHub = () => {
    const [subject, setSubject] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const startQuiz = async (subj) => {
        setLoading(true);
        setSubject(subj);
        setAnswers({});
        setResult(null);
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/quiz/${subj}`);
            const data = await res.json();
            setQuestions(data.questions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qId, optionIdx) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: optionIdx
        }));
    };

    const submitQuiz = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/quiz/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject,
                    answers
                })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- VIEW: QUIZ SELECTION ---
    if (!subject) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
                    <div>
                        <h1 className="corp-header text-6xl flex items-center gap-4">
                            <Cpu className="text-blue-600" size={48} />
                            Skill Assessment
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-slate-800 rounded-full"></div>)}
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Competency Verification Protocol</p>
                        </div>
                    </div>
                </div>

                {/* Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-indigo-500 transition-all"
                        onClick={() => startQuiz('pm')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                <BookOpen size={32} />
                            </div>
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-indigo-100">
                                Global Standard
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Product Management</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Evaluate strategic thinking, metric analysis (KPIs), and agile frameworks.
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-emerald-500 transition-all"
                        onClick={() => startQuiz('python')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                                <Code size={32} />
                            </div>
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-100">
                                Technical Core
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Python Technical</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Assess proficiency in data structures, algorithms, and syntax efficiency.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-cyan-500 transition-all"
                        onClick={() => startQuiz('data_analytics')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-sm">
                                <Cpu size={32} />
                            </div>
                            <div className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-cyan-100">
                                Analytics Core
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Data Analytics</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Test knowledge on SQL, Python (Pandas), and data visualization best practices.
                        </p>
                        <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-pink-500 transition-all"
                        onClick={() => startQuiz('ux_design')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors shadow-sm">
                                <Award size={32} />
                            </div>
                            <div className="px-3 py-1 bg-pink-50 text-pink-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-pink-100">
                                Design Thinking
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">UX Design</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Validate user research, prototyping, and usability heuristics.
                        </p>
                        <div className="flex items-center gap-2 text-pink-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-orange-500 transition-all"
                        onClick={() => startQuiz('machine_learning')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-sm">
                                <Sparkles size={32} />
                            </div>
                            <div className="px-3 py-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-orange-100">
                                AI Architecture
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Machine Learning</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Deep dive into supervised learning, neural networks, and model metrics.
                        </p>
                        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-purple-500 transition-all"
                        onClick={() => startQuiz('digital_marketing')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                                <Globe size={32} />
                            </div>
                            <div className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-purple-100">
                                Growth Hacking
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Digital Marketing</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Master SEO, content strategies, and conversion rate optimization (CRO).
                        </p>
                        <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="corp-card group cursor-pointer hover:!border-teal-500 transition-all"
                        onClick={() => startQuiz('agile_leadership')}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                                <Target size={32} />
                            </div>
                            <div className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-teal-100">
                                Scrum Master
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Agile Leadership</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Validate your understanding of Scrum ceremonies, artifacts, and leadership.
                        </p>
                        <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Initialize Module <ArrowRight size={16} />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // --- VIEW: RESULTS ---
    if (result) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="corp-card max-w-xl w-full text-center">
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/10">
                        <Award className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h2 className="corp-header text-4xl text-slate-900 mb-2">Assessment Complete</h2>
                    <p className="text-slate-500 font-medium mb-8">Performance Analysis Report</p>

                    <div className="flex justify-center items-end gap-2 mb-8">
                        <span className="text-7xl font-black text-slate-900 tracking-tighter">
                            {Math.round(result.percentage)}
                        </span>
                        <span className="text-2xl font-bold text-slate-400 mb-2">%</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
                        <p className="text-slate-600 text-sm font-bold uppercase tracking-wider">
                            Score Index: <span className="text-slate-900">{result.score} / {result.total}</span>
                        </p>
                    </div>

                    <button
                        onClick={() => setSubject(null)}
                        className="corp-btn-primary"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    // --- VIEW: QUIZ ACTIVE ---
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setSubject(null)}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                    <ArrowRight size={20} className="rotate-180 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Assessment: {subject}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Session</p>
                </div>
            </div>

            {loading ? (
                <div className="corp-card flex items-center justify-center py-20">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Modules...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="corp-card !p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex gap-4">
                                <span className="text-blue-200 text-2xl font-black">{(idx + 1).toString().padStart(2, '0')}</span>
                                <span className="pt-1">{q.question}</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {q.options.map((opt, optIdx) => (
                                    <div
                                        key={optIdx}
                                        onClick={() => handleOptionSelect(q.id, optIdx)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all group ${answers[q.id] === optIdx
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span className={`text-sm font-bold ${answers[q.id] === optIdx ? 'text-white' : 'text-slate-700'}`}>
                                            {opt}
                                        </span>
                                        {answers[q.id] === optIdx && (
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                <Check size={14} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <button
                            onClick={submitQuiz}
                            disabled={Object.keys(answers).length < questions.length}
                            className={`corp-btn-primary ${Object.keys(answers).length < questions.length ? 'opacity-50 cursor-not-allowed !bg-slate-300' : ''}`}
                        >
                            Submit Assessment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizHub;
