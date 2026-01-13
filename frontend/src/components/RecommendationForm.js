import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, Sparkles, GraduationCap, Briefcase, Heart, Check, ChevronRight } from 'lucide-react';

const educationOptions = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate / Post Graduate' },
];

const skillOptions = [
  'Communication', 'Content Writing', 'Social Media', 'Data Analysis',
  'Research', 'Excel', 'Graphic Design', 'Computer Skills',
  'Creative Thinking', 'Project Management', 'Report Writing',
  'Digital Marketing', 'Community Engagement', 'Troubleshooting'
];

const interestOptions = [
  'Technology and Digital', 'Education and Skill Development',
  'Healthcare and Public Health', 'Rural Development and Agriculture',
  'Environment and Sustainability', 'Social Welfare and Gender Equality',
  'Finance and Economics', 'Youth Development and Sports',
  'Creative and Design', 'Research and Policy'
];

const locationOptions = [
  'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Delhi', 'Other'
];

function RecommendationForm({ onSubmit, loading, error, initialProfile }) {
  const [formData, setFormData] = useState({
    education: '',
    skills: [],
    interests: [],
    location: '',
    previous_experience: false,
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        education: initialProfile.education || '',
        skills: initialProfile.skills || [],
        interests: initialProfile.interests || [],
        location: initialProfile.location || '',
        previous_experience: initialProfile.previous_experience || false,
      });
    }
  }, [initialProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const [customSkill, setCustomSkill] = useState('');
  const [allSkills, setAllSkills] = useState(skillOptions);

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !allSkills.includes(customSkill.trim())) {
      const newSkill = customSkill.trim();
      setAllSkills([...allSkills, newSkill]);
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setCustomSkill('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.education && formData.location && formData.skills.length > 0) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.education && formData.location && formData.skills.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm font-bold rounded-2xl flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          {error}
        </motion.div>
      )}

      {/* Education Section */}
      <div className="space-y-4">
        <label className="corp-label flex items-center gap-2">
          <GraduationCap size={16} className="text-blue-600" />
          Academic Foundation
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationOptions.map(option => (
            <label
              key={option.value}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${formData.education === option.value
                ? 'bg-blue-50 border-blue-600 shadow-md shadow-blue-500/10'
                : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="education"
                  value={option.value}
                  checked={formData.education === option.value}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.education === option.value ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                  {formData.education === option.value && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-bold transition-colors ${formData.education === option.value ? 'text-blue-900' : 'text-slate-600 group-hover:text-blue-800'}`}>
                  {option.label}
                </span>
              </div>
            </label>
          ))}
          {/* Custom Education Option */}
          <label
            className={`flex flex-col p-5 rounded-2xl border transition-all cursor-pointer group ${!educationOptions.some(o => o.value === formData.education) && formData.education !== ''
              ? 'bg-blue-50 border-blue-600 shadow-md shadow-blue-500/10'
              : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <input
                type="radio"
                name="education"
                value="custom"
                checked={!educationOptions.some(o => o.value === formData.education) && formData.education !== ''}
                onChange={() => setFormData(prev => ({ ...prev, education: 'Custom' }))}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${!educationOptions.some(o => o.value === formData.education) && formData.education !== '' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                {(!educationOptions.some(o => o.value === formData.education) && formData.education !== '') && <Check size={12} className="text-white" />}
              </div>
              <span className={`text-sm font-bold transition-colors ${!educationOptions.some(o => o.value === formData.education) && formData.education !== '' ? 'text-blue-900' : 'text-slate-600 group-hover:text-blue-800'}`}>
                Other / Custom
              </span>
            </div>
            {(!educationOptions.some(o => o.value === formData.education) && formData.education !== '') && (
              <input
                type="text"
                placeholder="Enter your degree/qualification..."
                value={formData.education === 'Custom' ? '' : formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full mt-2 p-2 rounded border border-blue-200 text-sm focus:outline-none focus:border-blue-500 !bg-white !text-black !opacity-100"
                style={{ color: '#000000', backgroundColor: '#ffffff', opacity: 1 }}
                autoFocus
              />
            )}
          </label>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <label className="corp-label flex items-center gap-2">
          <Briefcase size={16} className="text-pink-600" />
          Neural Skill Matrix
        </label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Add custom skill..."
            className="corp-field !py-2 !px-4 text-xs w-48 !bg-white !text-black !opacity-100"
            style={{ color: '#000000', backgroundColor: '#ffffff', opacity: 1 }}
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            className="bg-slate-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-blue-600 transition-colors"
          >
            ADD
          </button>
        </div>

        <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto">
          {allSkills.map(skill => {
            const isActive = formData.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                className={`px-6 py-3 text-xs font-bold transition-all border rounded-full flex items-center gap-2 ${isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-blue-300 hover:text-blue-600'
                  }`}
                onClick={() => handleSkillToggle(skill)}
              >
                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests Section */}
      <div className="space-y-4">
        <label className="corp-label flex items-center gap-2">
          <Heart size={16} className="text-purple-600" />
          Sector Passions
        </label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            id="customInterestInput"
            placeholder="Add custom sector..."
            className="corp-field !py-2 !px-4 text-xs w-48 !bg-white !text-black !opacity-100"
            style={{ color: '#000000', backgroundColor: '#ffffff', opacity: 1 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.target.value.trim();
                if (val && !formData.interests.includes(val)) {
                  setFormData(prev => ({ ...prev, interests: [...prev.interests, val] }));
                  e.target.value = '';
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('customInterestInput');
              const val = input.value.trim();
              if (val && !formData.interests.includes(val)) {
                setFormData(prev => ({ ...prev, interests: [...prev.interests, val] }));
                input.value = '';
              }
            }}
            className="bg-slate-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-purple-600 transition-colors"
          >
            ADD
          </button>
        </div>

        <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto">
          {/* Show selected custom interests first if they aren't in options */}
          {formData.interests.filter(i => !interestOptions.includes(i)).map(interest => (
            <button
              key={interest}
              type="button"
              className="px-6 py-3 text-xs font-bold transition-all border rounded-full flex items-center gap-2 bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20"
              onClick={() => handleInterestToggle(interest)}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {interest}
            </button>
          ))}

          {interestOptions.map(interest => {
            const isActive = formData.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                className={`px-6 py-3 text-xs font-bold transition-all border rounded-full flex items-center gap-2 ${isActive
                  ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-purple-300 hover:text-purple-600'
                  }`}
                onClick={() => handleInterestToggle(interest)}
              >
                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Location & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="space-y-4">
          <label className="corp-label flex items-center gap-2">
            <MapPin size={16} className="text-blue-500" />
            Operational Hub
          </label>
          <div className="">
            <input
              list="location-options"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="corp-field w-full !bg-white !text-black !opacity-100"
              placeholder="Select or type custom location..."
              required
              style={{ color: '#000000', backgroundColor: '#ffffff', opacity: 1 }}
            />
            <datalist id="location-options">
              {locationOptions.map(location => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="previous_experience"
                checked={formData.previous_experience}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${formData.previous_experience ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-md ${formData.previous_experience ? 'translate-x-6' : ''}`}></div>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">Combat Experience</span>
              <span className="text-[10px] font-medium text-slate-400">I have prior industry internship history</span>
            </div>
          </label>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!isFormValid || loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl relative ${!isFormValid || loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'corp-btn-primary !h-16 !shadow-blue-500/30'}`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Calculating Trajectory...</span>
          </>
        ) : (
          <>
            <span>Establish Connection Pathways</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
    </form>
  );
}

export default RecommendationForm;
