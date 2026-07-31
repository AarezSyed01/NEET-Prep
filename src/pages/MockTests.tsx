import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Award, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Layers, 
  CheckSquare, 
  Square,
  Bookmark,
  TrendingUp,
  AwardIcon,
  HelpCircle,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useStore } from '../store/useStore';
import { chaptersBySubject, getQuestionsForChapter } from '../data/mockQuestions';
import { Subject, Question } from '../types';

interface PresetTest {
  id: string;
  title: string;
  type: string;
  durationMins: number;
  questionsCount: number;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  presetChapters: string[];
  subjects: Subject[];
}

const presetMockTests: PresetTest[] = [
  {
    id: 'neet-full-syllabus-exam',
    title: 'NEET Full Syllabus Mock Test',
    type: 'Full Syllabus',
    durationMins: 200,
    questionsCount: 180,
    marks: 720,
    difficulty: 'Medium',
    presetChapters: [...chaptersBySubject.Physics, ...chaptersBySubject.Chemistry, ...chaptersBySubject.Biology],
    subjects: ['Physics', 'Chemistry', 'Biology']
  },
  { 
    id: 'p1', 
    title: 'NEET Complete Full Syllabus Mock Test', 
    type: 'Full Syllabus', 
    durationMins: 45, 
    questionsCount: 20, 
    marks: 80, 
    difficulty: 'Medium',
    presetChapters: [...chaptersBySubject.Physics, ...chaptersBySubject.Chemistry, ...chaptersBySubject.Biology],
    subjects: ['Physics', 'Chemistry', 'Biology']
  },
  { 
    id: 'p2', 
    title: 'NCERT High-Yield Core Biology Test', 
    type: 'Subject Mock', 
    durationMins: 20, 
    questionsCount: 15, 
    marks: 60, 
    difficulty: 'Easy',
    presetChapters: chaptersBySubject.Biology,
    subjects: ['Biology']
  },
  { 
    id: 'p3', 
    title: 'Class 11 Part Test - Phy & Chem', 
    type: 'Part Syllabus', 
    durationMins: 30, 
    questionsCount: 15, 
    marks: 60, 
    difficulty: 'Medium',
    presetChapters: [
      'Physics and Measurement', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power', 'Rotational Motion', 
      'Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity', 'Chemical Bonding and Molecular Structure'
    ],
    subjects: ['Physics', 'Chemistry']
  },
  { 
    id: 'p4', 
    title: 'High-Velocity PYQ High-Yield Simulator', 
    type: 'PYQ Style', 
    durationMins: 15, 
    questionsCount: 10, 
    marks: 40, 
    difficulty: 'Hard',
    presetChapters: ['Kinematics', 'Electrostatics', 'Chemical Kinetics', 'Solutions', 'Cell: The Unit of Life', 'Principles of Inheritance and Variation'],
    subjects: ['Physics', 'Chemistry', 'Biology']
  },
];

// Helper to check if a chapter is standard Class 11
const class11Chapters = [
  // Physics 11
  'Physics and Measurement', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power', 'Rotational Motion', 'Gravitation', 'Properties of Solids and Liquids', 'Thermodynamics', 'Kinetic Theory of Gases', 'Oscillations and Waves',
  // Chemistry 11
  'Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity', 'Chemical Bonding and Molecular Structure', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Hydrogen', 's-Block Elements', 'Purification and Characterisation of Organic Compounds', 'Hydrocarbons',
  // Biology 11
  'The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals', 'Cell: The Unit of Life', 'Cell Cycle and Cell Division', 'Transport in Plants', 'Mineral Nutrition', 'Photosynthesis', 'Respiration in Plants', 'Plant Growth and Development', 'Digestion and Absorption', 'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and Elimination', 'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration'
];

