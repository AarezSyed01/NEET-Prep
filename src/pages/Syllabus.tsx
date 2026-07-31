import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, BookOpen, Search, CheckCircle, Percent, Award, Info, Trash2 } from 'lucide-react';

interface Topic {
  name: string;
  subtopics?: string[];
}

interface SyllabusData {
  [subject: string]: {
    category: string;
    topics: Topic[];
  }[];
}

const neetSyllabus: SyllabusData = {
  Physics: [
    {
      category: "Full Physics Syllabus",
      topics: [
        { name: "1. Physics and Measurement", subtopics: ["Units and Dimensions", "SI Units", "Errors in Measurement", "Significant Figures", "Dimensional Analysis"] },
        { name: "2. Kinematics", subtopics: ["Motion in a Straight Line", "Motion in a Plane", "Projectile Motion", "Uniform Circular Motion", "Relative Motion", "Vectors"] },
        { name: "3. Laws of Motion", subtopics: ["Newton's Laws", "Friction", "Circular Motion", "Momentum", "Conservation of Momentum"] },
        { name: "4. Work, Energy and Power", subtopics: ["Work Done", "Kinetic Energy", "Potential Energy", "Power", "Conservation of Energy", "Collisions"] },
        { name: "5. Rotational Motion", subtopics: ["Center of Mass", "Torque", "Angular Momentum", "Momentum of Inertia", "Rotational Dynamics"] },
        { name: "6. Gravitation", subtopics: ["Universal Law of Gravitation", "Acceleration Due to Gravity", "Satellites", "Escape Velocity"] },
        { name: "7. Properties of Solids and Liquids", subtopics: ["Elasticity", "Surface Tension", "Viscosity", "Fluid Mechanics"] },
        { name: "8. Thermodynamics", subtopics: ["Heat", "Temperature", "First Law of Thermodynamics", "Second Law of Thermodynamics", "Heat Engines"] },
        { name: "9. Kinetic Theory of Gases", subtopics: ["Gas Laws", "Molecular Nature of Matter", "RMS Velocity"] },
        { name: "10. Oscillations and Waves", subtopics: ["SHM", "Wave Motion", "Sound Waves", "Doppler Effect"] },
        { name: "11. Electrostatics", subtopics: ["Coulomb's Law", "Electric Field", "Electric Potential", "Capacitors"] },
        { name: "12. Current Electricity", subtopics: ["Ohm's Law", "Resistance", "Kirchhoff's Laws", "Wheatstone Bridge"] },
        { name: "13. Magnetic Effects of Current and Magnetism", subtopics: ["Biot-Savart Law", "Ampere's Law", "Magnetic Field", "Electromagnetic Induction"] },
        { name: "14. Electromagnetic Induction and Alternating Current", subtopics: ["Faraday's Laws", "Lenz's Law", "AC Circuits", "Transformers"] },
        { name: "15. Electromagnetic Waves", subtopics: ["EM Spectrum", "Properties of EM Waves"] },
        { name: "16. Optics", subtopics: ["Reflection", "Refraction", "Lenses", "Mirrors", "Wave Optics", "Interference", "Diffraction"] },
        { name: "17. Dual Nature of Matter and Radiation", subtopics: ["Photoelectric Effect", "De Broglie Hypothesis"] },
        { name: "18. Atoms and Nuclei", subtopics: ["Atomic Models", "Nuclear Structure", "Radioactivity"] },
        { name: "19. Electronic Devices", subtopics: ["Semiconductors", "Diodes", "Transistors", "Logic Gates"] }
      ]
    }
  ],
  Chemistry: [
    {
      category: "Physical Chemistry",
      topics: [
        { name: "1. Some Basic Concepts of Chemistry", subtopics: ["Mole Concept", "Atomic Mass", "Molecular Mass", "Stoichiometry"] },
        { name: "2. Structure of Atom", subtopics: ["Atomic Models", "Quantum Numbers", "Electronic Configuration"] },
        { name: "3. Classification of Elements and Periodicity", subtopics: ["Periodic Table", "Trends", "Properties"] },
        { name: "4. Chemical Bonding and Molecular Structure", subtopics: ["Ionic Bonding", "Covalent Bonding", "VSEPR Theory", "Hybridization"] },
        { name: "5. States of Matter", subtopics: ["Gases", "Liquids", "Gas Laws"] },
        { name: "6. Thermodynamics", subtopics: ["Enthalpy", "Entropy", "Gibbs Energy"] },
        { name: "7. Equilibrium", subtopics: ["Chemical Equilibrium", "Ionic Equilibrium", "Buffer Solutions"] },
        { name: "8. Redox Reactions", subtopics: ["Oxidation", "Reduction", "Balancing Reactions"] },
        { name: "9. Solutions", subtopics: ["Concentration Terms", "Colligative Properties"] },
        { name: "10. Electrochemistry", subtopics: ["Electrochemical Cells", "Nernst Equation"] },
        { name: "11. Chemical Kinetics", subtopics: ["Rate Laws", "Order of Reactions"] },
        { name: "12. Surface Chemistry", subtopics: ["Adsorption", "Catalysis", "Colloids"] }
      ]
    },
    {
      category: "Inorganic Chemistry",
      topics: [
        { name: "13. Hydrogen", subtopics: ["Properties of Hydrogen", "Isotopes", "Uses"] },
        { name: "14. s-Block Elements", subtopics: ["Alkali metals", "Alkaline earth metals"] },
        { name: "15. p-Block Elements", subtopics: ["Groups 13 to 18 elements", "Properties and compounds"] },
        { name: "16. d and f Block Elements", subtopics: ["Transition elements", "Lanthanoids and Actinoids"] },
        { name: "17. Coordination Compounds", subtopics: ["Werner's Theory", "Ligands & IUPAC", "Isomerism", "VBT & CFT"] },
        { name: "18. Metallurgy", subtopics: ["General Principles", "Processes of Isolation of Elements"] }
      ]
    },
    {
      category: "Organic Chemistry",
      topics: [
        { name: "19. Purification and Characterisation of Organic Compounds", subtopics: ["Purification methods", "Qualitative & Quantitative analysis"] },
        { name: "20. Hydrocarbons", subtopics: ["Alkanes", "Alkenes", "Alkynes", "Aromatic Hydrocarbons"] },
        { name: "21. Haloalkanes and Haloarenes", subtopics: ["Nomenclature", "Nature of C-X bond", "Substitution/Elimination mechanisms"] },
        { name: "22. Alcohols, Phenols and Ethers", subtopics: ["Nomenclature", "Methods of preparation", "Physical/Chemical properties"] },
        { name: "23. Aldehydes, Kidneys and Carboxylic Acids", subtopics: ["Chemical properties", "Nucleophilic addition", "Acidity of carboxylic acids"] },
        { name: "24. Organic Compounds Containing Nitrogen", subtopics: ["Amines", "Diazonium salts"] },
        { name: "25. Biomolecules", subtopics: ["Carbohydrates", "Proteins", "Vitamins", "Nucleic Acids"] },
        { name: "26. Polymers", subtopics: ["Classification", "Polymerization methods", "Important synthetic polymers"] },
        { name: "27. Chemistry in Everyday Life", subtopics: ["Chemicals in medicines", "Chemicals in food", "Cleansing agents"] },
        { name: "28. Principles Related to Practical Chemistry", subtopics: ["Detection of functional groups", "Inorganic/Organic preparations"] }
      ]
    }
  ],
  Biology: [
    {
      category: "Diversity in Living World",
      topics: [
        { name: "1. The Living World", subtopics: ["What is living?", "Biodiversity", "Taxonomical hierarchy"] },
        { name: "2. Biological Classification", subtopics: ["Five kingdom classification", "Monera, Protista, Fungi", "Viruses, Viroids & Lichens"] },
        { name: "3. Plant Kingdom", subtopics: ["Algae", "Bryophytes", "Pteridophytes", "Gymnosperms", "Angiosperms"] },
        { name: "4. Animal Kingdom", subtopics: ["Salient features of non-chordates", "Salient features of chordates"] }
      ]
    },
    {
      category: "Structural Organisation in Plants and Animals",
      topics: [
        { name: "5. Morphology of Flowering Plants", subtopics: ["Root, stem, leaf", "Inflorescence, flower", "Fruit and seed"] },
        { name: "6. Anatomy of Flowering Plants", subtopics: ["Tissues", "Tissue system", "Anatomy of dicot & monocot"] },
        { name: "7. Structural Organisation in Animals", subtopics: ["Animal tissues", "Organ & organ systems of insects/earthworms"] }
      ]
    },
    {
      category: "Cell Structure and Function",
      topics: [
        { name: "8. Cell: The Unit of Life", subtopics: ["Cell theory", "Prokaryotic and Eukaryotic cell", "Cell organelles structure/functions"] },
        { name: "9. Biomolecules", subtopics: ["Chemical constituents of living cells", "Structure & function of proteins, nucleic acids", "Enzymes"] },
        { name: "10. Cell Cycle and Cell Division", subtopics: ["Mitosis", "Meiosis", "Significance"] }
      ]
    },
    {
      category: "Plant Physiology",
      topics: [
        { name: "11. Transport in Plants", subtopics: ["Movement of water & nutrients", "Transpiration", "Phloem transport"] },
        { name: "12. Mineral Nutrition", subtopics: ["Essential minerals", "Nitrogen metabolism", "Toxicity"] },
        { name: "13. Photosynthesis", subtopics: ["Light reactions", "Calvin cycle (C3)", "C4 pathway", "Factors affecting"] },
        { name: "14. Respiration in Plants", subtopics: ["Glycolysis", "TCA cycle", "Electron transport system", "Amphibolic pathway"] },
        { name: "15. Plant Growth and Development", subtopics: ["Growth regulators (Auxin, Gibberellin, Cytokinin, Ethylene, ABA)", "Photoperiodism"] }
      ]
    },
    {
      category: "Human Physiology",
      topics: [
        { name: "16. Digestion and Absorption", subtopics: ["Alimentary canal", "Digestive enzymes", "Absorption and disorders"] },
        { name: "17. Breathing and Exchange of Gases", subtopics: ["Respiratory organs", "Mechanism of breathing", "Transport of gases", "Disorders"] },
        { name: "18. Body Fluids and Circulation", subtopics: ["Blood composition", "Human circulatory system", "Cardiac cycle", "ECG", "Hypertension"] },
        { name: "19. Excretory Products and Elimination", subtopics: ["Modes of excretion", "Human excretory system", "Urine formation", "Regulation", "Dialysis"] },
        { name: "20. Locomotion and Movement", subtopics: ["Types of movement", "Skeletal muscle", "Skeletal system & joints", "Disorders"] },
        { name: "21. Neural Control and Coordination", subtopics: ["Neuron", "Nervous system", "Reflex action", "Sensory perception (Eye, Ear)"] },
        { name: "22. Chemical Coordination and Integration", subtopics: ["Endocrine glands", "Hormones", "Mechanism of action", "Disorders"] }
      ]
    },
    {
      category: "Reproduction",
      topics: [
        { name: "23. Reproduction in Organisms", subtopics: ["Asexual reproduction", "Sexual reproduction"] },
        { name: "24. Sexual Reproduction in Flowering Plants", subtopics: ["Flower structure", "Pollination", "Double fertilization", "Seed & fruit development"] },
        { name: "25. Human Reproduction", subtopics: ["Male & Female reproductive systems", "Gametogenesis", "Menstrual cycle", "Pregnancy & lactation"] },
        { name: "26. Reproductive Health", subtopics: ["Contraception", "Sexually transmitted diseases (STDs)", "Assisted Reproductive Technology (ART)"] }
      ]
    },
    {
      category: "Genetics and Evolution",
      topics: [
        { name: "27. Principles of Inheritance and Variation", subtopics: ["Mendelian inheritance", "Deviations (Incomplete dominance, Co-dominance)", "Sex determination", "Genetic disorders"] },
        { name: "28. Molecular Basis of Inheritance", subtopics: ["DNA/RNA structure", "Replication", "Transcription & Translation", "Gene expression regulation", "Human Genome Project"] },
        { name: "29. Evolution", subtopics: ["Origin of life", "Theories of evolution", "Evidences of evolution", "Human evolution"] }
      ]
    },
    {
      category: "Biology and Human Welfare",
      topics: [
        { name: "30. Human Health and Disease", subtopics: ["Pathogens and parasites", "Immunology basics", "AIDS, Cancer, Drugs/Alcohol abuse"] },
        { name: "31. Microbes in Human Welfare", subtopics: ["Households & industries application", "Sewage treatment", "Biofertilizers & biocontrol"] }
      ]
    },
    {
      category: "Biotechnology",
      topics: [
        { name: "32. Biotechnology: Principles and Processes", subtopics: ["Genetic engineering", "Recombinant DNA technology"] },
        { name: "33. Biotechnology and Its Applications", subtopics: ["Medicine applications (Insulin, Gene therapy)", "Agriculture applications (Bt Cotton, transgenics)"] }
      ]
    },
    {
      category: "Ecology and Environment",
      topics: [
        { name: "34. Organisms and Populations", subtopics: ["Organism & environment", "Population interactions", "Population growth model"] },
        { name: "35. Ecosystem", subtopics: ["Structure & function", "Productivity & decomposition", "Energy flow", "Ecological pyramids"] },
        { name: "36. Biodiversity and Conservation", subtopics: ["Patterns of biodiversity", "Loss of biodiversity", "In-situ & Ex-situ conservation"] },
        { name: "37. Environmental Issues", subtopics: ["Air/Water pollution", "Solid waste management", "Ozone depletion & Greenhouse effect"] }
      ]
    }
  ]
};

