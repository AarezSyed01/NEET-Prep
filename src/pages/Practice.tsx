import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Check, X, ArrowRight, BrainCircuit, BookType, Award, BarChart2, Loader2, Sparkles, Bookmark, Search, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useStore } from '../store/useStore';
import { getQuestionsForChapter, chaptersBySubject, mockQuestions } from '../data/mockQuestions';
import { Subject, Question } from '../types';

// Helper to shuffle any array using the Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper to shuffle a question's options and update correctOptionIndex accordingly
function shuffleQuestionOptions(q: Question): Question {
  const originalCorrectOption = q.options[q.correctOptionIndex];
  
  const shuffledOptions = [...q.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);
  
  return {
    ...q,
    options: shuffledOptions,
    correctOptionIndex: newCorrectIndex >= 0 ? newCorrectIndex : q.correctOptionIndex
  };
}

export default function Practice() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleAskUstad = (q: any) => {
    if (!q) return;
    const prompt = `Can you explain this NEET Prep question to me in detail using NCERT guidelines?

Subject: ${q.subject}
Chapter: ${q.chapter}

Question text: 
"${q.text}"

Options:
A) ${q.options[0]}
B) ${q.options[1]}
C) ${q.options[2]}
D) ${q.options[3]}

NCERT Core Explanation: 
"${q.explanation}"`;

    sessionStorage.setItem("ai_prompt", prompt);
    sessionStorage.setItem("ai_prompt_role", q.subject?.toLowerCase() === "physics" ? "physics" : q.subject?.toLowerCase() === "chemistry" ? "chemistry" : "biology");
    navigate('/ai-assistant');
  };

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Real-time session stats tracking for premium practice feel
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Bookmarks management states
  const initialTab = searchParams.get('tab') === 'bookmarks' ? 'bookmarks' : 'practice';
  const [activeTab, setActiveTab] = useState<'practice' | 'bookmarks'>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'bookmarks') {
      setActiveTab('bookmarks');
    } else {
      setActiveTab('practice');
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<'All' | Subject>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const { recordAnswer, recordStudyTime, bookmarks, addBookmark, removeBookmark } = useStore();

  const startPractice = async () => {
    if (!selectedSubject || !selectedChapter) return;
    setIsGenerating(true);

    let finalSessionQs: Question[] = [];

    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: selectedSubject, chapter: selectedChapter })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          finalSessionQs = data.questions;
        }
      }
    } catch (e) {
      console.warn("AI Question Generation failed, using offline fallback:", e);
    }

    // Fallback block if API fails or lacks keys
    if (!finalSessionQs || finalSessionQs.length === 0) {
      const questions = getQuestionsForChapter(selectedSubject, selectedChapter);
      
      const uniqueQuestions: Question[] = [];
      const seenTexts = new Set<string>();
      
      // Shuffle the parent list to sample variations
      const shuffledPool = shuffleArray(questions);
      
      for (const q of shuffledPool) {
        const cleanText = q.text.replace(/^Q\d+:\s*/, '');
        const normText = cleanText.replace(/\b\d+(\.\d+)?\b/g, '#').trim();
        if (!seenTexts.has(normText)) {
          seenTexts.add(normText);
          
          uniqueQuestions.push({
            ...q,
            text: cleanText
          });
        }
        if (uniqueQuestions.length >= 15) {
          break;
        }
      }
      
      finalSessionQs = uniqueQuestions.length > 0 ? uniqueQuestions : shuffleArray(questions).slice(0, 15).map(q => ({
        ...q,
        text: q.text.replace(/^Q\d+:\s*/, '')
      }));
    }

    // Ensure all questions are shuffled, and their options are also randomized dynamically
    const reshuffledQs = shuffleArray(finalSessionQs).map(shuffleQuestionOptions);
    setActiveSession(reshuffledQs);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCorrectCount(0);
    setWrongCount(0);
    setIsGenerating(false);
    recordStudyTime(5); // Roughly log 5 mins when starting a session
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple answers
    const currentQ = activeSession![currentIndex];
    setSelectedOption(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQ.correctOptionIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
    recordAnswer(currentQ.subject, currentQ.chapter, isCorrect);
  };

  const nextQuestion = () => {
    if (!activeSession) return;
    if (currentIndex < activeSession.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setActiveSession(null);
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-md flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Generating NEET Practice Set</h2>
            <p className="text-sm font-semibold text-teal-600 mt-1 uppercase tracking-wider font-mono">Exam Engine Loading...</p>
            <p className="text-sm mt-3 text-slate-500 font-medium leading-relaxed max-w-sm">
              Our AI is curating a customized set of 12 NCERT-aligned multiple choice questions on <span className="font-bold text-slate-700">"{selectedChapter}"</span>. Please do not close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeSession) {
    if (activeSession.length === 0) {
       return (
         <div className="max-w-3xl mx-auto py-8">
           <div className="bg-white border text-center p-12 rounded-3xl shadow-sm border-slate-200">
             <h2 className="text-xl font-bold text-slate-800 mb-2">No questions available</h2>
             <p className="text-slate-500 font-medium mb-6">We're updating our database for {selectedChapter}. Check back soon!</p>
             <button onClick={() => setActiveSession(null)} className="px-6 py-2 bg-teal-650 text-white font-semibold rounded-lg hover:bg-teal-700 transition">Go Back</button>
           </div>
         </div>
       );
    }
    const q = activeSession[currentIndex];
    const isCorrect = selectedOption === q.correctOptionIndex;
    const percentProgress = Math.round(((currentIndex + 1) / activeSession.length) * 100);

    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        {/* Real-time Session Tracker Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-md border border-teal-100">{q.subject}</span>
            <span>/</span>
            <span className="text-slate-750 max-w-xs truncate">{q.chapter}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
              ✓ {correctCount} Correct
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
              ✗ {wrongCount} Wrong
            </span>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 font-mono">
              Q: {currentIndex + 1} / {activeSession.length}
            </div>
          </div>
        </div>

        {/* Progress horizontal line */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50 shadow-inner">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300" style={{ width: `${percentProgress}%` }}></div>
        </div>

        <motion.div 
          key={q.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200/80 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm flex flex-col relative overflow-hidden"
        >
          {/* Difficulty & PYQ badge bar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {q.isPreviousYear && (
                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200/60 text-amber-800 text-[10px] uppercase tracking-wider font-extrabold rounded-lg">
                  NEET PYQ
                </span>
              )}
              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-lg border ${
                q.difficulty === 'Easy' ? 'bg-green-50 border-green-200/60 text-green-700' :
                q.difficulty === 'Medium' ? 'bg-orange-50 border-orange-200/60 text-orange-700' :
                'bg-rose-50 border-rose-200/60 text-rose-700'
              }`}>
                {q.difficulty} Level
              </span>
            </div>

            <button
              id={`bookmark-btn-${q.id}`}
              onClick={() => {
                const isBookmarked = bookmarks.some(b => b.questionId === q.id);
                if (isBookmarked) {
                  removeBookmark(q.id);
                } else {
                  addBookmark(q);
                }
              }}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                bookmarks.some(b => b.questionId === q.id)
                  ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-955/40 dark:border-amber-800 dark:text-amber-400'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:bg-slate-800/60'
              }`}
              title={bookmarks.some(b => b.questionId === q.id) ? "Remove Bookmark" : "Bookmark Question"}
            >
              <Bookmark className="w-4 h-4" fill={bookmarks.some(b => b.questionId === q.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {q.isPreviousYear && (
            <div className="mb-5 p-3.5 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-400">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-bounce" />
                <span>NEET {q.year || 'Official'} Previous Year Question</span>
              </span>
              <span className="uppercase text-[9px] tracking-widest text-amber-650 dark:text-amber-400/80 font-black px-2 py-0.5 bg-amber-500/10 rounded-md">
                Official PYQ
              </span>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
              {q.text}
            </h3>
          </div>

          {/* Improved Option Selection with Letter Badges */}
          <div className="space-y-3.5">
            {q.options.map((opt, idx) => {
              const letters = ['A', 'B', 'C', 'D'];
              let btnClass = "border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 text-slate-700 bg-white";
              let badgeClass = "bg-slate-100 text-slate-500 border-slate-200";
              let Icon = null;

              if (selectedOption !== null) {
                if (idx === q.correctOptionIndex) {
                  btnClass = "bg-emerald-50/80 border-emerald-500 text-emerald-990 shadow-sm";
                  badgeClass = "bg-emerald-500 text-white border-emerald-600";
                  Icon = Check;
                } else if (idx === selectedOption) {
                  btnClass = "bg-rose-50 border-rose-500 text-rose-990 shadow-sm";
                  badgeClass = "bg-rose-500 text-white border-rose-600";
                  Icon = X;
                } else {
                  btnClass = "border-slate-100 opacity-40 bg-slate-50";
                  badgeClass = "bg-slate-100 text-slate-300 border-slate-200";
                }
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  whileHover={selectedOption === null ? { scale: 1.01, x: 2 } : {}}
                  whileTap={selectedOption === null ? { scale: 0.995 } : {}}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className={`w-full flex items-center p-3 sm:p-4 border-2 rounded-xl sm:rounded-2xl text-left transition-all leading-normal ${btnClass}`}
                >
                  {/* Letter designator badge */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border flex items-center justify-center font-extrabold text-xs sm:text-sm mr-3 sm:mr-4 shrink-0 transition-colors ${badgeClass}`}>
                    {letters[idx]}
                  </div>
                  
                  <span className="font-bold text-base flex-1">{opt}</span>
                  {Icon && <Icon className="w-5 h-5 ml-2 shrink-0" />}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation layout */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-8 pt-6 border-t border-slate-100"
              >
                <div className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                  <h4 className="font-extrabold mb-1 flex items-center text-slate-800 text-sm uppercase tracking-wide">
                    <BrainCircuit className={`w-5 h-5 mr-2 ${isCorrect ? 'text-emerald-600' : 'text-teal-600'}`} />
                    Detailed Core Explanation
                  </h4>
                  <p className="text-slate-600 text-sm font-semibold leading-relaxed">{q.explanation}</p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={() => handleAskUstad(q)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-[#092B2A] hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-indigo-500/20 font-bold rounded-xl transition cursor-pointer"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-teal-600" />
                    Ask Ustad AI Tutor
                  </button>

                  <button 
                    onClick={nextQuestion}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-[0_4px_14px_0_rgba(13,148,136,0.35)] transform hover:-translate-y-0.5"
                  >
                    {currentIndex < activeSession.length - 1 ? 'Next Question' : 'Finish Session'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-12 font-sans"
    >
      {/* Intro Header */}
      <div className="md:flex md:items-center md:justify-between gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">Adaptive Practice Sets</h1>
           <p className="text-sm font-medium text-slate-500 mt-1">Select any curriculum unit to practice NEET preparation test pools.</p>
        </div>

        {/* Return button when viewing bookmarks directly */}
        {activeTab === 'bookmarks' && (
          <button
            onClick={() => {
              setActiveTab('practice');
              setSearchParams({ tab: 'practice' });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-400 cursor-pointer shadow-sm mt-4 md:mt-0 transition-all border border-slate-200/30 dark:border-slate-700"
          >
            &larr; Back to Practice Sets
          </button>
        )}
      </div>

      {activeTab === 'practice' ? (
        <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl flex flex-col shadow-sm overflow-hidden dark:bg-slate-900/40 dark:border-slate-800">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#F8FAF9] dark:bg-slate-900/60 dark:border-slate-800 flex justify-between items-center font-bold">
            <h2 className="text-slate-800 dark:text-slate-200 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
              <BookType className="w-4.5 h-4.5 text-teal-600" />
              Launch Practice Session
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 bg-white dark:bg-transparent">
            {/* Step 1: Subject Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">1. Select Subject</label>
              <div className="space-y-2.5 sm:space-y-3.5">
                {(['Physics', 'Chemistry', 'Biology'] as Subject[]).map((subj) => (
                  <motion.button
                    key={subj}
                    whileHover={{ scale: 1.015, x: 2 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onClick={() => {
                      setSelectedSubject(subj);
                      setSelectedChapter(null);
                    }}
                    className={`w-full p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      selectedSubject === subj 
                        ? 'bg-teal-50/80 border-teal-500 text-teal-900 shadow-sm font-extrabold dark:bg-teal-950/20 dark:border-teal-500 dark:text-teal-400' 
                        : 'border-slate-100 bg-slate-50/40 text-slate-600 hover:border-slate-300 hover:bg-white font-bold dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base">{subj}</span>
                      <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg font-bold uppercase tracking-wider ${selectedSubject === subj ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {chaptersBySubject[subj].length} Chapters
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Step 2: Chapter Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">2. Select Chapter</label>
              {selectedSubject ? (
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  {chaptersBySubject[selectedSubject].map((ch) => (
                    <motion.button
                      key={ch}
                      whileHover={{ scale: 1.01, x: 1 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 420, damping: 25 }}
                      onClick={() => setSelectedChapter(ch)}
                      className={`w-full p-3 sm:p-3.5 rounded-xl border-2 text-xs sm:text-sm text-left transition-all cursor-pointer ${
                        selectedChapter === ch
                          ? 'bg-teal-50/80 border-teal-500 text-teal-900 shadow-sm font-extrabold dark:bg-teal-950/20 dark:border-teal-500 dark:text-teal-400' 
                          : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-white hover:border-slate-300 font-bold dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                         <span className="truncate flex-1 font-bold">{ch}</span>
                         <div className="flex items-center gap-1.5 shrink-0">
                           <span className="text-[8px] sm:text-[9px] text-teal-600 border border-teal-100 font-extrabold uppercase py-0.5 px-1.5 sm:px-2 bg-teal-50 rounded-full shrink-0 dark:border-teal-900/30 dark:bg-teal-950/40 dark:text-teal-400">500+ Qs</span>
                         </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[220px] sm:min-h-[320px] flex flex-col items-center justify-center p-4 sm:p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-[#FAFBFB] dark:bg-slate-900/20">
                  <span className="text-slate-400 text-xs font-bold w-11/12 sm:w-2/3 text-center leading-relaxed">
                    Select a candidate subject on left to view custom test banks.
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase text-teal-600 font-extrabold tracking-widest mt-3 bg-teal-50 border border-teal-100 px-3 py-1 rounded-md dark:border-teal-900/30 dark:bg-teal-950/40 dark:text-teal-400">Step 1 Required</span>
                </div>
              )}
            </div>
          </div>

          {/* Practice Banner action footer */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              disabled={!selectedSubject || !selectedChapter}
              onClick={startPractice}
              className="w-full sm:w-auto flex items-center justify-center px-10 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl sm:rounded-2xl transition shadow-[0_4px_14px_0_rgba(13,148,136,0.35)] transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 mr-2 shrink-0" fill="currentColor" />
              Begin Practice Unit
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Bookmarked Questions Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl flex flex-col shadow-sm overflow-hidden dark:bg-slate-900/40 dark:border-slate-800">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-[#F8FAF9] dark:bg-slate-900/60 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center font-bold">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500" fill="currentColor" />
                <h2 className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                  Bookmarked Questions ({bookmarks.length})
                </h2>
              </div>

              {/* Subject quick filters */}
              {bookmarks.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setFilterSubject(subj)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer shrink-0 ${
                        filterSubject === subj
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarks Search & list content */}
            {bookmarks.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900 flex items-center justify-center">
                  <Bookmark className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No bookmarked questions yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    When practicing new sets, click the bookmark icon at the top of any question to save it for revision.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-5 py-2.5 bg-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-teal-700 transition cursor-pointer"
                >
                  Explore Practice Sets
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by keyword, subject, or chapter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:border-teal-500 focus:outline-none text-xs sm:text-sm font-semibold transition-all shadow-inner"
                  />
                </div>

                {/* Filter and display bookmarked list */}
                {(() => {
                  const filtered = bookmarks
                    .map(b => {
                      if (b.question) return b.question;
                      return mockQuestions.find(mq => mq.id === b.questionId);
                    })
                    .filter(Boolean)
                    .filter((q) => {
                      if (!q) return false;
                      const matchesSubject = filterSubject === 'All' || q.subject === filterSubject;
                      const matchesSearch =
                        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.subject.toLowerCase().includes(searchQuery.toLowerCase());
                      return matchesSubject && matchesSearch;
                    }) as Question[];

                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                        No bookmarked questions found matching your criteria.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filtered.map((q) => {
                        const isExpanded = expandedQuestionId === q.id;
                        return (
                          <div
                            key={q.id}
                            className="bg-slate-50/40 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-200"
                          >
                            {/* Card Header row */}
                            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-150/50 dark:border-slate-800/50">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                  {q.subject}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">
                                  {q.chapter}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold rounded-lg border ${
                                  q.difficulty === 'Easy' ? 'bg-green-50 border-green-200/60 text-green-700 dark:bg-green-955/20 dark:border-green-900' :
                                  q.difficulty === 'Medium' ? 'bg-orange-50 border-orange-200/60 text-orange-700 dark:bg-orange-955/20 dark:border-orange-900' :
                                  'bg-rose-50 border-rose-200/60 text-rose-700 dark:bg-rose-955/20 dark:border-rose-900'
                                }`}>
                                  {q.difficulty}
                                </span>
                                <button
                                  onClick={() => removeBookmark(q.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg border border-transparent hover:border-rose-100 dark:hover:border-rose-900 transition-all cursor-pointer flex items-center justify-center"
                                  title="Unbookmark Question"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Question display */}
                            <div className="p-4 sm:p-5 space-y-4">
                              <p className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                                {q.text}
                              </p>

                              {/* Action buttons */}
                              <div className="flex justify-between items-center pt-2 gap-3 flex-wrap">
                                <button
                                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                                  className="text-xs font-extrabold uppercase tracking-wide text-teal-650 dark:text-teal-400 hover:text-teal-700 hover:underline cursor-pointer"
                                >
                                  {isExpanded ? 'Hide Details' : 'Show Details & Answer'}
                                </button>

                                <button
                                  onClick={() => handleAskUstad(q)}
                                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-[#092B2A] dark:text-teal-300 hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-indigo-500/20 font-bold text-xs rounded-xl transition cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                                  Ask Ustad AI Tutor
                                </button>
                              </div>

                              {/* Expandable Details Area */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 border-t border-slate-150 dark:border-slate-800/60 space-y-4 overflow-hidden"
                                  >
                                    {/* Options list */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {q.options.map((opt, idx) => {
                                        const letters = ['A', 'B', 'C', 'D'];
                                        const isCorrect = idx === q.correctOptionIndex;
                                        return (
                                          <div
                                            key={idx}
                                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs sm:text-sm ${
                                              isCorrect
                                                ? 'bg-emerald-50/80 border-emerald-500 text-emerald-990 shadow-sm dark:bg-emerald-950/20 dark:border-emerald-800'
                                                : 'bg-white border-slate-200 dark:bg-slate-900/40 dark:border-slate-850 text-slate-700 dark:text-slate-300'
                                            }`}
                                          >
                                            <span className={`w-6 h-6 rounded-lg border text-center flex items-center justify-center font-bold shrink-0 ${
                                              isCorrect
                                                ? 'bg-emerald-500 text-white border-emerald-600'
                                                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-450 dark:border-slate-700'
                                            }`}>
                                              {letters[idx]}
                                            </span>
                                            <span className={isCorrect ? 'font-bold' : ''}>{opt}</span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Rationale explanation card */}
                                    <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-50/20 dark:bg-teal-950/10 space-y-2.5">
                                      <h4 className="font-extrabold flex items-center text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">
                                        <BrainCircuit className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
                                        Detailed Core Explanation
                                      </h4>
                                      <p className="text-slate-650 dark:text-slate-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                        {q.explanation}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
