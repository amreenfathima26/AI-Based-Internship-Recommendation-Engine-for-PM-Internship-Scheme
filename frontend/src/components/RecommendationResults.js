import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
  Building2,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  ArrowUpRight,
  Trophy
} from 'lucide-react';

function RecommendationResults({ recommendations, onReset }) {
  const getMatchColorClass = (score) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 60) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-blue-600 border-blue-200 bg-blue-50';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12 } }
  };

  const handleApply = (internship) => {
    // Priority 1: Direct Apply URL (from Live Jobs)
    if (internship.apply_url && internship.apply_url !== '#') {
      window.open(internship.apply_url, '_blank');
      return;
    }

    // Priority 2: Legacy Link field
    if (internship.link && internship.link !== '#') {
      window.open(internship.link, '_blank');
      return;
    }

    // Priority 3: Fallback Search (for AI Generated matches)
    const query = encodeURIComponent(`${internship.title} ${internship.organization} internship apply`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white tracking-tight flex items-center gap-4">
            <Sparkles className="text-primary" size={40} />
            Match Results
          </h2>
          <p className="text-zinc-500 font-medium text-lg">Top {recommendations.length} neural alignments identified for your profile</p>
        </div>
        <button
          onClick={onReset}
          className="glass-panel px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition flex items-center gap-2 group border-white/5 active:scale-95"
        >
          <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> Recalibrate Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {recommendations.map((internship, index) => (
          <motion.div
            key={internship.id}
            variants={cardVariants}
            className="corp-card p-10 flex flex-col justify-between group relative overflow-hidden h-full border border-slate-100 hover:border-blue-200 transition-colors"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`px-5 py-2.5 rounded-full border flex items-center gap-3 ${getMatchColorClass(internship.match_score)}`}>
                  <Trophy size={16} />
                  <span className="text-sm font-black tracking-tighter">{internship.match_score}% Alignment</span>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-xl text-slate-300 border border-slate-100">
                  #{index + 1}
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight group-hover:text-blue-600 transition-colors">{internship.title}</h3>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Building2 size={16} />
                  {internship.organization}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Building2, label: 'Sector', val: internship.sector },
                  { icon: MapPin, label: 'Location', val: internship.location },
                  { icon: Calendar, label: 'Duration', val: internship.duration },
                  { icon: CreditCard, label: 'Compensation', val: internship.stipend }
                ].map((detail, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
                      <detail.icon size={10} /> {detail.label}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">{detail.val}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3 italic">" {internship.description} "</p>

                {internship.required_skills?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Established Skill Links</p>
                    <div className="flex flex-wrap gap-2">
                      {internship.required_skills.map((skill, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-[9px] font-bold py-1 px-3 text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 transition-all uppercase rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <button
                onClick={() => handleApply(internship)}
                className="w-full corp-btn-primary py-5 rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group/apply shadow-xl"
              >
                Initialize Request
                <ArrowUpRight size={18} className="group-hover/apply:translate-x-1 group-hover/apply:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-10 border-t border-white/5 flex justify-center">
        <div className="glass-panel px-8 py-4 rounded-3xl flex items-center gap-4 border-white/5">
          <span className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]"></span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-none">
            Recommendations are calibrated based on current market velocity and neural profile affinity.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default RecommendationResults;
