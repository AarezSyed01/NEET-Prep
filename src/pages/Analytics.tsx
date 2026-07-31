import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Award, CheckCircle2, AlertCircle, Clock, BookOpen, Compass } from 'lucide-react';

export default function Analytics() {
  const { stats, profile } = useStore();

  const total = stats?.totalQuestionsSolved || 0;
  const correct = stats?.correctAnswers || 0;
  const incorrect = stats?.wrongAnswers || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Prepare weekly chart progress data
  const chartData = Object.entries(stats?.dailyProgress || {}).slice(-7).map(([date, mins]) => ({
    date: date.substring(5), // extract MM-DD
    Minutes: mins
  }));

  if (chartData.length === 0) {
    chartData.push({ date: 'Today', Minutes: 0 });
  }

  // Subject-wise stats layout
  const subjectDistribution = [
    { name: 'Physics', color: '#0D9488', data: stats?.subjectProgress?.Physics || { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} } },
    { name: 'Chemistry', color: '#F59E0B', data: stats?.subjectProgress?.Chemistry || { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} } },
    { name: 'Biology', color: '#10B981', data: stats?.subjectProgress?.Biology || { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} } }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-12 font-sans"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          <Activity className="w-7 h-7 text-teal-600" /> Study Insights & Analytics
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Review candidate practice output, answer ratios, and masteries progress.</p>
      </div>

      {/* Accuracy Ring & High-Level overview card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
         
         <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice accuracy ratio</h2>
            <div className="py-4 sm:py-6 flex flex-col items-center justify-center">
               <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full border-8 border-teal-50">
                  <div className="absolute inset-0 rounded-full border-8 border-teal-600 border-t-transparent animate-spin-slow" style={{ transform: `rotate(${accuracy * 3.6}deg)` }}></div>
                  <div className="text-center">
                     <span className="text-2xl sm:text-3xl font-extrabold text-slate-855">{accuracy}%</span>
                     <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Accurate</p>
                  </div>
               </div>
            </div>
            <div className="flex justify-between text-[11px] sm:text-xs font-bold border-t border-slate-100 pt-3 gap-2">
               <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg truncate shrink-0">✓ {correct} Correct</span>
               <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg truncate shrink-0">✗ {incorrect} Wrong</span>
            </div>
         </div>

         {/* General Metrics items */}
         <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0E4F4F]">Evaluated Solitaries</h2>
            <div className="py-3 sm:py-4">
               <div className="text-3xl sm:text-4xl font-black text-teal-600 leading-none">{total} Qs</div>
               <span className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-2 inline-block">Practice items parsed through evaluations</span>
            </div>
            <div className="bg-[#FAFBFB] p-3 rounded-xl sm:rounded-2xl border border-slate-100/80 flex gap-2 sm:gap-2.5 items-center">
               <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
               <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold leading-normal">
                  Clinical standards: NEET admissions require consistent accurate margins of &gt;85% to target premium medical institution rankings.
               </p>
            </div>
         </div>

         {/* Time Log metrics card */}
         <div className="bg-teal-950 text-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-teal-900 shadow-md flex flex-col justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Aggregate hours reviewed</h2>
            <div className="py-3 sm:py-4">
               <div className="text-3xl sm:text-4xl font-black text-teal-300 leading-none">{(stats.studyTimeInMinutes / 60).toFixed(1)} <span className="text-md sm:text-lg font-normal text-teal-100/70">hrs</span></div>
               <span className="text-[11px] sm:text-xs font-bold text-teal-100/60 mt-2 inline-block">Estimated rigorous review duration logged</span>
            </div>
            <div className="bg-[#051C1B] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#113C3A] flex items-center gap-2 sm:gap-2.5">
               <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-teal-300 shrink-0" />
               <div className="text-[9px] sm:text-[10px] text-teal-200/80 font-bold uppercase tracking-wider">
                  Goal: <span className="font-extrabold text-[#2EE5BE]">{profile?.dailyStudyTarget ? `${profile.dailyStudyTarget / 60} hrs` : '2 hrs'} limit</span>
               </div>
            </div>
         </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
         
         {/* Study Timings Chart - 7 cols */}
         <div className="lg:col-span-8 bg-white border border-slate-200/60 p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
               <div>
                  <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">Daily focus timeline trends</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Study sessions logged in minutes</p>
               </div>
            </div>

            <div className="h-48 sm:h-64 mt-4 text-[10px] sm:text-xs font-bold">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorTealMins" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25}/>
                           <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="date" stroke="#94A3B8" strokeWidth={1} tickLine={false} style={{ fontWeight: 'bold' }} />
                     <YAxis stroke="#94A3B8" strokeWidth={1} tickLine={false} style={{ fontWeight: 'bold' }} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#092B2A', borderRadius: '16px', color: 'white', border: 'none', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="Minutes" stroke="#0D9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTealMins)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Subject Wise attempt details - 4 cols */}
         <div className="lg:col-span-4 bg-white border border-slate-200/60 p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-sm flex flex-col justify-between gap-4">
            <div>
               <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3 sm:mb-4">Unit evaluations</h3>
               <div className="space-y-3 sm:space-y-4">
                  {subjectDistribution.map(subject => {
                     const attempts = subject.data.questionsAttempted;
                     const right = subject.data.correctAnswers;
                     const subAcc = attempts > 0 ? Math.round((right / attempts) * 100) : 0;
                     
                     return (
                        <div key={subject.name} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 bg-[#FAFBFB] space-y-1">
                           <div className="flex justify-between items-center">
                              <span className="font-extrabold text-slate-800 text-xs">{subject.name}</span>
                              <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md sm:rounded-lg text-white" style={{ backgroundColor: subject.color }}>
                                 {subAcc}% Correct
                              </span>
                           </div>
                           <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-slate-400 pt-1">
                              <span>Items: {attempts} Qs</span>
                              <span>Correct: {right}</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="pt-3 border-t border-slate-150 flex items-center gap-2 bg-teal-50/10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-teal-150/20">
               <Compass className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
               <span className="text-[9px] sm:text-[10px] text-teal-800 font-bold uppercase tracking-widest">Master chapters inside prep tools.</span>
            </div>
         </div>

      </div>

    </motion.div>
  );
}
