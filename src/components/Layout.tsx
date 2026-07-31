import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { 
  Home, 
  BookOpen, 
  Activity, 
  Settings, 
  Award,
  PenTool,
  Brain,
  Sun,
  Moon,
  Calendar,
  Bookmark
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import Logo from './Logo';

export default function Layout() {
  const { profile, stats, theme, toggleTheme } = useStore();
  const location = useLocation();

  const isItemActive = (itemPath: string) => {
    if (itemPath.includes('?')) {
      const [path, search] = itemPath.split('?');
      return location.pathname === path && location.search.includes(search);
    }
    if (itemPath === '/practice' && location.search.includes('tab=bookmarks')) {
      return false;
    }
    return location.pathname === itemPath;
  };

  const getDaysToExam = () => {
    if (!profile) return 0;
    const target = profile.examDate ? new Date(profile.examDate) : new Date(`${profile.targetYear || '2026'}-05-05`);
    const diff = target.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const getHeaderDate = () => {
    const date = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `Today, ${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Syllabus', path: '/syllabus', icon: BookOpen },
    { name: 'Practice Q&A', path: '/practice', icon: PenTool },
    { name: 'Bookmarks', path: '/practice?tab=bookmarks', icon: Bookmark },
    { name: 'Performance Insights', path: '/analytics', icon: Activity },
    { name: 'Mock Exams', path: '/mock-tests', icon: Award },
    { name: 'Ustad AI Doubt Solver', path: '/ai-assistant', icon: Brain },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#EFF4F2] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans select-none transition-colors duration-200">
      
      {/* Sidebar - Curved Floating Panel for Desktop/Tablet (Responsive Width, Hidden on Mobile) */}
      <aside className="hidden md:flex md:w-20 lg:w-72 my-4 ml-4 flex-col bg-[#092B2A] rounded-3xl border border-[#113C3A] shadow-xl shrink-0 overflow-hidden transition-all duration-300">
        
        {/* Brand Container with Logo */}
        <div className="py-5 px-2 lg:p-6 flex flex-col items-center justify-center border-b border-[#12423F] bg-[#0A3332] shrink-0">
          <Logo mode="compact" theme="dark" className="lg:hidden" iconSize={36} />
          <Logo mode="full" theme="dark" className="hidden lg:flex" iconSize={48} />
        </div>
        
        {/* Primary Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 lg:p-5 space-y-6">
          <div>
            <div className="hidden lg:block text-teal-400/50 uppercase text-[10px] font-extrabold tracking-widest px-4 mb-3">
              Curriculum Units
            </div>
            <ul className="space-y-2 lg:space-y-1.5">
              {navItems.map((item) => {
                const active = isItemActive(item.path);
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={() =>
                        cn(
                          "flex flex-col lg:flex-row items-center lg:gap-3 px-2 lg:px-4 py-3 lg:py-3.5 rounded-2xl transition-all text-center lg:text-left relative group",
                          active
                            ? "bg-teal-500/10 text-teal-300 font-extrabold border-l-2 lg:border-l-4 border-teal-400 shadow-sm"
                            : "text-slate-200/90 hover:bg-teal-900/40 hover:text-white"
                        )
                      }
                    >
                      <item.icon className="w-5 h-5 lg:w-4.5 lg:h-4.5 text-teal-350 hover:scale-110 transition-transform" />
                      <span className="text-[10px] lg:text-sm font-semibold tracking-tight leading-tight mt-1 lg:mt-0 lg:truncate block max-w-full truncate px-0.5">
                        {/* Short labels for sidebar */}
                        <span className="lg:hidden block">
                          {item.name === 'Performance Insights' ? 'Insights' : 
                           item.name === 'Ustad AI Doubt Solver' ? 'Ustad AI' : 
                           item.name === 'Target Config' ? 'Settings' : 
                           item.name === 'Practice Q&A' ? 'Practice' :
                           item.name === 'Mock Exams' ? 'Mocks' : item.name}
                        </span>
                        <span className="hidden lg:block">{item.name}</span>
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Mini Student Info Panel */}
        <NavLink 
          to="/settings"
          className="block p-2 lg:p-5 mt-auto border-t border-[#12423F] bg-[#072423]/90 hover:bg-[#0A3B39] transition-all cursor-pointer shrink-0 group select-none"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:gap-3 mb-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 border border-white/20 flex items-center justify-center text-white font-extrabold shadow-md text-sm lg:text-base shrink-0 group-hover:scale-110 transition-transform">
              {profile?.name ? profile.name[0].toUpperCase() : 'S'}
            </div>
            <div className="hidden lg:block flex-1 overflow-hidden text-left">
              <div className="text-xs font-extrabold text-white tracking-wide truncate group-hover:text-teal-350 transition-colors">{profile?.name || 'Aspirant Student'}</div>
              <div className="text-[10px] text-teal-400/85 uppercase tracking-wider font-bold">NEET {profile?.targetYear || '2026'} Aspirant</div>
            </div>
          </div>
          
          <div className="bg-[#051C1B] border border-[#113C3A]/70 rounded-xl lg:rounded-2xl p-1.5 lg:p-3 flex justify-between items-center hover:border-teal-500/50 transition-all">
            <div className="w-full text-center">
              <div className="hidden lg:block text-[9px] text-teal-400/60 font-bold uppercase tracking-widest mb-0.5">Study Streak</div>
              <div className="text-[10px] lg:text-xs font-extrabold text-teal-300 flex items-center justify-center gap-1">
                🔥 {stats.streak} <span className="hidden lg:inline">{stats.streak === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>
          </div>
        </NavLink>
      </aside>

      {/* Main Content Pane - Spatial UI curved frame on desktop, edge-to-edge full-bleed on mobile */}
      <main className="flex-1 flex flex-col md:my-4 md:mr-4 ml-0 md:ml-4 bg-white dark:bg-[#0c1312] rounded-none md:rounded-3xl border-0 md:border border-slate-200/50 dark:border-[#142826] shadow-none md:shadow-lg min-h-0 overflow-hidden relative transition-colors duration-200">
        
        {/* Portal top bar - highly responsive */}
        <header className="px-4 py-3 md:px-8 md:py-5 border-b border-slate-100 dark:border-[#122422] flex items-center justify-between gap-4 shrink-0 bg-gradient-to-r from-slate-50 to-white dark:from-[#0d1615] dark:to-[#0c1312] transition-colors duration-200">
          <div className="flex-1 min-w-0">
            <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#0E4F4F] dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-teal-100/30 dark:border-teal-900/30 inline-block">
              Candidate Class-Level: {profile?.currentClass || '12th'}
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-1 flex items-center gap-1.5 truncate">
              Welcome, <span className="text-teal-650 dark:text-teal-400 font-black">{profile?.name || 'Aarez Syed'}</span>! 🩺
            </h1>
            <p className="text-[11px] md:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5 select-none">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{getHeaderDate()}</span>
            </p>
          </div>
          
          <div className="flex gap-2 items-center shrink-0">
             {/* Theme Toggle Button */}
             <button
               id="theme-toggle"
               onClick={toggleTheme}
               className="p-2 md:p-2.5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-[#1b3230] text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-[#112422] hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center shadow-sm shrink-0"
               title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
               aria-label="Toggle Theme"
             >
               {theme === 'dark' ? (
                 <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-400 animate-spin-slow" />
               ) : (
                 <Moon className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
               )}
             </button>

             <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
               <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-rose-500"></span>
               </span>
               <span>{getDaysToExam()} Days <span className="hidden sm:inline">Remaining</span></span>
             </div>

             {/* Profile avatar link on mobile so we can reach settings */}
             <NavLink 
               to="/settings"
               className="md:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 border border-white/20 flex items-center justify-center text-white font-extrabold shadow-md text-xs shrink-0 hover:scale-105 transition-all"
             >
               {profile?.name ? profile.name[0].toUpperCase() : 'S'}
             </NavLink>
          </div>
        </header>

        {/* Content scrolling glass viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FBFDFD] dark:bg-[#070e0d] min-h-0 transition-colors duration-200">
          <div className="min-h-full flex flex-col justify-between">
            <div className="flex-1">
              <Outlet />
            </div>
            
            {/* Universal Footer Branding */}
            <footer className="mt-12 pt-6 border-t border-slate-150/60 dark:border-[#142826] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 select-none shrink-0 font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-550 animate-pulse"></span>
                <span className="font-semibold text-slate-500 dark:text-slate-400">Developed by <span className="text-teal-700 dark:text-teal-400 font-bold">Aarez Syed</span></span>
              </div>
              <div className="font-medium text-slate-450 dark:text-slate-500">
                © 2026 NEET Prep. All Rights Reserved.
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Touch-optimized, Thumb-friendly, Hidden on Desktop/Tablet) */}
      <nav className="md:hidden h-16 shrink-0 bg-white dark:bg-[#0c1312] border-t border-slate-200/85 dark:border-[#142826] shadow-[0_-4px_16px_rgba(0,0,0,0.03)] flex justify-around items-center px-2 pb-safe bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0d1615] dark:to-[#0c1312]">
        {navItems.map((item) => {
          const mobileLabel = item.name === 'Performance Insights' ? 'Insights' : 
                              item.name === 'Ustad AI Doubt Solver' ? 'Ustad AI' : 
                              item.name === 'Practice Q&A' ? 'Practice' :
                              item.name === 'Mock Exams' ? 'Mocks' : item.name;
          const active = isItemActive(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={() =>
                cn(
                  "flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all relative rounded-xl",
                  active
                    ? "text-teal-600 dark:text-teal-400 font-extrabold translate-y-[-1px]"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 font-medium"
                )
              }
            >
              {() => (
                <>
                  <item.icon className={cn("w-5 h-5 transition-transform", active ? "scale-105 text-teal-600 dark:text-teal-400 font-bold" : "text-slate-400 dark:text-slate-500")} />
                  <span className="text-[9px] font-extrabold mt-1 tracking-tight leading-none truncate max-w-full">
                    {mobileLabel}
                  </span>
                  {active && (
                    <span className="absolute bottom-[-2px] w-5 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
