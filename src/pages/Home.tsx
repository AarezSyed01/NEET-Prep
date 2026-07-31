import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Clock, Target, CheckCircle2, TrendingUp, AlertTriangle, Calendar, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export default function Home() {
  const { profile, stats } = useStore();

  const getDaysToExam = () => {
    if (!profile) return 0;
    const target = profile.examDate ? new Date(profile.examDate) : new Date(`${profile.targetYear || '2026'}-05-05`);
    const diff = target.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const getFormattedExamDate = () => {
    const rawDate = profile?.examDate || `${profile?.targetYear || '2026'}-05-05`;
    const parts = rawDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return rawDate;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const minsToday = (stats?.dailyProgress || {})[todayStr] || 0;
  const progressPercent = Math.min(100, Math.round((minsToday / (profile?.dailyStudyTarget || 120)) * 100));
  const accuracy = (stats?.totalQuestionsSolved || 0) > 0 
    ? Math.round(((stats?.correctAnswers || 0) / stats.totalQuestionsSolved) * 100) 
    : 0;

  const correctPercent = (stats?.totalQuestionsSolved || 0) > 0 
    ? Math.round(((stats?.correctAnswers || 0) / stats.totalQuestionsSolved) * 100) 
    : 0;

  const wrongPercent = (stats?.totalQuestionsSolved || 0) > 0 
    ? Math.round(((stats?.wrongAnswers || 0) / stats.totalQuestionsSolved) * 100) 
    : 0;

  const totalPercent = (stats?.totalQuestionsSolved || 0) > 0 ? 100 : 0;

  // Chart data
  const chartData = Object.entries(stats?.dailyProgress || {}).slice(-7).map(([date, mins]) => ({
    date: date.substring(5),
    mins
  }));

  if (chartData.length === 0) {
    chartData.push({ date: 'Today', mins: 0 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5 sm:space-y-8 max-w-full pb-10 font-sans"
    >
      
      {/* Top Professional Bento Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        
        {/* Days Remaining Box - HIGHLIGHTED GADGET as requested */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#0C2E2C] text-white p-3.5 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-md border border-[#113C3A] hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
             <span className="text-[9px] sm:text-[10px] text-teal-300 font-extrabold uppercase tracking-widest truncate">Countdown to Exam</span>
             <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 animate-pulse shrink-0 ml-1" />
          </div>
          <div className="mt-2.5 sm:mt-4">
             <div className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
               <span>{getDaysToExam()}</span>
               <span className="text-[9px] sm:text-xs text-rose-400 font-extrabold uppercase tracking-widest truncate">Days Left</span>
             </div>
             <p className="text-[10px] sm:text-xs font-semibold text-slate-300 mt-1 truncate">NEET: {getFormattedExamDate()}</p>
          </div>
        </motion.div>
        
        {/* Study Goal Progress Meter */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#0e1615] p-3.5 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/60 dark:border-[#142826] hover:shadow-md hover:border-teal-100 dark:hover:border-teal-900 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
             <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest truncate">Today's Study Goal</span>
             <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-teal-400 shrink-0 ml-1" />
          </div>
          <div className="mt-2.5 sm:mt-4">
             <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{progressPercent}%</span>
                <span className="text-[9px] sm:text-[11px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400 px-1 sm:px-2 py-0.5 rounded-md truncate">{minsToday}m / {profile?.dailyStudyTarget || 120}m</span>
             </div>
             <div className="w-full bg-slate-100 dark:bg-[#122422] h-1.5 sm:h-2 mt-2 sm:mt-3 rounded-full overflow-hidden border border-slate-50 dark:border-transparent">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
             </div>
          </div>
        </motion.div>
 
        {/* Practice Accuracy Box */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-[#0e1615] p-3.5 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/60 dark:border-[#142826] hover:shadow-md hover:border-teal-100 dark:hover:border-teal-900 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
             <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest truncate">Net Q&A Accuracy</span>
             <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
          </div>
          <div className="mt-2.5 sm:mt-4">
             <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{accuracy}%</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{stats.correctAnswers} solved</span>
             </div>
             <div className="w-full bg-slate-150/80 dark:bg-[#122422] h-1.5 sm:h-2 mt-2 sm:mt-3 rounded-full overflow-hidden border border-slate-50 dark:border-transparent">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all" style={{ width: `${accuracy}%` }}></div>
             </div>
          </div>
        </motion.div>
 
        {/* Hot Streak Counter - UNHIGHLIGHTED as requested */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#0e1615] p-3.5 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/60 dark:border-[#142826] hover:shadow-md hover:border-teal-100 dark:hover:border-teal-900 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
             <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest truncate">Candidate Streak</span>
             <span className="text-amber-500 text-xs sm:text-sm">🔥</span>
          </div>
          <div className="mt-2.5 sm:mt-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stats.streak} Days</div>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">Physicians persist! 🩺</p>
          </div>
        </motion.div>
      </div>

      {/* Graphs & Detailed Analytics Row */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6 flex-1 min-h-0">
           {/* Left Interactive Panel */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 sm:gap-6">
          
          {/* Progress Bars for Subjects */}
          <div className="bg-white dark:bg-[#0e1615] border border-slate-200/70 dark:border-[#142826] rounded-2xl md:rounded-3xl shadow-sm flex flex-col transition-colors duration-200">
            <div className="p-3.5 sm:p-5 border-b border-slate-150/70 dark:border-[#142826] flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40 font-extrabold text-slate-705">
              <h2 className="text-slate-800 dark:text-slate-100 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> Subject-Wise accuracy progress
              </h2>
            </div>
            <div className="p-3.5 sm:p-6 grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {['Physics', 'Chemistry', 'Biology'].map((subject) => {
                const s = stats?.subjectProgress?.[subject as keyof typeof stats.subjectProgress] || { questionsAttempted: 0, correctAnswers: 0 };
                const acc = (s.questionsAttempted || 0) > 0 ? Math.round(((s.correctAnswers || 0) / s.questionsAttempted) * 100) : 0;
                
                let colorClass = "bg-teal-600";
                let textClass = "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-100/60 dark:border-teal-900/30";
                let label = "Consistent";
                
                if (acc >= 90) { 
                  colorClass = "bg-emerald-600"; 
                  textClass = "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/60 dark:border-emerald-900/30"; 
                  label = "Mastered"; 
                } else if (acc > 0 && acc < 70) { 
                  colorClass = "bg-amber-600"; 
                  textClass = "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-100/60 dark:border-amber-900/30"; 
                  label = "Improving"; 
                } else if (acc === 0) {
                  colorClass = "bg-slate-300 dark:bg-slate-705";
                  textClass = "text-slate-605 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/30";
                  label = "No Attempts";
                }

                return (
                  <div key={subject} className="flex-1 flex flex-col items-center bg-slate-50/40 dark:bg-[#090f0e] p-2.5 sm:p-4 border border-slate-100 dark:border-[#142826] rounded-xl sm:rounded-2xl">
                    <div className="mb-1 text-lg sm:text-2xl md:text-3xl font-black flex items-center justify-center text-slate-800 dark:text-slate-100">
                      <span>{acc}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-200/80 dark:bg-[#122422] rounded-full h-1 sm:h-2 mb-2 border border-slate-50 dark:border-transparent">
                      <div 
                        className={`${colorClass} h-full rounded-full transition-all`} 
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                    
                    <div className="text-[10px] sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">{subject}</div>
                    
                    <div className={`text-[8px] sm:text-[9px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[6px] sm:rounded-lg font-bold mt-1.5 uppercase tracking-wide truncate max-w-full ${textClass}`}>
                      {label}
                    </div>
                    <p className="text-[8px] sm:text-[10px] text-slate-450 dark:text-slate-550 mt-1.5 font-bold uppercase tracking-wider text-center">{s.questionsAttempted} Solved</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Chart Card */}
          <div className="bg-white dark:bg-[#0e1615] border border-slate-200/70 dark:border-[#142826] rounded-2xl md:rounded-3xl shadow-sm flex flex-col overflow-hidden transition-colors duration-200">
            <div className="p-4 sm:p-5 border-b border-slate-150/70 dark:border-[#142826] flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
              <div>
                <h2 className="text-slate-800 dark:text-slate-100 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-teal-400" /> Practice review Activity
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Study duration logged in minutes during the last 7 sessions</p>
              </div>
            </div>
            
            <div className="p-3.5 sm:p-6 h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94A3B8" strokeWidth={1} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#092B2A', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'extrabold', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="mins" stroke="#0D9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTeal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* Right Weak Topics + General Activity Feed */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          
          {/* Weak Topics Board */}
          <div className="bg-white dark:bg-[#0e1615] border border-slate-200/70 dark:border-[#142826] rounded-2xl md:rounded-3xl shadow-sm flex flex-col overflow-hidden transition-colors duration-200">
            <div className="p-4 sm:p-5 border-b border-slate-150/70 dark:border-[#142826] font-extrabold bg-[#F8FAF9] dark:bg-slate-900/40 flex justify-between items-center text-slate-705">
              <span className="text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-500" /> Focus Revisions needed
              </span>
            </div>
            
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              {stats.totalQuestionsSolved === 0 ? (
                <div className="text-slate-400 dark:text-slate-500 text-center py-8 text-[11px] font-bold uppercase tracking-wider">
                  🚀 Launch practices to view target revision topics!
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2.5 sm:gap-3.5 items-start p-2.5 sm:p-3 bg-rose-50/50 dark:bg-rose-955/20 border border-rose-100/60 dark:border-rose-900/30 rounded-xl sm:rounded-2xl">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-100 dark:bg-rose-955/40 text-rose-700 dark:text-rose-455 font-black text-center flex items-center justify-center text-xs sm:text-sm shrink-0">
                      !
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold text-slate-800 dark:text-slate-150 truncate">Rotational Dynamics</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">Physics • 42% Acc</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2.5 sm:gap-3.5 items-start p-2.5 sm:p-3 bg-amber-50/50 dark:bg-amber-955/20 border border-amber-100/60 dark:border-amber-900/30 rounded-xl sm:rounded-2xl">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-150 dark:bg-amber-955/40 text-amber-800 dark:text-amber-455 font-black text-center flex items-center justify-center text-xs sm:text-sm shrink-0">
                      !
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold text-slate-800 dark:text-slate-150 truncate">Chemical Equilibrium</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">Chemistry • 55% Acc</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats overview panel */}
          <div className="bg-[#092B2A] rounded-2xl md:rounded-3xl p-4 sm:p-6 text-white border border-[#113C3A] shadow-md">
            <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
               <Award className="w-4 h-4 text-teal-300" />
               <h4 className="text-xs uppercase tracking-widest font-extrabold text-teal-300">Attempt Logs Feed</h4>
            </div>
            <div className="space-y-3 sm:space-y-4 mt-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] sm:text-xs text-teal-100/75 font-semibold">Total Questions</span>
                  <span className="text-[11px] sm:text-xs text-white font-extrabold font-mono">{stats.totalQuestionsSolved} Qs</span>
                </div>
                <div className="w-full bg-teal-950 h-1 sm:h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-400 h-full rounded-full transition-all" style={{ width: `${totalPercent}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] sm:text-xs text-teal-100/75 font-semibold">Correct Evaluation</span>
                  <span className="text-[11px] sm:text-xs text-emerald-400 font-extrabold font-mono">{stats.correctAnswers} Qs</span>
                </div>
                <div className="w-full bg-teal-950 h-1 sm:h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${correctPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] sm:text-xs text-teal-100/75 font-semibold">Inaccurate Evaluation</span>
                  <span className="text-[11px] sm:text-xs text-rose-400 font-extrabold font-mono">{stats.wrongAnswers} Qs</span>
                </div>
                <div className="w-full bg-teal-950 h-1 sm:h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full transition-all" style={{ width: `${wrongPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
