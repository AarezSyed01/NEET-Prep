import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Save, RefreshCw, Award, CheckCircle, Trash2, Clock, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ClassLevel } from '../types';

export default function Settings() {
  const { profile, setProfile, stats, clearAllData } = useStore();

  const [name, setName] = useState(profile?.name || '');
  const [currentClass, setCurrentClass] = useState<ClassLevel>(profile?.currentClass || '12th');
  const [targetYear, setTargetYear] = useState(profile?.targetYear || '2026');
  const [dailyTargetHours, setDailyTargetHours] = useState(
    profile?.dailyStudyTarget ? String(profile.dailyStudyTarget / 60) : '2'
  );
  const [email, setEmail] = useState(profile?.email || 'aarezali564@gmail.com');
  const [examDate, setExamDate] = useState(profile?.examDate || `${profile?.targetYear || '2026'}-05-05`);

  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: name.trim(),
      currentClass,
      targetYear,
      dailyStudyTarget: Math.floor(parseFloat(dailyTargetHours) * 60) || 120,
      email: email.trim(),
      targetScore: profile?.targetScore || 650,
      weakSubject: profile?.weakSubject || 'None',
      examDate
    });
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleResetApp = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 4000);
    } else {
      clearAllData();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-32">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-teal-600" /> Settings & Profile
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Configure your full NEET student profile, test countdown dates, and active study budgets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side Info Card */}
        <div className="bg-[#0C2E2C] text-white p-6 rounded-3xl border border-teal-900 space-y-4 shadow-lg flex flex-col justify-between">
           <div className="space-y-4">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest bg-teal-900/50 px-2.5 py-1 rounded-md border border-teal-800/80 inline-block">Active Student Card</span>
              <div>
                 <h3 className="text-lg font-black truncate text-white">{profile?.name || 'Aarez Syed'}</h3>
                 <p className="text-slate-300 text-[11px] font-bold mt-2 uppercase tracking-wide bg-[#071f1e] px-2 py-1 rounded-lg border border-teal-950 inline-block">NEET {profile?.targetYear || '2026'} • {profile?.currentClass || '12th'}</p>
              </div>
              
              <div className="pt-4 border-t border-teal-900/80 space-y-3 text-[11px] font-bold text-slate-300">
                <div className="flex justify-between items-center">
                   <span className="text-teal-400">Solved Qs:</span>
                   <span className="text-white font-mono">{stats.totalQuestionsSolved}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-teal-400">Streak Status:</span>
                   <span className="text-amber-400">🔥 {stats.streak} Days</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-teal-400">Daily Study Target:</span>
                   <span className="text-emerald-400">⏱️ {profile?.dailyStudyTarget ? `${profile.dailyStudyTarget / 60} hrs` : '2 hrs'}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-teal-900/40">
                   <span className="text-teal-400">Target Exam Date:</span>
                   <span className="text-white font-medium text-[10px] bg-teal-900 px-1.5 py-0.5 rounded">{profile?.examDate || '2026-05-05'}</span>
                </div>
              </div>
           </div>
           
           <div className="text-[10px] text-teal-400/80 font-bold bg-[#071F1D] p-3.5 rounded-2xl text-center border border-teal-900/30">
             Ready to score higher! 🩺
           </div>
        </div>

        {/* Right Side Settings Form */}
        <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
           <form onSubmit={handleSave} className="space-y-5">
              
              <div>
                {/* Name field */}
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm font-semibold px-4 py-2.5 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition-all"
                />
              </div>

              {/* Class Level Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Class / Dropper State</label>
                <div className="grid grid-cols-3 gap-3">
                  {['11th', '12th', 'Dropper'].map((cl) => (
                    <button
                      key={cl}
                      type="button"
                      onClick={() => setCurrentClass(cl as ClassLevel)}
                      className={`py-2.5 px-3 text-[11px] font-extrabold uppercase tracking-widest rounded-xl border-2 transition-all ${
                        currentClass === cl
                          ? 'bg-teal-50 border-teal-500 text-teal-850'
                          : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {cl}
                    </button>
                  ))}
                </div>
              </div>



              {/* Year, custom countdown exam date, dynamic target hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {/* Target Year */}
                 <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Target Year</label>
                    <select
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value)}
                      className="w-full text-sm font-semibold px-4 py-2.5 border border-slate-200 bg-transparent rounded-xl focus:border-teal-400 outline-none"
                    >
                      {Array.from({ length: 4 }).map((_, i) => {
                        const y = new Date().getFullYear() + i;
                        return <option key={y} value={y}>{y}</option>;
                      })}
                    </select>
                 </div>

                 {/* Custom Exam Count Down target date */}
                 <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Exam Countdown Date</label>
                    <input
                      type="date"
                      required
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full text-sm font-semibold px-4 py-2 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none"
                    />
                 </div>

                 {/* Daily target in hours */}
                 <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                       <span>Daily target (hrs)</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="16"
                      step="0.5"
                      value={dailyTargetHours}
                      onChange={(e) => setDailyTargetHours(e.target.value)}
                      className="w-full text-sm font-semibold px-4 py-2.5 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none"
                    />
                  </div>
              </div>

              {/* Message save status box */}
              <AnimatePresence>
                {showSavedMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Success! Onboarding profile and goals saved.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                 <button
                   type="button"
                   onClick={handleResetApp}
                   className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 border ${
                     showResetConfirm
                       ? 'bg-rose-600 text-white border-rose-650 hover:bg-rose-700 font-extrabold'
                       : 'bg-rose-50 hover:bg-rose-100/80 text-rose-700 border-rose-200/50'
                   }`}
                 >
                   <Trash2 className="w-4 h-4" /> {showResetConfirm ? '⚠️ Click to Confirm Reset?' : 'Reset Data'}
                 </button>
                 
                 <button
                   type="submit"
                   className="px-8 py-3 bg-teal-650 hover:bg-teal-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition shadow-md flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                 >
                   <Save className="w-4 h-4" /> Save changes
                 </button>
              </div>

           </form>
        </div>

      </div>

    </div>
  );
}
