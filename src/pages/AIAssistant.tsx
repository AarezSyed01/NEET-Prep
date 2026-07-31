import React from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, Code, ArrowLeft } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-sans flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-slate-900 text-white rounded-3xl p-8 md:p-14 border border-slate-800 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Ambient background glows */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-xl mx-auto">
          {/* Pulsing Launching Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-800 text-teal-300 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Launching Soon
          </div>

          {/* Icon Header */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg text-slate-950">
            <Brain className="w-9 h-9 text-slate-950" />
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Ustad AI <span className="text-teal-400">Doubt Solver</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
              An advanced, high-yield medical LLM trained specifically on the NCERT syllabus is currently being calibrated and optimized for NEET aspirants.
            </p>
          </div>

          {/* Developer Dedicated Area */}
          <div className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-teal-950/60 rounded-xl border border-teal-900 text-teal-400">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-teal-400">Development Status</p>
                <p className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                  Developer <span className="text-teal-300 font-extrabold">Aarez Syed</span> is actively working on calibrating, training, and perfecting this module.
                </p>
              </div>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-350 tracking-wider uppercase transition-colors pt-4 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
