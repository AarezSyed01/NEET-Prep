import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dynamic sitemap.xml route (generates correct schema based on current hostname)
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "neetprep-ai.web.app";
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const base = `${protocol}://${host}`;
    
    res.header("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>${base}/practice</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${base}/mock-tests</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${base}/analytics</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>${base}/syllabus</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.60</priority>
  </url>
  <url>
    <loc>${base}/ai-assistant</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
</urlset>`);
  });

  // Dynamic robots.txt route (tells crawlers what to index and links to host-aware sitemap)
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "neetprep-ai.web.app";
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const base = `${protocol}://${host}`;
    
    res.header("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /

# Exclude private settings page from being crawled
Disallow: /settings

# Sitemaps
Sitemap: ${base}/sitemap.xml`);
  });

  // Simulated AI Doubt Solver for Offline Study Mode
  function getSimulatedDoubtExplanation(text: string, subject: string): string {
    const query = text.toLowerCase();
    let response = `### 🩺 NEET NCERT-Aligned Doubt Explanation\n\n`;
    response += `**Subject:** ${subject || "General Science"}\n`;
    response += `**Topic of Inquiry:** *"${text}"*\n\n`;
    response += `--- \n\n`;

    if (query.includes("mitosis") || query.includes("meiosis") || query.includes("cell division")) {
      response += `#### 🧬 Core Concept: Mitosis vs. Meiosis (NCERT Chapter: Cell Cycle and Cell Division)

**Mitosis** (Equational Division) occurs in somatic cells. It maintains the diploid chromosome number ($2n \\rightarrow 2n$) and is crucial for growth and tissue repair.
- **Prophase:** Chromatin condenses, nuclear membrane disappears, centrioles move to opposite poles.
- **Metaphase:** Chromosomes align along the metaphase plate (spindle fibers attach to kinetochores).
- **Anaphase:** Sister chromatids separate and are pulled to opposite poles (Centromeres split).
- **Telophase:** Nuclear envelope reforms, nucleolus reappears, chromatin decondenses.

**Meiosis** (Reductional Division) occurs in germ cells to produce gametes. It reduces the chromosome number by half ($2n \\rightarrow n$) and introduces genetic variations through crossing over.
- **Meiosis I:** Homologous chromosomes separate. *Prophase I* has 5 crucial sub-stages:
  1. **Leptotene:** Chromosomes become visible.
  2. **Zygotene:** Synapsis begins; pairing of homologous chromosomes assisted by the synaptonemal complex.
  3. **Pachytene:** **Crossing over** (recombination) occurs between non-sister chromatids of homologous chromosomes, facilitated by the enzyme **recombinase**. (Extremely high-yield for NEET!)
  4. **Diplotene:** Chiasmata formation (X-shaped structures) due to dissolution of synaptonemal complex.
  5. **Diakinesis:** Terminalisation of chiasmata.
- **Meiosis II:** Sister chromatids separate (similar to normal mitosis but starts with $n$ chromosomes).`;
    } else if (query.includes("photosynthesis") || query.includes("calvin") || query.includes("chloroplast") || query.includes("light reaction")) {
      response += `#### 🍃 Core Concept: Photosynthesis in Higher Plants (NCERT Biology)

Photosynthesis takes place in two main phases: the **Light Reaction (Photochemical Phase)** and the **Dark Reaction (Biosynthetic Phase)**.

##### 1. The Light Reaction (Thylakoid Membrane)
- Light is absorbed by Photosystems II and I (PS II absorbs at 680 nm, PS I absorbs at 700 nm).
- **Non-Cyclic Photophosphorylation (Z-Scheme):**
  - PS II absorbs light $\\rightarrow$ electrons are excited and accepted by primary acceptor $\\rightarrow$ passed through Electron Transport System (Plastoquinone, Cytochrome b6f, Plastocyanin) to PS I.
  - This flow creates a proton gradient across the thylakoid membrane, driving ATP synthesis via ATP synthase (Chemiosmotic Hypothesis).
  - Water splitting (**Photolysis of Water**) occurs on the inner side of the thylakoid membrane associated with PS II:
    $$2H_2O \\rightarrow 4H^+ + 4e^- + O_2$$
  - PS I excites electrons to reduce $NADP^+$ to $NADPH + H^+$.
- **Cyclic Photophosphorylation:** Occurs when only PS I is active (or light wavelength $> 680$ nm). Only ATP is synthesized, no NADPH or oxygen is formed.

##### 2. The Dark Reaction / Calvin Cycle (Stroma)
The Calvin Cycle ($C_3$ pathway) occurs in all photosynthetic plants. It has three key phases:
1. **Carboxylation:** RuBP (5C) reacts with $CO_2$ in the presence of the enzyme **RuBisCO** to form two molecules of 3-PGA (3C). This is the most crucial step!
2. **Reduction:** Uses 2 ATP and 2 NADPH per $CO_2$ fixed to produce triose phosphate.
3. **Regeneration:** Uses 1 ATP to regenerate RuBP so the cycle can continue.
*To synthesize 1 molecule of Glucose ($C_6H_{12}O_6$), the cycle must run 6 times, consuming a total of **18 ATP** and **12 NADPH**.*`;
    } else if (query.includes("kinematics") || query.includes("velocity") || query.includes("acceleration") || query.includes("motion") || query.includes("equation")) {
      response += `#### 🏎️ Core Concept: Kinematics & Equations of Motion (NCERT Physics Chapter 3 & 4)

Kinematics describes the motion of objects without considering the forces causing it.

##### 1. Key Quantities
- **Displacement ($s$ or $x$):** Vector quantity representing shortest path between start and end. (Unit: meters, m)
- **Velocity ($v$):** Rate of change of displacement. $v = \\frac{dx}{dt}$ (Unit: $m/s$)
- **Acceleration ($a$):** Rate of change of velocity. $a = \\frac{dv}{dt}$ (Unit: $m/s^2$)

##### 2. Standard Equations of Motion (For Constant Acceleration only)
1. $$v = u + at$$
2. $$s = ut + \\frac{1}{2}at^2$$
3. $$v^2 = u^2 + 2as$$
4. $$s_{n^{th}} = u + \\frac{a}{2}(2n - 1) \\quad \\text{(Displacement in the } n^{th} \\text{ second)}$$
Where:
- $u$ = Initial velocity
- $v$ = Final velocity
- $s$ = Displacement
- $a$ = Constant acceleration
- $t$ = Time interval

##### 3. Motion Under Gravity (Free Fall)
Taking downward direction as negative and setting $a = -g$ (where $g \\approx 9.8 \\text{ m/s}^2$ or $10 \\text{ m/s}^2$):
- Max height reached: $H = \\frac{u^2}{2g}$
- Time to reach max height: $t_u = \\frac{u}{g}$
- Total time of flight: $T = \\frac{2u}{g}$`;
    } else if (query.includes("gas") || query.includes("boyle") || query.includes("ideal") || query.includes("gas law")) {
      response += `#### 🧪 Core Concept: States of Matter & Gas Laws (NCERT Physical Chemistry)

Gaseous state is characterized by weak intermolecular forces, high compressibility, and infinite thermal expansion.

##### 1. The Gas Laws
- **Boyle's Law:** At constant temperature ($T$) and moles ($n$), volume ($V$) is inversely proportional to pressure ($P$).
  $$P_1V_1 = P_2V_2 \\quad (PV = \\text{constant})$$
- **Charles's Law:** At constant pressure ($P$) and moles ($n$), volume ($V$) is directly proportional to absolute temperature ($T$).
  $$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$
- **Gay-Lussac's Law:** At constant volume ($V$) and moles ($n$), pressure ($P$) is directly proportional to absolute temperature ($T$).
  $$\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$$
- **Avogadro's Law:** At constant temperature ($T$) and pressure ($P$), volume ($V$) is directly proportional to number of moles ($n$).
  $$\\frac{V_1}{n_1} = \\frac{V_2}{n_2}$$

##### 2. Ideal Gas Equation
By combining all these proportional relations, we derive:
$$PV = nRT$$
Where:
- $P$ = Pressure of gas
- $V$ = Volume of gas
- $n$ = Number of moles of gas
- $T$ = Absolute temperature (in Kelvin)
- $R$ = Universal Gas Constant ($8.314 \\text{ J mol}^{-1} \\text{ K}^{-1}$ or $0.0821 \\text{ L atm mol}^{-1} \\text{ K}^{-1}$)`;
    } else if (query.includes("dna") || query.includes("replication") || query.includes("genetics") || query.includes("translation") || query.includes("transcription")) {
      response += `#### 🧬 Core Concept: Molecular Basis of Inheritance (NCERT Biology Chapter 6)

##### 1. DNA Double Helix Structure (Watson and Crick Model, 1953)
- DNA is a double-stranded, right-handed helical polymer of deoxyribonucleotides.
- The backbones consist of alternating **sugar (deoxyribose)** and **phosphate** groups, linked by phosphodiester bonds.
- The two strands run **anti-parallel** (one in $5' \\rightarrow 3'$ direction, other in $3' \\rightarrow 5'$ direction).
- Bases pair inside the helix: Adenine pairs with Thymine ($A=T$) via 2 hydrogen bonds; Guanine pairs with Cytosine ($G\\equiv C$) via 3 hydrogen bonds (**Chargaff's Rule**: $[A]+[G] = [T]+[C]$).

##### 2. DNA Replication (Semiconservative)
Proven by **Meselson and Stahl (1958)** using heavy nitrogen isotope $^{15}N$ in *E. coli*.
- **Helicase:** Unwinds the DNA double helix, creating a replication fork.
- **SSBs (Single-Stranded Binding Proteins):** Prevent re-annealing.
- **DNA Polymerase III:** Synthesizes new strands in the $5' \\rightarrow 3'$ direction.
  - **Leading Strand:** Synthesized continuously towards the fork.
  - **Lagging Strand:** Synthesized discontinuously away from the fork, forming short fragments called **Okazaki fragments**, which are sealed together by the enzyme **DNA Ligase**.`;
    } else if (query.includes("digestion") || query.includes("digestive") || query.includes("stomach") || query.includes("intestine") || query.includes("enzyme")) {
      response += `#### 🍕 Core Concept: Digestion and Absorption (NCERT Biology Chapter 16)

Digestion is the mechanical and chemical breakdown of complex insoluble food substances into simple absorbable forms.

##### 1. Human Digestive System Organs
- **Buccal Cavity (Mouth):** Mechanical digestion by teeth (thecodont, diphyodont, heterodont). Chemical digestion of starch (about 30%) by salivary amylase (ptyalin, pH 6.8) into maltose.
- **Stomach:** Highly muscular J-shaped organ. Seceretes **gastric juice** containing:
  - **HCl (pH 1.8):** Activates pepsinogen; kills pathogens.
  - **Pepsin:** Endopeptidase digesting proteins into peptones and proteoses.
  - **Renin:** Proteolytic enzyme in infants for milk protein (casein) digestion.
- **Small Intestine:** Comprises Duodenum, Jejunum, and Ileum. Site of final digestion and maximum absorption.
  - Duodenum receives **bile** (emulsifies fats, activates lipases, contains no enzymes) and **pancreatic juice** (trypsinogen, chymotrypsinogen, amylases, lipases).
  - Intestinal juice (**succus entericus**) contains maltase, lactase, peptidases, nucleosidases.

##### 2. Absorption Mechanism
- Glucose and Amino acids: Absorbed by active transport or facilitated diffusion.
- Fatty acids and Glycerol: Insoluble, so they form tiny droplets called **micelles** $\\rightarrow$ re-esterified into protein-coated fat globules called **chylomicroons** inside enterocytes $\\rightarrow$ absorbed into lymph vessels (**lacteals**) in villi.`;
    } else if (query.includes("heart") || query.includes("cardiac") || query.includes("circulation") || query.includes("blood") || query.includes("ecg")) {
      response += `#### 🫀 Core Concept: Body Fluids and Circulation (NCERT Biology Chapter 18)

The human heart is a 4-chambered muscular myogenic organ responsible for driving double circulation.

##### 1. Myogenic Nodal System
Our heart generates electrical impulses internally via specialized nodal tissues:
- **SA Node (Sino-atrial Node):** Located in the upper right corner of the right atrium. Known as the **Pacemaker** because it generates the maximum rate of action potentials ($70-75 \\text{ beats/min}$).
- **AV Node (Atrio-ventricular Node):** Located in lower left corner of right atrium.
- **AV Bundle / Bundle of His & Purkinje Fibers:** Distribute action potentials rapidly to ventricular musculature.

##### 2. The Cardiac Cycle (0.8 seconds)
1. **Joint Diastole (0.4s):** All 4 chambers are relaxed; blood flows from vena cava and pulmonary veins into atria and then ventricles. Tricuspid and bicuspid valves are open, semilunar valves are closed.
2. **Atrial Systole (0.1s):** SA node fires $\\rightarrow$ both atria contract $\\rightarrow$ increases blood flow into ventricles by about 30%.
3. **Ventricular Systole (0.3s):** Ventricles contract $\\rightarrow$ ventricular pressure rises $\\rightarrow$ tricuspid & bicuspid valves close (generating **1st Heart Sound: 'LUBB'**) $\\rightarrow$ semilunar valves open, forcing blood into Aorta and Pulmonary Artery.
4. **Ventricular Diastole (part of joint diastole):** Ventricles relax $\\rightarrow$ pressure falls $\\rightarrow$ semilunar valves close to prevent backflow (generating **2nd Heart Sound: 'DUPP'**).

##### 3. Electrocardiogram (ECG)
A standard ECG records cardiac electrical activity:
- **P-wave:** Atrial depolarization (systole).
- **QRS complex:** Ventricular depolarization (systole). Highly significant diagnostic indicator.
- **T-wave:** Ventricular repolarization (diastole/relaxation).`;
    } else if (query.includes("electrostatics") || query.includes("charge") || query.includes("field") || query.includes("coulomb")) {
      response += `#### ⚡ Core Concept: Electrostatics & Coulomb's Law (NCERT Physics Chapter 1)

Electrostatics is the study of electromagnetic phenomena occurring when charges are stationary.

##### 1. Electric Charge properties
- Charges are quantized: $q = \pm ne$ (where $e = 1.6 \\times 10^{-19} \\text{ C}$).
- Electric charges are conserved and additive.

##### 2. Coulomb's Law
The electrostatic force of attraction or repulsion between two point charges ($q_1$ and $q_2$) separated by distance $r$ in vacuum is:
$$F = \frac{1}{4\pi\varepsilon_0} \frac{|q_1q_2|}{r^2}$$
Where:
- $\varepsilon_0$ = Permittivity of free space $\\approx 8.854 \\times 10^{-12} \\text{ C}^2\\text{N}^{-1}\\text{m}^{-2}$.
- $k = \\frac{1}{4\\pi\\varepsilon_0} \\approx 9 \\times 10^9 \\text{ N m}^2\\text{C}^{-2}$.

##### 3. Electric Field ($E$)
The force per unit positive test charge:
$$E = \\frac{F}{q_0} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2} \\quad \\text{(Unit: N/C or V/m)}$$
For an electric dipole, the electric field is:
- Axial point: $E = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2p}{r^3}$
- Equatorial point: $E = \\frac{1}{4\\pi\\varepsilon_0} \\frac{p}{r^3}$
Where $p = q \\cdot 2a$ is the dipole moment.`;
    } else {
      response += `#### 📚 Expert NCERT Guidance & Core Analysis

To tackle questions and concepts related to **"${text}"**, it is critical to break down the topic into its core NCERT definitions, processes, and quantitative frameworks.

##### 1. Core Conceptual Outline
- **NCERT Textual Definitions:** Always start with the standard definitions provided in the NCERT syllabus. This guarantees complete alignment with the official NEET answer keys.
- **Key Sub-systems & Mechanisms:** Identify the constituent steps, anatomical or structural organs, chemical reactions, or physical equations involved in this concept.
- **Functional Import & Interrelationships:** Focus on how this specific concept integrates into larger biological cycles, chemical pathways, or physical fields.

##### 2. High-Yield Points for NEET Preparation
- **Common Mistakes (The Trap Areas):** Pay attention to common areas of confusion (such as signs in physical chemistry thermodynamic equations, exact stages in plant cell division, or direction arrows in physics electrostatics fields).
- **Formulas & Diagrams:** Memorize the direct formulas, standard graphs, and NCERT labeled figures as they are frequently converted directly into questions.
- **Revision Strategy:** Try drafting a concise active recall mind-map connecting this topic to preceding and succeeding NCERT chapters.

---

**Step-by-Step Problem Solving & Advice:**
If your doubt contains numerical elements, always start by listing the known values (variables with SI units), writing down the primary governing equation, rearranging it for the unknown target variable, and completing the calculation. Keep a strict check on negative signs and factor multiples!`;
    }

    response += `\n\n---\n\n`;
    response += `💡 *Ustad AI Study Tip: Live dynamic AI integration is ready! Add your \`GEMINI_API_KEY\` secret in your developer settings or AI Studio Secrets panel to enable real-time personalized query solving.*`;
    return response;
  }

  // Simulated AI Chatbot response for Offline Study Mode
  function getSimulatedChatResponse(messages: any[], role: string, mode: string): string {
    const lastUserMessageObj = [...messages].reverse().find(m => m.role === "user");
    const queryText = lastUserMessageObj ? (lastUserMessageObj.content || lastUserMessageObj.text || "").toLowerCase() : "";
    let r = `### 🧑‍🏫 Ustad AI Coach Response\n\n`;

    if (role === "physics") {
      r += `Hello there! As your **Physics Coach**, let's tackle your preparation strategy and clear up those mechanical and numerical hurdles. \n\n`;
      if (queryText.includes("formula") || queryText.includes("numerical") || queryText.includes("solve") || queryText.includes("physics")) {
        r += `#### 🎯 Mastering NEET Physics Numericals: The 3-Step Strategy

NEET Physics doesn't require complex JEE Advanced-level derivations. It is highly formula-driven and tests your speed and precision. Here is how you conquer it:

1. **Step 1: Formula Memorization (The "Formula Diary")**
   - Maintain a thin notebook where you write every formula from every chapter.
   - For example, in **Electrostatics**, list $F = k\\frac{q_1q_2}{r^2}$, $E = \\frac{F}{q}$, and $V = \\frac{W}{q}$ side-by-side. Read this notebook for 15 minutes every morning!
2. **Step 2: Diagram & Variable Mapping**
   - Before calculating, sketch the problem (e.g., free-body diagrams, circuit diagram, lens diagram).
   - Write down all given variables in their SI units ($m$, $kg$, $s$, $N$, $C$).
3. **Step 3: Dimensional Check & Approximation**
   - If options have highly varying orders of magnitude, use quick approximations (e.g., take $g \\approx 10$, $\\pi^2 \\approx 10$, $hc \\approx 12400 \\text{ eV }\\mathring{\\text{A}}$).
   - Verify that your computed dimensions match the expected unit.

**High-Yield Units to Focus On:**
- **Modern Physics & Semiconductors** (Very high-yield, 6-8 questions, easy to score!)
- **Current Electricity & Magnetic Effects** (5-6 questions)
- **Kinematics & Laws of Motion** (4-5 questions)
- **Thermodynamics & Kinetic Theory** (3-4 questions)`;
      } else {
        r += `#### 💡 Conceptual Focus: Connecting Theory to Formulas

To score 140+ in NEET Physics:
- Read the **NCERT Summary** and **Points to Ponder** sections for every chapter.
- Focus on conceptual reasoning questions first before diving into heavy numerical pools.
- Practice at least 30-45 MCQs per day under a strict timer (e.g., 45 minutes for 45 questions).

What specific topic or formula in Physics should we break down or practice next?`;
      }
    } else if (role === "chemistry") {
      r += `Hello! As your **Chemistry Coach**, let's build your physical calculations, organic mechanisms, and inorganic periodicity tables. \n\n`;
      if (queryText.includes("organic") || queryText.includes("reaction") || queryText.includes("mechanism")) {
        r += `#### 🧪 Unlocking NEET Organic Chemistry (Ultimate Guide)

Organic Chemistry is highly logical. If you master the fundamentals, you can score a perfect 100% in this section:

1. **GOC (General Organic Chemistry):** This is the foundation of everything! Master **Inductive effect, Mesomeric effect, Hyperconjugation, and Resonance**. These determine stability of carbocations, acidity, and basicity of organic compounds (very common NEET questions!).
2. **Name Reactions:** Prepare a dedicated sheet of major name reactions (e.g., **Aldol Condensation, Cannizzaro Reaction, Reimer-Tiemann, Wurtz, Clemmensen, Kolbe's**). Memorize their exact reactants, reagents, and end-products.
3. **Reagents and Transformations:** Understand what major reagents do. For example, $LiAlH_4$ is a strong reducing agent (reduces acids/esters to alcohols), whereas $PCC$ is a mild oxidizing agent (oxidizes primary alcohols to aldehydes).
4. **Distinction Tests:** Be extremely clear with tests like **Tollens' Test, Fehling's Test, Iodoform Test, Lucas Test, and Hinsberg Test**.`;
      } else if (queryText.includes("inorganic") || queryText.includes("memorize") || queryText.includes("block")) {
        r += `#### 📖 Conquering Inorganic Chemistry: The NCERT Blueprint

Inorganic Chemistry questions are picked **word-for-word** from NCERT.
- **NCERT is your Bible:** Highlight trend exceptions. For example, why is the electron gain enthalpy of Fluorine less negative than Chlorine? (Due to interelectronic repulsion in small F-atom shell).
- **Coordination Compounds:** Learn IUPAC naming, isomerism (structural & geometrical), and Valence Bond/Crystal Field Theory ($d^2sp^3$ vs $sp^3d^2$ hybridizations, magnetic properties).
- **Chemical Bonding:** Practice **VSEPR Theory** (shapes of $XeF_4$, $SF_4$, $ClF_3$) and **Molecular Orbital Theory** ($O_2$ paramagnetic nature, bond order calculations).`;
      } else {
        r += `#### 📊 Physical Chemistry Revision Method

For Physical Chemistry, treat it like Physics:
- Note the formula for Thermodynamics ($\Delta G = \Delta H - T\Delta S$), Electrochemistry (Nernst Equation: $E = E^0 - \frac{0.0591}{n}\log Q$), and Chemical Kinetics (First order half-life: $t_{1/2} = \frac{0.693}{k}$).
- Practice calculating decimal logarithm arithmetic without a calculator, as this is a frequent time-killer in NEET exams!

Which segment of Chemistry—Organic, Inorganic, or Physical—would you like to review or strategize on next?`;
      }
    } else if (role === "biology") {
      r += `Welcome! As your **Medical Biology Authority**, let's optimize your prep for the core 360-mark section of NEET. \n\n`;
      if (queryText.includes("ncert") || queryText.includes("memorize") || queryText.includes("remember") || queryText.includes("biology") || queryText.includes("learn")) {
        r += `#### 🧬 Decoding NCERT Biology for a Perfect 360/360

Biology represents 50% of your total NEET score. Scoring 340+ is absolutely mandatory to fetch a top government medical college. Here is your NCERT blueprint:

1. **The Active Recall Method:**
   - After reading an NCERT topic (e.g., **DNA Replication** or **Double Circulation**), close the book and write down all the key stages, enzymes, or values you remember on a blank paper. Verify with NCERT to see what you missed.
2. **NCERT Diagrams Labeled Review:**
   - The NEET paper frequently includes NCERT diagrams with labels $(A, B, C, D)$ removed. Look at diagrams in chapters like Plant Kingdom, Human Physiology, and Anatomy and practice naming every line.
3. **Exceptions & Specific Numbers:**
   - Highlight exception lists (e.g., non-chordate phyla without true coelom, monoecious vs dioecious plants).
   - Memorize exact physiological numbers (e.g., GFR of kidneys is $125 \\text{ mL/min}$ or $180 \\text{ L/day}$, tidal volume is $500 \\text{ mL}$).
4. **High-Yield Chapters Rank List:**
   - **Genetics & Evolution** (10-12 questions)
   - **Human Physiology** (12-14 questions)
   - **Biotechnology** (7-9 questions)
   - **Ecology & Environment** (8-10 questions)`;
      } else {
        r += `#### 🩺 Human Physiology & Genetics Active Review

To score high:
- Read Genetics line-by-line. Focus on **Mendelian disorders** (Hemophilia, Sickle-cell anemia, Phenylketonuria) and chromosomal disorders (Down's, Klinefelter's, Turner's syndromes).
- For Human Physiology, map out flows (e.g., cardiac electrical path: SA node $\\rightarrow$ AV node $\\rightarrow$ Bundle of His $\\rightarrow$ Purkinje Fibers).

Would you like to analyze a specific chapter from Biology or solve some high-yield questions on a topic?`;
      }
    } else {
      // Mentor persona (Strategy, timetable, backlogs, panic)
      r += `Hello, future doctor! I am **Ustad AI, your strategic NEET UG Coach and Mentor**. I'm here to help you design a daily battle plan, optimize mock testing, and cross that coveted 650+ score threshold! \n\n`;
      
      if (queryText.includes("schedule") || queryText.includes("time table") || queryText.includes("routine") || queryText.includes("plan")) {
        r += `#### ⏱️ The Ultimate NEET 12-Hour Daily Study Plan

To cover the vast syllabus with daily revisions, adapt this robust study budget:

* **06:00 AM – 06:15 AM:** Warm-up & Daily Goal setting.
* **06:15 AM – 09:15 AM (Block 1 - 3 Hours):** **Biology NCERT Reading** (Max concentration window, perfect for memory consolidation).
* **09:15 AM – 10:00 AM:** Breakfast & Active walk.
* **10:00 AM – 01:00 PM (Block 2 - 3 Hours):** **Physics Concepts & Numericals** (Logical, analytical block).
* **01:00 PM – 02:00 PM:** Lunch & power nap (recharge your cognitive buffers).
* **02:00 PM – 05:00 PM (Block 3 - 3 Hours):** **Chemistry** (Alternate Organic/Physical/Inorganic every 2 days).
* **05:00 PM – 05:45 PM:** Tea break / relaxation.
* **05:45 PM – 07:45 PM (Block 4 - 2 Hours):** **Active MCQ Practice Sets** (Practice 50-80 questions under a strict timer).
* **07:45 PM – 08:30 PM:** Dinner.
* **08:30 PM – 09:30 PM (Block 5 - 1 Hour):** **Daily Revision & Backlog Review** (Go through what you studied today and update your formula notebook).
* **10:00 PM:** Sleep (A solid 8-hour sleep is non-negotiable for neurological memory consolidation).`;
      } else if (queryText.includes("backlog") || queryText.includes("syllabi") || queryText.includes("cover")) {
        r += `#### 🛠️ Backlog Clearing Strategy: The "Dual-Track" Rule

Backlogs are the biggest source of stress for NEET aspirants. Do not let them paralyze you. Use this highly effective dual-track plan:

1. **Rule 1: Don't pause your current class lectures/topics.**
   - If you stop current topics to clear old backlogs, you will create a new backlog today. Track current topics at 80% effort.
2. **Rule 2: Establish a "Backlog Power Hour" (1 hour daily).**
   - Reserve exactly 1 hour every single day (e.g., 8:30 PM to 9:30 PM) solely for backlog.
3. **Rule 3: Prioritize by Weightage.**
   - Do not clear backlogs in chronological order. Clear high-weightage topics first!
   - For example, clear **Chemical Bonding** and **Genetics** before minor chapters.
4. **Rule 4: Use One-Shots & Summary Notes.**
   - Don't read massive 50-page textbooks for backlogs. Use focused high-yield "One-Shot" revision videos and solve 30 standard PYQs.`;
      } else if (queryText.includes("anxiety") || queryText.includes("panic") || queryText.includes("scared") || queryText.includes("stress") || queryText.includes("nervous")) {
        r += `#### 🧘 Managing NEET Exam Stress & Nervousness

It's completely normal to feel overwhelmed, but remember: **stress is a biological response, not a reflection of your ability.** Here is how to keep cool:

- **Treat Mocks as Diagnostics, Not Verdicts:** A mock test score is simply a list of things you need to study tomorrow. It is not your final NEET score. Every mistake made in a mock is a question you will get correct in the actual exam!
- **Box Breathing Technique:** If you panic during study sessions or tests, inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold for 4 seconds. Repeat 3 times to downregulate your autonomic nervous system.
- **Stop Comparing:** Your journey is yours alone. Focus solely on improving your score by +10 marks every week.`;
      } else if (queryText.includes("mock") || queryText.includes("test") || queryText.includes("analysis")) {
        r += `#### 📊 How to Analyze NEET Mock Tests (The 3-Color Rule)

Just taking mock tests is useless unless you spend at least **2 hours analyzing** each one. Use this color-coding review method:

- **🟢 Green Circle (Silly Mistakes - 100% Concept Aware):** Questions you knew but got wrong due to misreading "NOT", calculation errors, or bubble filling.
  - *Fix:* Practice focusing during test conditions.
- **🟡 Yellow Circle (Conceptual Gaps - 50% Concept Aware):** Questions you attempted but guessed, or got stuck between 2 options.
  - *Fix:* Open your NCERT immediately, read that exact subsection, and write a summary.
- **🔴 Red Circle (Unknown Concepts - 0% Concept Aware):** Questions you had no idea about.
  - *Fix:* Schedule a full study block for this topic as a minor backlog item.`;
      } else {
        r += `#### 🩺 Your Strategic Admissions & Prep Journey

To score a **650+ out of 720**, here is your target subject split:
- **Biology:** $340+$ (Virtually zero scope of errors, read NCERT daily)
- **Chemistry:** $160+$ (Highly scoring if GOC and Inorganic trends are clear)
- **Physics:** $150+$ (Requires daily numerical workout)

What is your current average mock score, or what is the major bottleneck (backlogs, Physics numericals, or negative marking) currently blocking your progress? Let's fix it together!`;
      }
    }

    r += `\n\n---\n\n`;
    r += `🤖 **Ustad AI Note:** *Offline Study Mode active. To activate live dynamic AI coach chats, please configure your \`GEMINI_API_KEY\` secret in your developer settings or AI Studio Secrets panel.*`;
    return r;
  }

  // AI Doubt Solver Route
  app.post("/api/ai/solve-doubt", async (req, res) => {
    try {
      const { text, subject } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No question provided." });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fall back gracefully to high-quality offline simulation to avoid 500 error
        const answer = getSimulatedDoubtExplanation(text, subject);
        return res.json({ answer });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      const prompt = `You are an expert ${subject || "NEET"} tutor. A student has asked the following doubt:
"${text}"
Explain the concept simply, accurately, based strictly on the NCERT syllabus for NEET. Provide step-by-step logic. If it is an numerical problem, solve it completely. End with an encouraging note.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      res.status(500).json({ error: "Failed to generate an explanation. Please try again later." });
    }
  });

  // Helper to resolve specific prompt personality block based on chosen role parameter
  function getSystemInstructionForRole(role: string): string {
    switch (role) {
      case "physics":
        return `You are Dr. HC Verma, a NEET Physics Specialist and expert NCERT Physics tutor. 
Your goal is to break down complex physical concepts (e.g., Mechanics, Electromagnetism, Optics, SHM, Rotational Motion, Laws of Motion) into visual, simply explained intuitive descriptions and physical analogies.
When explaining a topic or answering a doubt:
1. Explain the underlying physical laws and core conceptual intuition first.
2. Provide a clean, step-by-step mathematical derivation if required, detailing each variable, its SI unit, and why it is used.
3. Be encouraging, patient, and precise. Avoid overly dense language, but maintain rigorous medical and scientific correctness. Focus on high-yield physics topics for NEET.`;
      case "chemistry":
        return `You are the NEET Chemistry Guru, specialized in Organic, Inorganic, and Physical Chemistry.
Your goal is to clarify core chemical concepts, equations, trends, and reactions:
1. For Organic Chemistry: Detail step-by-step reaction mechanisms, reagents, nucleophilic/electrophilic behavior, and stereochemistry.
2. For Physical Chemistry: Break down equations, equilibrium constants, thermodynamics, and electrochemistry calculations with clear numerical steps.
3. For Inorganic Chemistry: Use beautiful mnemonic tools, clear periodic table trends, block-element details, and coordination chemistry rules to make memory retention easy.
Maintain strict adherence to the NCERT Chemistry syllabus for NEET.`;
      case "biology":
        return `You are Dr. Shashi, a senior Medical Biology Specialist and NCERT biology authority.
Biology accounts for 50% (360 marks) of the NEET exam, so your explanations must be highly NCERT-aligned and textually precise.
1. Use NCERT-defined scientific classification, taxonomic terms, anatomical descriptions, and physiological stages.
2. Highlight high-yield topics (like Genetics, Human Physiology, Cell Division, Ecology, Plant Kingdom) that are frequently repeatedly asked in PYQs.
3. Structure your explanations with bullet points and clear, bold anatomical names to make revision extremely efficient.`;
      case "mentor":
      default:
        return `You are Ustad AI, a supportive, strategic NEET UG Exam coach and admissions mentor.
Your goal is to help students map out structured study strategies, optimize their revision routines, manage exam anxiety, select outstanding mock testing parameters, and track syllabus backlogs.
Give advice on time-management during the 3-hour exam, and how to analyze mistakes to cross a 650+ score threshold.
Adopt a warm, motivating, mentor-like persona. Use bold headers and encouraging bullet points in your response.`;
    }
  }

  // AI Specialist Multi-turn Chat Endpoint (multi-persona with parameterizable low latency & high thinking modes)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, role, mode } = req.body;
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fall back gracefully to simulated response to avoid 500 error
        const answer = getSimulatedChatResponse(messages, role || "mentor", mode || "fast");
        return res.json({ answer });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      
      // Determine model config based on mode
      let modelName = "gemini-3.5-flash"; // Default general model
      const config: any = {
        systemInstruction: getSystemInstructionForRole(role || "mentor")
      };

      if (mode === "fast") {
        modelName = "gemini-3.1-flash-lite"; // Fast low-latency responses
        // gemini-3.1-flash-lite automatically operates on minimal thinking/latency defaults
      } else if (mode === "thinking") {
        modelName = "gemini-3.1-pro-preview"; // High thinking mode for complex queries
        config.thinkingConfig = {
          thinkingLevel: "HIGH"
        };
        // MUST NOT set maxOutputTokens for high thinking
      }

      // Format to official GoogleGenAI structure: [{ role: 'user' | 'model', parts: [{ text: string }] }]
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.content || m.text || "" }]
      }));

      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedContents,
        config
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error("AI Unified Chat Route Error:", error);
      res.status(500).json({ error: "Failed to communicate with Ustad AI. Please try again later." });
    }
  });

  // AI Dynamic Question Generator Route
  app.post("/api/ai/generate-questions", async (req, res) => {
    try {
      const { subject, chapter } = req.body;
      if (!subject || !chapter) {
        return res.status(400).json({ error: "Subject and Chapter must be provided." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(404).json({ error: "Gemini API key is missing. Falling back." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      const prompt = `You are a NEET entrance exam specialist and NCERT tutor. Generate exactly 12 multiple-choice questions (MCQs) for the NEET anatomy exam, specifically under the subject "${subject}" and the exact chapter topic "${chapter}".
ALL questions MUST be strictly relevant to the core concepts of the chapter "${chapter}" under "${subject}" in the standard NCERT curriculum.
Do not include questions from other unrelated chapters/topics of "${subject}".
For example, if the chapter is "Digestion and Absorption", all questions must cover digestion organs, stomach, saliva, bile, emulsification, gut enzymes, gut histology, peptide absorption, and gastrointestinal disorders. Do not include plant taxonomy, plant hormones, animal phyla, or organic reactions.

Each question object must contain a text, options (exactly 4 strings), correctOptionIndex (0-3 index), explanation (detailed NCERT rationale), and difficulty ('Easy', 'Medium', or 'Hard').`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: "The MCQ question text based strictly on the NCERT syllabus for this chapter."
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 options."
                },
                correctOptionIndex: {
                  type: Type.INTEGER,
                  description: "Zero-based index of the correct option (0, 1, 2, or 3)."
                },
                explanation: {
                  type: Type.STRING,
                  description: "Detailed NCERT-aligned explanation justifying the correct option and explaining why others are incorrect."
                },
                difficulty: {
                  type: Type.STRING,
                  description: "The difficulty level: Easy, Medium, or Hard."
                }
              },
              required: ["text", "options", "correctOptionIndex", "explanation", "difficulty"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini.");
      }

      const parsedQuestions = JSON.parse(text.trim());
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Invalid response format.");
      }

      const formattedQuestions = parsedQuestions.map((q: any, idx: number) => ({
        id: `ai_q_${subject.substring(0, 3).toLowerCase()}_${chapter.toLowerCase().replace(/[^a-z0-9]/g, '')}_${idx}_${Date.now()}`,
        subject,
        chapter,
        text: q.text,
        options: q.options,
        correctOptionIndex: typeof q.correctOptionIndex === 'number' ? Math.max(0, Math.min(3, q.correctOptionIndex)) : 0,
        explanation: q.explanation,
        difficulty: q.difficulty === 'Easy' || q.difficulty === 'Medium' || q.difficulty === 'Hard' ? q.difficulty : 'Medium',
        isPreviousYear: Math.random() < 0.25
      }));

      res.json({ questions: formattedQuestions });
    } catch (error: any) {
      console.error("AI Question Generation Error:", error);
      res.status(500).json({ error: "Failed to generate AI questions. Falling back to local offline database." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
