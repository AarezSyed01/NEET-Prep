import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ClassLevel } from '../types';
import Logo from '../components/Logo';

export default function Onboarding() {
  const setProfile = useStore(state => state.setProfile);
  
  const [name, setName] = useState('');
  const [currentClass, setCurrentClass] = useState<ClassLevel>('12th');
  const [targetYear, setTargetYear] = useState(String(new Date().getFullYear() + 1));
  const [dailyTarget, setDailyTarget] = useState('2');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setProfile({
      name: name.trim(),
      currentClass,
      targetYear,
      dailyStudyTarget: Math.floor(parseFloat(dailyTarget) * 60) || 120
    });
  };

  return (
    <div className="min-h-screen bg-[#EFF4F2] flex flex-col items-center justify-center p-4 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/50"
      >
        <div className="bg-gradient-to-br from-teal-50 via-teal-50/10 to-transparent p-8 flex flex-col items-center justify-center border-b border-slate-100">
          <Logo mode="full" theme="light" iconSize={64} />
        </div>

        <form onSubmit={handleStart} className="p-8 space-y-6 font-sans">
          {/* User Name input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Your Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all font-semibold text-slate-800 placeholder-slate-400"
              placeholder="e.g., Aarez Syed"
            />
          </div>

          {/* Current Class Choice */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Candidate Cohort / Class</label>
            <div className="grid grid-cols-3 gap-3">
              {['11th', '12th', 'Dropper'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCurrentClass(lvl as ClassLevel)}
                  className={`py-3 px-3 text-xs font-extrabold uppercase tracking-widest rounded-xl border-2 transition-all ${
                    currentClass === lvl 
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-extrabold' 
                      : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Target Year</label>
              <select 
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-55/40 text-sm font-bold rounded-xl focus:ring-1 focus:ring-teal-400 outline-none"
              >
                {Array.from({length: 4}).map((_, i) => {
                  const y = new Date().getFullYear() + i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Daily Target (hrs)</label>
              <input 
                type="number" 
                min="1"
                max="16"
                step="0.5"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 text-sm font-bold rounded-xl focus:ring-1 focus:ring-teal-450 outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button 
            type="submit"
            className="w-full bg-teal-650 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(13,148,136,0.25)] flex items-center justify-center group"
          >
            Start Preparing 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>

      {/* Symmetrical Register Footer requested by user */}
      <footer className="text-center text-[11px] text-slate-400 select-none font-sans space-y-1">
        <p className="font-semibold text-slate-500">Developed by <span className="text-teal-700 font-bold">Aarez Syed</span></p>
        <p>© 2026 NEET Prep. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