export default function Syllabus() {
  const [selectedSubject, setSelectedSubject] = useState<'Physics' | 'Chemistry' | 'Biology'>('Physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Load and store completed subtopics state locally
  const [completedSubtopics, setCompletedSubtopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('neet_completed_subtopics');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('neet_completed_subtopics', JSON.stringify(completedSubtopics));
  }, [completedSubtopics]);

  const toggleSubtopic = (key: string) => {
    setCompletedSubtopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearAllProgress = () => {
    if (!showConfirmReset) {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 4000);
    } else {
      setCompletedSubtopics({});
      setShowConfirmReset(false);
    }
  };

  // Extract all subtopics for a topic to see progress
  const getProgressForTopic = (subtopics: string[], topicName: string) => {
    const total = subtopics.length;
    if (total === 0) return 0;
    const completed = subtopics.filter(sub => completedSubtopics[`${topicName}-${sub}`]).length;
    return Math.round((completed / total) * 100);
  };

  // Calculate subject progress
  const getSubjectProgress = (subject: 'Physics' | 'Chemistry' | 'Biology') => {
    let totalSubtopics = 0;
    let completedCount = 0;

    neetSyllabus[subject].forEach(group => {
      group.topics.forEach(t => {
        if (t.subtopics) {
          t.subtopics.forEach(sub => {
            totalSubtopics++;
            if (completedSubtopics[`${t.name}-${sub}`]) {
              completedCount++;
            }
          });
        }
      });
    });

    return totalSubtopics === 0 ? 0 : Math.round((completedCount / totalSubtopics) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-5 sm:space-y-8 pb-12 font-sans"
    >
      
      {/* Header Info Banner - Premium Clinical Style */}
      <div className="bg-gradient-to-br from-teal-700 via-[#105F5C] to-[#0A4441] text-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-md border border-teal-800">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner shrink-0 hidden sm:block">
              <BookOpen className="w-8 h-8 text-teal-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Interactive NEET Syllabus Guide</h1>
              <p className="text-teal-100/90 text-sm font-medium mt-1">Official NCERT-mapped curriculum benchmarks and tracker tool.</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
             <button
               onClick={clearAllProgress}
               className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                 showConfirmReset
                   ? 'bg-rose-600 hover:bg-rose-700 border-rose-500 text-white'
                   : 'bg-[#042423]/40 hover:bg-rose-900/40 border-teal-500/30 hover:border-rose-500/30 text-teal-100'
               }`}
             >
               <Trash2 className="w-4 h-4" /> {showConfirmReset ? '⚠️ Click to Confirm Reset?' : 'Reset Learning Progress'}
             </button>
          </div>
        </div>
      </div>

      {/* Grid Layout - Navigation Tabs & Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Quick Progress Bar and Exam Pattern Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm space-y-4 sm:space-y-5">
             <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Subject Masteries</h2>
             
             {/* Physics */}
             <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Physics Masteries</span>
                  <span className="text-teal-600 font-extrabold">{getSubjectProgress('Physics')}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50">
                  <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${getSubjectProgress('Physics')}%` }}></div>
                </div>
             </div>

             {/* Chemistry */}
             <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Chemistry Masteries</span>
                  <span className="text-teal-600 font-extrabold">{getSubjectProgress('Chemistry')}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50">
                  <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${getSubjectProgress('Chemistry')}%` }}></div>
                </div>
             </div>

             {/* Biology */}
             <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Biology Masteries</span>
                  <span className="text-teal-600 font-extrabold">{getSubjectProgress('Biology')}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50">
                  <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${getSubjectProgress('Biology')}%` }}></div>
                </div>
             </div>
          </div>

          {/* Exam Pattern Widget */}
          <div className="bg-[#092B2A] text-white p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-sm space-y-3 sm:space-y-4 border border-[#113C3A]">
             <div className="flex items-center gap-2 border-b border-[#12423F] pb-3.5">
               <Award className="w-4.5 h-4.5 text-teal-300" />
               <h3 className="font-extrabold text-xs uppercase tracking-wider text-teal-300">Official Exam Weightage</h3>
             </div>
             
             <div className="space-y-3 text-xs font-bold text-slate-200">
                <div className="flex justify-between border-b border-[#12423F]/50 pb-2">
                  <span className="text-slate-400">⚡ Physics Panel:</span>
                  <span>45 MCQs (180 Marks)</span>
                </div>
                <div className="flex justify-between border-b border-[#12423F]/50 pb-2">
                  <span className="text-slate-400">🧪 Chemistry Panel:</span>
                  <span>45 MCQs (180 Marks)</span>
                </div>
                <div className="flex justify-between border-b border-[#12423F]/50 pb-2">
                  <span className="text-slate-400">🧬 Biology Panel:</span>
                  <span>90 MCQs (360 Marks)</span>
                </div>
                <div className="flex justify-between border-b border-[#12423F]/50 pb-2">
                  <span className="text-slate-400">📃 Total Items:</span>
                  <span className="text-teal-300 font-mono">180 Questions</span>
                </div>
                <div className="flex justify-between border-b border-[#12423F]/50 pb-2">
                  <span className="text-slate-400">🏆 Assessment Scale:</span>
                  <span className="text-emerald-400">720 Marks (+4 / -1)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">⏰ Timing Bracket:</span>
                  <span className="text-amber-400">200 Minutes</span>
                </div>
             </div>

             <div className="mt-4 p-4 bg-[#051C1B] rounded-2xl flex gap-3 border border-[#113C3A] text-slate-300 text-[11px] leading-relaxed">
                 <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                 <p>
                   Maintain rigorous NCERT study loops. Core conceptual formulations carry supreme weight in medical admission rankings.
                 </p>
             </div>
          </div>
        </div>

        {/* Right column: Interactive Syllabus Explorer */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Controls Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Subject Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-100 p-1 rounded-2xl">
              {(['Physics', 'Chemistry', 'Biology'] as const).map(subj => (
                <motion.button
                  key={subj}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={() => {
                    setSelectedSubject(subj);
                    setOpenTopic(null);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all ${
                    selectedSubject === subj 
                    ? 'bg-[#092B2A] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {subj}
                </motion.button>
              ))}
            </div>

            {/* Quick search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search unit concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none placeholder-slate-400"
              />
            </div>
          </div>

          {/* List of Syllabus Categories / Chapters */}
          <div className="space-y-4">
            {neetSyllabus[selectedSubject].map((categoryObj) => {
              // Filter topics according to search query
              const filteredTopics = categoryObj.topics.filter(t => 
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                t.subtopics?.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
              );

              if (filteredTopics.length === 0) return null;

              return (
                <div key={categoryObj.category} className="space-y-3 mr-0.5">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-1.5 mt-2">
                    {categoryObj.category}
                  </h3>

                  <div className="space-y-2">
                    {filteredTopics.map((topic) => {
                      const isOpen = openTopic === topic.name;
                      const topicProgress = getProgressForTopic(topic.subtopics || [], topic.name);

                      return (
                        <div key={topic.name} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-sm transition-all">
                          {/* Accordion header */}
                          <div 
                            className="p-4.5 flex justify-between items-center cursor-pointer hover:bg-slate-50/50"
                            onClick={() => setOpenTopic(isOpen ? null : topic.name)}
                          >
                            <div className="flex-1 pr-4">
                              <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                {topic.name}
                              </h4>
                              {/* Sparkline style progress indicators */}
                              <div className="flex items-center gap-3 mt-1.5">
                                <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                                  <div className="bg-teal-500 h-full" style={{ width: `${topicProgress}%` }}></div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                                   {topicProgress}% Complete ({topic.subtopics?.filter(s => completedSubtopics[`${topic.name}-${s}`]).length} of {topic.subtopics?.length} subtopics)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {topicProgress === 100 && (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                              )}
                              <div className="bg-slate-50 border border-slate-100 p-1 rounded-lg">
                                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                              </div>
                            </div>
                          </div>

                          {/* Collapsed topics details */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-100 bg-slate-50/30"
                              >
                                <div className="p-4 md:p-5 space-y-3">
                                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#0E4F4F]">Course Subchapters Checklist</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {topic.subtopics?.map((sub) => {
                                      const key = `${topic.name}-${sub}`;
                                      const isDone = !!completedSubtopics[key];

                                      return (
                                        <button
                                          key={sub}
                                          onClick={() => toggleSubtopic(key)}
                                          className={`flex items-center justify-between text-left p-3.5 rounded-xl border transition-all text-xs font-bold leading-normal ${
                                            isDone 
                                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 shadow-sm' 
                                            : 'bg-white border-slate-150/70 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                          }`}
                                        >
                                          <span>{sub}</span>
                                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                            isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                                          }`}>
                                            {isDone && <CheckCircle className="w-4 h-4" />}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </motion.div>
  );
}