export default function MockTests() {
  const navigate = useNavigate();

  const handleAskUstad = (q: any) => {
    if (!q) return;
    const prompt = `Can you explain this NEET Mock Test question to me in detail using NCERT guidelines?

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

  const { recordAnswer, recordStudyTime, stats } = useStore();
  
  // Tabs: 'custom', 'preset', or 'pyq'
  const [activeTab, setActiveTab] = useState<'custom' | 'preset' | 'pyq'>('custom');
  
  // Custom builder states
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [customQuestionsCount, setCustomQuestionsCount] = useState<number>(20);
  const [customDuration, setCustomDuration] = useState<number>(30); // in minutes
  const [customDifficulty, setCustomDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [customTitle, setCustomTitle] = useState<string>('Custom NEET Mock Test');

  // PYQ builder states
  const [selectedPYQYear, setSelectedPYQYear] = useState<number>(2024);
  const [selectedPYQSubjects, setSelectedPYQSubjects] = useState<Subject[]>(['Physics', 'Chemistry', 'Biology']);
  const [pyqQuestionsCount, setPyqQuestionsCount] = useState<number>(20);
  const [pyqDuration, setPyqDuration] = useState<number>(30); // in minutes

  // Interactive accordions for Custom Builder list
  const [openedSubject, setOpenedSubject] = useState<Subject | null>('Biology');

  // Test session state
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedTestTitle, setSelectedTestTitle] = useState<string>('');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // questionIndex -> selectedOptionIndex
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({}); // flag status
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testDurationMinsSpent, setTestDurationMinsSpent] = useState(0);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Auto-fill custom select configs
  const handleSelectFullSyllabus = () => {
    const all = [
      ...chaptersBySubject.Physics,
      ...chaptersBySubject.Chemistry,
      ...chaptersBySubject.Biology
    ];
    setSelectedChapters(all);
    setCustomTitle('NEET Full Syllabus Mock Test');
  };

  const handleSelectClass11 = () => {
    setSelectedChapters(class11Chapters);
    setCustomTitle('NEET Class 11 Complete Mock Test');
  };

  const handleSelectClass12 = () => {
    const all = [
      ...chaptersBySubject.Physics,
      ...chaptersBySubject.Chemistry,
      ...chaptersBySubject.Biology
    ];
    const class12Only = all.filter(ch => !class11Chapters.includes(ch));
    setSelectedChapters(class12Only);
    setCustomTitle('NEET Class 12 Complete Mock Test');
  };

  const handleClearSelections = () => {
    setSelectedChapters([]);
    setCustomTitle('Custom NEET Mock Test');
  };

  const handleToggleChapter = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter) 
        : [...prev, chapter]
    );
  };

  const handleToggleSubjectAll = (sub: Subject) => {
    const subjectsChs = chaptersBySubject[sub];
    const alreadySelectedInSub = selectedChapters.filter(c => subjectsChs.includes(c));
    
    if (alreadySelectedInSub.length === subjectsChs.length) {
      // Remove all
      setSelectedChapters(prev => prev.filter(c => !subjectsChs.includes(c)));
    } else {
      // Add all
      setSelectedChapters(prev => {
        const unique = new Set([...prev, ...subjectsChs]);
        return Array.from(unique);
      });
    }
  };

  // Build the exam session questions list
  const handleLaunchMock = (title: string, count: number, mins: number, chapters: string[]) => {
    if (chapters.length === 0) {
      alert("🚨 Dynamic Error: Please select at least one topic/chapter before starting the exam.");
      return;
    }

    // Gathers questions from selected chapters
    const poolBySubject: Record<Subject, Question[]> = {
      Physics: [],
      Chemistry: [],
      Biology: []
    };
    
    chapters.forEach(ch => {
      // Find matches across subjects
      let sub: Subject = 'Biology';
      if (chaptersBySubject.Physics.includes(ch)) sub = 'Physics';
      else if (chaptersBySubject.Chemistry.includes(ch)) sub = 'Chemistry';
      
      const chQuestions = getQuestionsForChapter(sub, ch);
      
      // Shuffle first to get random variation
      const shuffledCh = [...chQuestions].sort(() => Math.random() - 0.5);
      
      // Select unique templates
      const uniqueChQuestions: Question[] = [];
      const seenTexts = new Set<string>();
      
      for (const q of shuffledCh) {
        // Clean Q###: from formatting and normalize values to find unique template
        const cleanText = q.text.replace(/^Q\d+:\s*/, '');
        const normText = cleanText.replace(/\b\d+(\.\d+)?\b/g, '#').trim();
        if (!seenTexts.has(normText)) {
          seenTexts.add(normText);
          uniqueChQuestions.push({
            ...q,
            text: cleanText
          });
        }
      }
      
      // Fallback: if we don't have enough strictly unique text templates, append others
      if (uniqueChQuestions.length < 15) {
        for (const q of shuffledCh) {
          if (!uniqueChQuestions.some(existing => existing.id === q.id)) {
            uniqueChQuestions.push({
              ...q,
              text: q.text.replace(/^Q\d+:\s*/, '')
            });
          }
        }
      }
      
      // Give each chapter some capacity based on overall request size
      const sliceLimit = Math.max(5, Math.ceil(count / chapters.length) + 3);
      poolBySubject[sub].push(...uniqueChQuestions.slice(0, sliceLimit));
    });

    // Grouping by target subject to make sure the exam is segmented professionally
    const phyQs = [...poolBySubject.Physics].sort(() => Math.random() - 0.5);
    const chemQs = [...poolBySubject.Chemistry].sort(() => Math.random() - 0.5);
    const bioQs = [...poolBySubject.Biology].sort(() => Math.random() - 0.5);
    
    let finalSelected: Question[] = [];
    const totalAvailable = phyQs.length + chemQs.length + bioQs.length;
    
    if (totalAvailable > 0) {
      if (count === 180 && chapters.length > 50) {
        // Strict NCERT/NEET ratio for standard 180 questions exam
        const pLimit = 45;
        const cLimit = 45;
        const bLimit = 90;
        finalSelected = [
          ...phyQs.slice(0, pLimit),
          ...chemQs.slice(0, cLimit),
          ...bioQs.slice(0, bLimit)
        ];
      } else {
        // Proportional distribution based on loaded pool size for custom exam
        const pRatio = phyQs.length / totalAvailable;
        const cRatio = chemQs.length / totalAvailable;
        const bRatio = bioQs.length / totalAvailable;
        
        let pLimit = Math.round(count * pRatio);
        let cLimit = Math.round(count * cRatio);
        let bLimit = count - pLimit - cLimit;
        
        // Ensure bounds
        if (pLimit > phyQs.length) {
          const diff = pLimit - phyQs.length;
          pLimit = phyQs.length;
          bLimit += diff;
        }
        if (cLimit > chemQs.length) {
          const diff = cLimit - chemQs.length;
          cLimit = chemQs.length;
          bLimit += diff;
        }
        if (bLimit > bioQs.length) {
          const diff = bLimit - bioQs.length;
          bLimit = bioQs.length;
          pLimit += diff;
        }
        
        finalSelected = [
          ...phyQs.slice(0, pLimit),
          ...chemQs.slice(0, cLimit),
          ...bioQs.slice(0, bLimit)
        ];
      }
    }

    // Double-check final select count is exact, otherwise fill from any remaining
    if (finalSelected.length < count) {
      const allShuffled = [...phyQs, ...chemQs, ...bioQs].sort(() => Math.random() - 0.5);
      for (const q of allShuffled) {
        if (!finalSelected.some(existing => existing.id === q.id)) {
          finalSelected.push({
            ...q,
            text: q.text.replace(/^Q\d+:\s*/, '')
          });
        }
        if (finalSelected.length === count) {
          break;
        }
      }
    }
    
    // Sort standard NEET-style subject order: Physics -> Chemistry -> Biology
    finalSelected.sort((a, b) => {
      const subjectOrder = { 'Physics': 0, 'Chemistry': 1, 'Biology': 2 };
      return subjectOrder[a.subject] - subjectOrder[b.subject];
    });

    if (finalSelected.length === 0) {
      alert("🚨 We couldn't fetch questions for the selected range. Please retry or choose other topics.");
      return;
    }

    setSelectedTestTitle(title);
    setTestQuestions(finalSelected);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(mins * 60);
    setTestDurationMinsSpent(mins);
    setIsTestActive(true);
    setShowResults(false);
  };

  // Handle Preset Launcher
  const handleLaunchPreset = (preset: PresetTest) => {
    handleLaunchMock(preset.title, preset.questionsCount, preset.durationMins, preset.presetChapters);
    setSelectedTestId(preset.id);
  };

  // Launch Custom Configuration
  const handleLaunchCustomTest = () => {
    if (selectedChapters.length === 0) {
      alert("⚠️ Selection Required: Please choose at least one study module or check the 'Full Syllabus' option.");
      return;
    }
    const derivedTitle = customTitle.trim() || `Custom Chapter-Wise Mock Test (${selectedChapters.length} topics)`;
    handleLaunchMock(derivedTitle, customQuestionsCount, customDuration, selectedChapters);
    setSelectedTestId('custom-composed');
  };

  // Launch Year-Wise PYQ Simulator
  const handleLaunchPYQ = (year: number, selectedSubjects: Subject[], count: number, mins: number) => {
    if (selectedSubjects.length === 0) {
      alert("⚠️ Selection Required: Please choose at least one subject for the PYQ Paper.");
      return;
    }

    // Collect all chapters for selected subjects
    const chapters: string[] = [];
    selectedSubjects.forEach(sub => {
      chapters.push(...chaptersBySubject[sub]);
    });

    const matchingPool: Question[] = [];

    // Fetch questions from all of these chapters
    chapters.forEach(ch => {
      let sub: Subject = 'Biology';
      if (chaptersBySubject.Physics.includes(ch)) sub = 'Physics';
      else if (chaptersBySubject.Chemistry.includes(ch)) sub = 'Chemistry';
      
      const chQuestions = getQuestionsForChapter(sub, ch);
      
      // Filter for previous year questions matching this exact year
      chQuestions.forEach(q => {
        if (q.isPreviousYear && q.year === year) {
          matchingPool.push(q);
        }
      });
    });

    // If the pool is empty or too small, fill it up by adjusting the year filter 
    // or generating high-quality on-topic questions labeled for that year
    let finalSelected = [...matchingPool].sort(() => Math.random() - 0.5);

    if (finalSelected.length < count) {
      // Pull in any PYQs from other years as well as fallback
      chapters.forEach(ch => {
        let sub: Subject = 'Biology';
        if (chaptersBySubject.Physics.includes(ch)) sub = 'Physics';
        else if (chaptersBySubject.Chemistry.includes(ch)) sub = 'Chemistry';
        
        const chQuestions = getQuestionsForChapter(sub, ch);
        chQuestions.forEach(q => {
          if (q.isPreviousYear && q.year !== year && !finalSelected.some(existing => existing.text === q.text)) {
            finalSelected.push({
              ...q,
              year: year // label it for this simulated paper
            });
          }
        });
      });
    }

    // Shuffle and slice to the requested count
    finalSelected = finalSelected.sort(() => Math.random() - 0.5).slice(0, count);

    // Sort standard NEET-style subject order: Physics -> Chemistry -> Biology
    finalSelected.sort((a, b) => {
      const subjectOrder = { 'Physics': 0, 'Chemistry': 1, 'Biology': 2 };
      return subjectOrder[a.subject] - subjectOrder[b.subject];
    });

    if (finalSelected.length === 0) {
      alert("🚨 We couldn't fetch PYQ questions for the selected range. Please retry or choose other parameters.");
      return;
    }

    setSelectedTestTitle(`NEET ${year} Official PYQ Paper (${selectedSubjects.join(' & ')})`);
    setTestQuestions(finalSelected);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(mins * 60);
    setTestDurationMinsSpent(mins);
    setIsTestActive(true);
    setShowResults(false);
    setSelectedTestId(`pyq-${year}`);
  };

  // Timed count-down controller
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTestActive(false);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, secondsRemaining]);

  // Scoring calculator (NEET +4 / -1 rules)
  const computeFinalMetrics = () => {
    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const subjectBreakdown: Record<Subject, { correct: number; incorrect: number; total: number }> = {
      Physics: { correct: 0, incorrect: 0, total: 0 },
      Chemistry: { correct: 0, incorrect: 0, total: 0 },
      Biology: { correct: 0, incorrect: 0, total: 0 }
    };

    testQuestions.forEach((q, idx) => {
      subjectBreakdown[q.subject].total++;
      const ans = userAnswers[idx];
      if (ans === undefined) {
        skippedCount++;
      } else if (ans === q.correctOptionIndex) {
        correctCount++;
        totalScore += 4;
        subjectBreakdown[q.subject].correct++;
      } else {
        incorrectCount++;
        totalScore -= 1;
        subjectBreakdown[q.subject].incorrect++;
      }
    });

    return { totalScore, correctCount, incorrectCount, skippedCount, subjectBreakdown };
  };

  const handleFinishTestSession = () => {
    setIsTestActive(false);
    setShowResults(true);

    // Save outputs dynamically inside Student store statistics
    testQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected !== undefined) {
        const isCorect = selected === q.correctOptionIndex;
        recordAnswer(q.subject, q.chapter, isCorect);
      }
    });
    recordStudyTime(testDurationMinsSpent);
  };

  const { totalScore, correctCount, incorrectCount, skippedCount, subjectBreakdown } = computeFinalMetrics();
  const maxPossibleMarks = testQuestions.length * 4;

  const formatSecs = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-5 sm:space-y-7 pb-16 font-sans"
    >
      
      {/* 1. HERO PREAMBLE CONTAINER */}
      {!isTestActive && !showResults && (
        <div className="bg-[#092B2A] text-white rounded-3xl p-6 md:p-8 border border-teal-800 shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-teal-500/20">
                Official Exam Simulator
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">NEET Chapter & Full Syllabus Simulator</h1>
              <p className="text-teal-100/70 text-xs md:text-sm font-medium leading-relaxed">
                Take timed conceptual tests with standard +4 / -1 medical grading metrics. Composed dynamically of highly curated interactive questions mapped directly to latest NCERT blueprints.
              </p>
            </div>

          </div>

          {/* Core Mode Selection Interface */}
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 mt-8 w-fit shrink-0 overflow-x-auto max-w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => setActiveTab('custom')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-2 shrink-0 ${
                activeTab === 'custom' 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" /> Custom Topic Builder
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => setActiveTab('preset')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-2 shrink-0 ${
                activeTab === 'preset' 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Preset Full Papers
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => setActiveTab('pyq')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-2 shrink-0 ${
                activeTab === 'pyq' 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" /> Year-Wise PYQs
            </motion.button>
          </div>
        </div>
      )}

      {/* 2. MAIN CONFIGURATOR VIEWPORTS */}
      {!isTestActive && !showResults && (
        <AnimatePresence mode="wait">
          {activeTab === 'custom' ? (
            <motion.div
              key="custom-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* LEFT COLUMN: BUILDER SETTINGS CARD */}
              <div className="lg:col-span-1 bg-white border border-slate-200/50 rounded-3xl p-6.5 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-teal-650" /> Test Settings
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Fine-tune the simulation parameters</p>
                  </div>

                  {/* Input test title */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Test Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g., Biology Human Physiology Test"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 font-bold text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Syllabus Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSelectFullSyllabus}
                        type="button"
                        className="py-2 px-3 border border-teal-100 bg-teal-50/10 hover:bg-teal-550/10 hover:border-teal-400 transition rounded-xl text-[10px] font-black uppercase text-[#0E4F4F]"
                      >
                        🧬 Full Syllabus
                      </button>
                      <button
                        onClick={handleSelectClass11}
                        type="button"
                        className="py-2 px-3 border border-slate-200 hover:border-slate-350 transition rounded-xl text-[10px] font-black uppercase text-slate-600"
                      >
                        🎒 Class 11th NCERT
                      </button>
                      <button
                        onClick={handleSelectClass12}
                        type="button"
                        className="py-2 px-3 border border-slate-200 hover:border-slate-350 transition rounded-xl text-[10px] font-black uppercase text-slate-600"
                      >
                        🎓 Class 12th NCERT
                      </button>
                      <button
                        onClick={handleClearSelections}
                        type="button"
                        className="py-2 px-3 border border-rose-100 bg-rose-50/10 hover:bg-rose-550/10 hover:border-rose-350 transition rounded-xl text-[10px] font-black uppercase text-rose-700"
                      >
                        🧹 Clear All
                      </button>
                    </div>
                  </div>

                  {/* Range selectors */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions Count</label>
                    <div className="grid grid-cols-5 gap-1">
                      {[10, 20, 45, 90, 180].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setCustomQuestionsCount(num);
                            // Adjust appropriate timing default
                            if (num === 10) setCustomDuration(15);
                            if (num === 20) setCustomDuration(30);
                            if (num === 45) setCustomDuration(60);
                            if (num === 90) setCustomDuration(120);
                            if (num === 180) setCustomDuration(200);
                          }}
                          className={`py-2 text-[10px] sm:text-xs font-black uppercase rounded-lg border-2 transition-all ${
                            customQuestionsCount === num
                              ? 'bg-teal-600 border-teal-600 text-white font-black shadow-sm'
                              : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          {num} Qs
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Selectors */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Duration</label>
                    <div className="grid grid-cols-5 gap-1">
                      {[15, 30, 60, 120, 200].map((min) => (
                        <button
                          key={min}
                          type="button"
                          onClick={() => setCustomDuration(min)}
                          className={`py-2 text-[10px] sm:text-xs font-black uppercase rounded-lg border-2 transition-all ${
                            customDuration === min
                              ? 'bg-teal-600 border-teal-600 text-white font-black shadow-sm'
                              : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          {min} Min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty selector */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulation Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setCustomDifficulty(diff as any)}
                          className={`py-2 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${
                            customDifficulty === diff
                              ? 'bg-teal-600 border-teal-600 text-white font-black shadow-sm'
                              : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamic Summary Launcher Box */}
                <div className="pt-6 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl space-y-4">
                  <div className="text-xs font-bold text-slate-600 leading-relaxed">
                    🌟 Ready to build: <strong className="text-slate-800">{customQuestionsCount} questions</strong> randomly drawn from the{' '} 
                    <strong className="text-teal-600">{selectedChapters.length} selected chapters</strong>. Target score is {' '}
                    <strong className="text-teal-600">{customQuestionsCount * 4} Marks</strong> in <strong className="text-slate-800">{customDuration} minutes</strong>.
                  </div>
                  <button
                    onClick={handleLaunchCustomTest}
                    disabled={selectedChapters.length === 0}
                    className="w-full bg-teal-650 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none hover:bg-teal-700 text-white py-3.5 font-bold uppercase tracking-widest text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(13,148,136,0.25)]"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start Custom Simulation
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: CHAPTERS & TOPICS EXPANSE MAP (Colspan 2) */}
              <div className="lg:col-span-2 bg-white border border-slate-200/50 rounded-3xl p-6.5 shadow-sm space-y-6">
                <div className="flex md:items-center justify-between flex-col md:flex-row gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-4.5 h-4.5 text-teal-600" /> Syllabus Topic Selection
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Choose custom chapters or modules to drill</p>
                  </div>
                  <span className="text-[11px] font-black text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl self-start">
                     {selectedChapters.length} Chapters Engaged
                  </span>
                </div>

                {/* Accordions for Subjects */}
                <div className="space-y-4">
                  {(['Biology', 'Chemistry', 'Physics'] as Subject[]).map((subj) => {
                    const isOpened = openedSubject === subj;
                    const chs = chaptersBySubject[subj];
                    const selectedCount = selectedChapters.filter(c => chs.includes(c)).length;

                    return (
                      <div key={subj} className="border border-slate-150 rounded-2xl overflow-hidden transition-all shadow-sm">
                        <div
                          onClick={() => setOpenedSubject(isOpened ? null : subj)}
                          className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100/70 select-none flex items-center justify-between transition-colors border-b border-slate-150/50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {subj === 'Biology' ? '🧬' : subj === 'Chemistry' ? '🧪' : '⚡'}
                            </span>
                            <div>
                              <span className="font-extrabold text-slate-800 text-sm tracking-tight capitalize">{subj}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase ml-2">({chs.length} Chapters Available)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSubjectAll(subj);
                              }}
                              className="text-[10px] font-black uppercase text-teal-600 hover:text-teal-700"
                            >
                              {selectedCount === chs.length ? '🧹 Unselect All' : '✅ Select All'}
                            </button>
                            {isOpened ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {isOpened && (
                          <div className="p-5 bg-white max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar">
                            {chs.map((chapter) => {
                              const isChecked = selectedChapters.includes(chapter);
                              return (
                                <button
                                  key={chapter}
                                  onClick={() => handleToggleChapter(chapter)}
                                  className={`p-3 text-left border rounded-xl flex items-start gap-3 transition-all ${
                                    isChecked 
                                      ? 'border-teal-500 bg-teal-50/20 text-[#092B2A]' 
                                      : 'border-slate-150 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div className="mt-0.5 shrink-0">
                                    {isChecked ? (
                                      <div className="w-4 h-4 bg-teal-650 text-white rounded-md flex items-center justify-center">
                                        <Check className="w-3 H-3 stroke-[3]" />
                                      </div>
                                    ) : (
                                      <div className="w-4 h-4 border border-slate-300 rounded-md" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs font-bold leading-tight">{chapter}</div>
                                    <div className="text-[8px] text-slate-450 uppercase tracking-wider font-extrabold mt-1">
                                      {class11Chapters.includes(chapter) ? 'Class 11 Series' : 'Class 12 Series'}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          ) : activeTab === 'preset' ? (
            // PRESET PAPERS GALLERY
            <motion.div
              key="preset-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {presetMockTests.map((test) => (
                <div 
                  key={test.id}
                  onClick={() => handleLaunchPreset(test)}
                  className="bg-white border-2 border-slate-200/60 rounded-3xl flex flex-col overflow-hidden hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
                     <div>
                       <span className="text-[10px] font-bold tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-md mb-3 inline-block">
                         {test.type}
                       </span>
                       <h3 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-teal-600 transition-colors leading-relaxed">
                         {test.title}
                       </h3>
                     </div>
                  </div>
                  
                  <div className="p-5 bg-slate-50/50 flex-1 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-slate-400" />
                           <div>
                              <div className="text-[9px] font-bold uppercase text-slate-400">Duration</div>
                              <div className="text-xs font-black text-slate-700">{test.durationMins} Mins</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <FileText className="w-4 h-4 text-slate-400" />
                           <div>
                              <div className="text-[9px] font-bold uppercase text-slate-400">Questions</div>
                              <div className="text-xs font-black text-slate-700">{test.questionsCount} Qs</div>
                           </div>
                        </div>
                     </div>
                     <div className="pt-3 border-t border-slate-150 flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-400">Scale Potential</span>
                        <span className="text-slate-750 font-mono text-teal-600">{test.marks} Marks</span>
                     </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            // YEAR-WISE PYQ BUILDER TAB
            <motion.div
              key="pyq-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* LEFT & CENTER PANEL: BUILDER CONFIG */}
              <div className="lg:col-span-2 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/50">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150">
                      NEET Previous Year Questions (PYQs)
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                      Simulate official previous year papers with authentic year-wise sorting
                    </p>
                  </div>
                </div>

                {/* Step 1: Select Year */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                    1. Choose Examination Year
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setSelectedPYQYear(yr)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer relative group overflow-hidden ${
                          selectedPYQYear === yr
                            ? 'bg-amber-50/50 border-amber-500 text-amber-950 shadow-sm font-black'
                            : 'border-slate-100 bg-slate-50/20 hover:border-slate-300 hover:bg-white text-slate-600 font-bold'
                        }`}
                      >
                        {selectedPYQYear === yr && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                            Active
                          </div>
                        )}
                        <span className="text-lg tracking-tight block">NEET {yr}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Official Paper</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select Subject Focus */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                    2. Filter by Subjects
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(['Physics', 'Chemistry', 'Biology'] as Subject[]).map((subj) => {
                      const isSelected = selectedPYQSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPYQSubjects(selectedPYQSubjects.filter(s => s !== subj));
                            } else {
                              setSelectedPYQSubjects([...selectedPYQSubjects, subj]);
                            }
                          }}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all cursor-pointer text-xs sm:text-sm font-bold ${
                            isSelected
                              ? 'bg-teal-50/50 border-teal-500 text-teal-950 shadow-sm'
                              : 'border-slate-100 bg-slate-50/20 hover:border-slate-300 hover:bg-white text-slate-500'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{subj}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Exam Length & Timer Config */}
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                    3. Select Test Size & Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { count: 15, duration: 20, label: 'Sprint', desc: 'Quick recap' },
                      { count: 30, duration: 40, label: 'Standard', desc: 'Topic run' },
                      { count: 45, duration: 60, label: 'Marathon', desc: 'Subject review' },
                      { count: 90, duration: 120, label: 'Full Paper', desc: 'Board simulation' }
                    ].map((cfg) => (
                      <button
                        key={cfg.count}
                        type="button"
                        onClick={() => {
                          setPyqQuestionsCount(cfg.count);
                          setPyqDuration(cfg.duration);
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          pyqQuestionsCount === cfg.count
                            ? 'bg-teal-50/40 border-teal-500 text-teal-900 shadow-sm font-black'
                            : 'border-slate-100 bg-slate-50/20 hover:border-slate-300 hover:bg-white text-slate-500'
                        }`}
                      >
                        <div className="text-base font-black text-slate-800">{cfg.count} Qs</div>
                        <div className="text-[10px] font-bold text-teal-650 mt-1">{cfg.duration} Mins</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase mt-2">{cfg.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Launch Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleLaunchPYQ(selectedPYQYear, selectedPYQSubjects, pyqQuestionsCount, pyqDuration)}
                    className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest rounded-2xl transition shadow-[0_4px_14px_0_rgba(13,148,136,0.35)] transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Play className="w-4.5 h-4.5 mr-2 shrink-0" fill="currentColor" />
                    Begin NEET {selectedPYQYear} PYQ Paper
                  </button>
                </div>
              </div>

              {/* RIGHT PANEL: STATISTICS & REASSURANCES */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/60 border border-amber-900 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5" /> High-Yield Prep
                    </div>
                    <h4 className="text-base font-black tracking-tight text-white">Why Solve PYQs Year-Wise?</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Simulating actual previous papers under strict time restrictions trains your cognitive pacing and stabilizes exam-day performance.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-black text-slate-200">Balanced Weightage</h5>
                        <p className="text-[11px] text-slate-450 leading-relaxed font-medium mt-0.5">
                          Questions are mapped evenly across the medical syllabus to recreate the exact blueprint complexity.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-black text-slate-200">Authentic Difficulty</h5>
                        <p className="text-[11px] text-slate-450 leading-relaxed font-medium mt-0.5">
                          Maintains original mathematical parameters and conceptual rigor from previous CBSE/NTA databases.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-black text-slate-200">Exhaustive Explanations</h5>
                        <p className="text-[11px] text-slate-450 leading-relaxed font-medium mt-0.5">
                          Every question provides NCERT reference notes, diagrams, and systematic step-by-step solutions upon completion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score stats quick info */}
                <div className="bg-[#FAFBFB] dark:bg-slate-900/45 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 text-center space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grading Scale</div>
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800 dark:text-slate-100">+4 / -1</span>
                    <span className="text-xs font-bold text-slate-450 uppercase">Marking</span>
                  </div>
                  <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
                    Maintains strict negative marking parameters to accurately estimate your NEET score and All-India Rank potential.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 3. ACTIVE SIMULATOR TEST INTERFACE */}
      {isTestActive && testQuestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT CONTAINER: CURRENT ACTIVE QUESTION UNIT */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Stat Ribbon */}
            <div className="bg-[#092B2A] text-white p-5 rounded-2xl border border-teal-850 flex items-center justify-between shadow-md">
               <div className="flex items-center gap-2">
                 <span className="bg-teal-500/10 border border-white/10 text-teal-300 px-3 py-1 text-xs font-black uppercase tracking-wide rounded-lg">
                    {testQuestions[currentQuestionIndex].subject}
                 </span>
                 <span className="hidden sm:inline text-teal-100/50 text-[10px] font-bold uppercase truncate max-w-xs px-2 select-none border-l border-white/10">
                    Chapter: {testQuestions[currentQuestionIndex].chapter}
                 </span>
               </div>
               
               {/* Clock counter */}
               <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-rose-500/20 border border-rose-500/30 text-rose-350 px-4 py-1.5 rounded-xl font-mono text-sm font-black flex items-center gap-2">
                     <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
                     <span>{formatSecs(secondsRemaining)} Remaining</span>
                  </div>
               </div>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
               <div 
                 className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
                 style={{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }}
               />
            </div>

            {/* Core Paper Question Box */}
            <div className="bg-white border border-slate-200/60 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm space-y-6">
               <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-teal-900/20 gap-3 flex-wrap sm:flex-nowrap">
                 <span className="text-sm font-extrabold text-teal-650 bg-teal-50 border border-teal-100 shrink-0 px-3 py-1 rounded-lg flex items-center justify-center">
                    Question {currentQuestionIndex + 1}
                 </span>
                 
                 <button
                   onClick={() => {
                     setFlaggedQuestions(prev => ({
                       ...prev,
                       [currentQuestionIndex]: !prev[currentQuestionIndex]
                     }));
                   }}
                   className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wide px-3 ${
                     flaggedQuestions[currentQuestionIndex]
                       ? 'bg-amber-50 border-amber-300 text-amber-600'
                       : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                   }`}
                   title="Flag question for review later"
                 >
                   <Bookmark className="w-4 h-4 fill-current" />
                   <span className="hidden sm:inline">
                     {flaggedQuestions[currentQuestionIndex] ? 'Flagged' : 'Save Unit'}
                   </span>
                 </button>
               </div>

               <div className="flex gap-3">
                 <h3 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-wrap flex-1">
                   {testQuestions[currentQuestionIndex].text}
                 </h3>
               </div>

               {/* Multiple option blocks */}
               <div className="space-y-3.5 pt-4">
                 {testQuestions[currentQuestionIndex].options.map((optionText, oIndex) => {
                   const isSelected = userAnswers[currentQuestionIndex] === oIndex;
                   const letters = ['A', 'B', 'C', 'D'];

                   return (
                     <button
                       key={oIndex}
                       onClick={() => {
                         setUserAnswers(prev => ({
                           ...prev,
                           [currentQuestionIndex]: oIndex
                         }));
                       }}
                       className={`w-full p-4 border-2 rounded-2xl text-left transition-all flex items-center leading-normal ${
                         isSelected 
                           ? 'bg-teal-50 border-teal-500 text-[#072524] shadow-sm font-extrabold' 
                           : 'border-slate-200/80 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                       }`}
                     >
                       <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-sm mr-4 shrink-0 transition-all ${
                         isSelected ? 'bg-teal-650 border-teal-700 text-white shadow-inner' : 'bg-slate-100 text-slate-500 border-slate-200'
                       }`}>
                         {letters[oIndex]}
                       </div>
                       <span className="text-sm font-semibold flex-1 text-slate-750">{optionText}</span>
                     </button>
                   );
                 })}
               </div>
            </div>

            {/* Simulation controls bottom bar */}
            <div className="flex items-center justify-between">
               <button
                 onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                 disabled={currentQuestionIndex === 0}
                 className="px-5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-black uppercase text-slate-500 transition flex items-center gap-2"
               >
                 <ChevronLeft className="w-4 h-4" /> Previous Unit
               </button>
               
               {currentQuestionIndex === testQuestions.length - 1 ? (
                 <button
                   onClick={handleFinishTestSession}
                   className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-md flex items-center gap-2"
                 >
                   <CheckCircle2 className="w-4 h-4" /> Finish Test & Submit
                 </button>
               ) : (
                 <button
                   onClick={() => setCurrentQuestionIndex(prev => Math.min(testQuestions.length - 1, prev + 1))}
                   className="px-6 py-3 bg-[#092B2A] text-teal-350 hover:bg-[#061d1c] text-xs font-black uppercase tracking-widest rounded-xl transition flex items-center gap-1.5 shadow-sm"
                 >
                   Save & Next <ChevronRight className="w-4 h-4" />
                 </button>
               )}
            </div>
          </div>

          {/* RIGHT CONTAINER: ATTEMPT STATUS GRID PORTAL */}
          <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
             <div>
                <h3 className="font-black text-slate-700 uppercase text-xs tracking-wider">Attempt Portal</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{testQuestions.length} Total Assessment Units</p>
             </div>

             <div className="grid grid-cols-5 gap-2.5">
               {testQuestions.map((_, index) => {
                 const isAnswered = userAnswers[index] !== undefined;
                 const isActive = currentQuestionIndex === index;
                 const isFlagged = flaggedQuestions[index];

                 let btnCls = "border-slate-200 text-slate-500 hover:bg-slate-50";
                 if (isActive) {
                   btnCls = "border-teal-600 bg-teal-50/20 text-teal-700 ring-2 ring-teal-50 font-black";
                 } else if (isFlagged) {
                   btnCls = "bg-amber-400 border-amber-400 text-white font-black";
                 } else if (isAnswered) {
                   btnCls = "bg-teal-600 border-teal-600 text-white font-black";
                 }

                 return (
                   <button
                     key={index}
                     onClick={() => setCurrentQuestionIndex(index)}
                     className={`w-10 h-10 rounded-xl font-black font-mono text-xs border-2 transition-all flex items-center justify-center relative ${btnCls}`}
                   >
                     {index + 1}
                     {isFlagged && !isActive && (
                       <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-white rounded-full" />
                     )}
                   </button>
                 );
               })}
             </div>

             <div className="space-y-2.5 pt-4 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                <div className="flex items-center gap-2">
                   <div className="w-3.5 h-3.5 bg-teal-600 rounded-md"></div>
                   <span>Answered ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3.5 h-3.5 bg-amber-400 rounded-md"></div>
                   <span>Flagged for Review ({Object.keys(flaggedQuestions).filter(k => flaggedQuestions[Number(k)]).length})</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3.5 h-3.5 bg-white border-2 border-slate-200 rounded-md"></div>
                   <span>Skipped / Unvisited ({testQuestions.length - Object.keys(userAnswers).length})</span>
                </div>
             </div>

             <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (!showDiscardConfirm) {
                      setShowDiscardConfirm(true);
                      setTimeout(() => setShowDiscardConfirm(false), 4000);
                      return;
                    }
                    if (true) {
                      setIsTestActive(false);
                      setSelectedTestId(null);
                    }
                  }}
                  className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
                    showDiscardConfirm
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md font-extrabold'
                      : 'bg-slate-50 text-[#931515] hover:bg-rose-50'
                  }`}
                >
                  {showDiscardConfirm ? '⚠️ Click to Confirm Discard?' : 'Exit Early & Discard'}
                </button>
             </div>
          </div>

        </div>
      )}

      {/* 4. SHOW COMPREHENSIVE SCORECARD REPORT SHEET */}
      {showResults && (
        <div className="max-w-4xl mx-auto space-y-8">
           
           {/* Diagnostics Header Frame */}
           <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
              <div className="text-center pb-6 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-100">
                  Performance diagnostics scorecard
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-3">{selectedTestTitle}</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5">Official NTA NEET assessment guidelines active</p>
              </div>

              {/* Grid block metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-slate-100 text-center font-bold">
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Final Total Score</div>
                    <div className="text-2.5xl font-black text-teal-600">{totalScore} <span className="text-slate-400 text-xs font-normal">/ {maxPossibleMarks}</span></div>
                    <div className="text-[9px] text-[#0E4F4F] font-black uppercase tracking-wider mt-1">{Math.max(0, Math.round((totalScore / maxPossibleMarks) * 100))}% Score Rating</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Correct Answers</div>
                    <div className="text-2.5xl font-black text-emerald-600">{correctCount} <span className="text-slate-400 text-xs font-normal">Qs</span></div>
                    <div className="text-[9px] text-emerald-650 font-black uppercase tracking-wider mt-1">+{correctCount * 4} Marks Scale Gain</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Incorrect Answers</div>
                    <div className="text-2.5xl font-black text-rose-500">{incorrectCount} <span className="text-slate-400 text-xs font-normal">Qs</span></div>
                    <div className="text-[9px] text-rose-600 font-bold uppercase tracking-widest mt-1">-{incorrectCount} Marks negative penalty</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Skipped Items</div>
                    <div className="text-2.5xl font-black text-slate-500">{skippedCount} <span className="text-slate-400 text-xs font-normal">Qs</span></div>
                    <div className="text-[9px] text-slate-450 font-black uppercase tracking-widest mt-1">0 Delta scale impact</div>
                 </div>
              </div>

               {/* Subject progress bar performance */}
               <div className="py-6 border-b border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Subject Accuracy Diagnostics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
                     {(Object.keys(subjectBreakdown) as Subject[]).map((subj) => {
                       const metrics = subjectBreakdown[subj];
                       if (metrics.total === 0) return null;
                       const accuracy = Math.round((metrics.correct / metrics.total) * 100) || 0;
                       
                       return (
                         <div key={subj} className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{subj} Performance</div>
                            <div className="text-sm font-black text-slate-750 flex justify-between items-baseline">
                              <span>{accuracy}% Success</span>
                              <span className="text-xs font-bold text-slate-500">({metrics.correct}/{metrics.total} Qs)</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                               <div 
                                 className={`h-full ${accuracy >= 75 ? 'bg-emerald-500' : accuracy >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                 style={{ width: `${accuracy}%` }}
                               />
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>

               {/* Advisor Recommendation Container */}
               <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-4 items-start">
                     <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-teal-650 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                       <AwardIcon className="w-6 h-6 text-teal-600" />
                     </div>
                     <div>
                        <h4 className="font-extrabold text-sm text-slate-800 leading-snug">
                           {totalScore >= (maxPossibleMarks * 0.75) 
                             ? 'Top Medical Seat Tier score!' 
                             : totalScore >= (maxPossibleMarks * 0.45)
                               ? 'Competitive range, reduce negative markings'
                               : 'Conceptual revision loop required'}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 max-w-xl leading-relaxed">
                           {totalScore >= (maxPossibleMarks * 0.75) 
                             ? 'Outstanding accuracy rating. Practice multi-concept custom tests to optimize pacing.' 
                             : 'Focus extensively on resolving marked incorrect questions through NCERT revisions to target negative errors.'}
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                     <button 
                       onClick={() => {
                         setSelectedTestId(null);
                         setIsTestActive(false);
                         setShowResults(false);
                       }}
                       className="px-5 py-3 border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-xl transition"
                     >
                       Test Gateways
                     </button>
                     <button 
                       onClick={() => {
                         // Retake same test configurations
                         if (selectedTestId === 'custom-composed') {
                           handleLaunchCustomTest();
                         } else {
                           const found = presetMockTests.find(t => t.id === selectedTestId);
                           if (found) handleLaunchPreset(found);
                           else handleLaunchCustomTest();
                         }
                       }}
                       className="px-6 py-3 bg-[#092B2A] text-teal-350 hover:bg-[#061d1c] text-xs font-black uppercase tracking-widest rounded-xl transition flex items-center gap-2"
                     >
                       <RefreshCw className="w-3.5 h-3.5" /> Retake Sim
                     </button>
                  </div>
               </div>
            </div>

            {/* Answer Solutions review sheet */}
            <div className="space-y-5">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                 <HelpCircle className="w-4.5 h-4.5 text-slate-400" /> NCERT Concept Review Sheet
               </h3>
               
               {testQuestions.map((q, idx) => {
                 const isSelected = userAnswers[idx];
                 const isCorrect = isSelected === q.correctOptionIndex;
                 const isSkipped = isSelected === undefined;

                 return (
                   <div key={q.id || idx} className="bg-white border border-slate-200/65 rounded-3xl overflow-hidden p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Question {idx+1}</span>
                            <span className="text-[9px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-extrabold uppercase text-slate-400">{q.subject}</span>
                            <span className="hidden sm:inline text-[9px] text-slate-400 font-semibold truncate max-w-xs">{q.chapter}</span>
                         </div>
                         {isSkipped ? (
                           <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">Skipped</span>
                         ) : isCorrect ? (
                           <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-5 border border-emerald-105 px-2.5 py-1 rounded-md">✓ Correct +4</span>
                         ) : (
                           <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md">✗ Incorrect -1</span>
                         )}
                      </div>

                      <h4 className="font-extrabold text-slate-800 text-sm leading-relaxed">{q.text}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs font-bold">
                         {q.options.map((opt, oIdx) => {
                           const isPicked = isSelected === oIdx;
                           const isRealAns = q.correctOptionIndex === oIdx;

                           let cls = "border-slate-150 text-slate-500 bg-white";
                           if (isRealAns) {
                             cls = "bg-emerald-50 border-emerald-400 text-emerald-800 font-extrabold";
                           } else if (isPicked) {
                             cls = "bg-rose-50 border-rose-400 text-rose-800 font-extrabold";
                           }

                           return (
                             <div key={oIdx} className={`p-3.5 border-2 rounded-xl flex items-center justify-between ${cls}`}>
                                <span>{opt}</span>
                                {isRealAns && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                             </div>
                           );
                         })}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-xs font-medium space-y-2">
                         <div className="flex justify-between items-center border-b border-slate-200/50 pb-1.5">
                            <span className="font-extrabold uppercase text-[#0d4f4d] tracking-widest text-[9px]">NCERT Diagnostics loop:</span>
                            <button
                              onClick={() => handleAskUstad(q)}
                              className="flex items-center gap-1 bg-white hover:bg-teal-50 border border-teal-100/50 hover:border-teal-200 px-2 py-0.5 rounded text-[10px] font-bold text-teal-850 cursor-pointer transition-all"
                            >
                               <Sparkles className="w-3 h-3 text-teal-600 animate-pulse" /> Ask Ustad AI
                            </button>
                         </div>
                         <p className="text-slate-500 font-semibold leading-relaxed pt-0.5">{q.explanation}</p>
                      </div>
                   </div>
                 );
               })}
            </div>

         </div>
      )}

    </motion.div>
  );
}
