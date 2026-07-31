import React from 'react';

interface LogoProps {
  mode?: 'full' | 'compact' | 'horizontal';
  className?: string;
  iconSize?: number;
  theme?: 'light' | 'dark';
}

export default function Logo({ mode = 'full', className = '', iconSize = 48, theme = 'light' }: LogoProps) {
  const renderIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 filter drop-shadow-sm select-none"
    >
      <defs>
        {/* Superior Clinical Teal Gradient representing academic high scores */}
        <linearGradient id={`crestTeal-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" /> {/* Core active teal */}
          <stop offset="100%" stopColor="#0D9488" /> {/* Professional clinical emerald */}
        </linearGradient>

        {/* Vibrant secondary blue for a celestial clinical depth */}
        <linearGradient id={`crestBlue-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" /> {/* Bright cyan */}
          <stop offset="100%" stopColor="#0EA5E9" /> {/* Rich medical blue */}
        </linearGradient>
        
        {/* Prestigious Royal Gold representing success, top ranks, and academic excellence */}
        <linearGradient id={`royalGold-${mode}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D97706" /> {/* Deep amber gold */}
          <stop offset="50%" stopColor="#F59E0B" /> {/* Pure gold */}
          <stop offset="100%" stopColor="#FCD34D" /> {/* Radiant light gold */}
        </linearGradient>

        {/* Neon Bio-Pulse Gradient for a futuristic vitality look */}
        <linearGradient id={`bioPulse-${mode}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" /> {/* Emerald */}
          <stop offset="100%" stopColor="#34D399" /> {/* Mint */}
        </linearGradient>

        <filter id={`premiumGlow-${mode}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Subtle outer glowing orbital rings */}
      <circle cx="80" cy="80" r="74" stroke={`url(#crestTeal-${mode})`} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      <circle cx="80" cy="80" r="68" stroke={`url(#royalGold-${mode})`} strokeWidth="1" opacity="0.25" />

      {/* Primary Prestigous Academic Medical Shield Contour */}
      <path 
        d="M 80,22 L 126,38 C 126,38 126,92 110,116 C 96,136 80,144 80,144 C 80,144 64,136 50,116 C 34,92 34,38 34,38 Z" 
        fill="#071E1D" 
        fillOpacity="0.85" 
        stroke={`url(#crestTeal-${mode})`} 
        strokeWidth="3.5" 
        strokeLinejoin="round"
      />

      {/* Double Inner Gold Shield Accent representing AIIMS / Top-Rank Medical Standards */}
      <path 
        d="M 80,28 L 120,42 C 120,42 120,88 106,110 C 93,127 80,135 80,135 C 80,135 67,127 54,110 C 40,88 40,42 40,42 Z" 
        stroke={`url(#royalGold-${mode})`} 
        strokeWidth="1.5" 
        strokeLinejoin="round"
        opacity="0.85"
        fill="none"
      />

      {/* Symmetrical Medical Cross Vector integrated directly into the shield's blueprint */}
      <g opacity="0.15">
        <path d="M 72,50 H 88 V 104 H 72 Z" fill={`url(#crestTeal-${mode})`} />
        <path d="M 53,77 H 107 V 93 H 53 Z" fill={`url(#crestTeal-${mode})`} />
      </g>

      {/* DNA Helix / Medical Caduceus curves crossing behind the symbol */}
      <path 
        d="M 55,75 C 55,60 105,60 105,75 C 105,90 55,90 55,105 C 55,120 105,120 105,125" 
        stroke={`url(#crestBlue-${mode})`} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        opacity="0.3" 
        fill="none" 
      />
      <path 
        d="M 105,75 C 105,60 55,60 55,75 C 55,90 105,90 105,105 C 105,120 55,120 55,125" 
        stroke={`url(#crestTeal-${mode})`} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        opacity="0.3" 
        fill="none" 
      />

      {/* High-fidelity glowing ECG pulse line running through the center representing vital science and active diagnostics */}
      <path 
        d="M 45,86 L 56,86 L 62,72 L 69,112 L 77,48 L 84,106 L 91,76 L 95,86 L 115,86" 
        stroke={`url(#royalGold-${mode})`} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter={`url(#premiumGlow-${mode})`}
      />

      {/* Premium Caduceus Crown or AIIMS Achievement Star at top of Shield */}
      <g transform="translate(80, 48)">
        {/* Star Polygon */}
        <path 
          d="M 0,-10 L 3,-3 L 10,-3 L 5,2 L 7,9 L 0,5 L -7,9 L -5,2 L -10,-3 L -3,-3 Z" 
          fill={`url(#royalGold-${mode})`} 
        />
      </g>

      {/* Professional Mirroring Dots */}
      <circle cx="80" cy="116" r="3.5" fill={`url(#crestTeal-${mode})`} />
      <circle cx="68" cy="114" r="2" fill={`url(#crestBlue-${mode})`} opacity="0.8" />
      <circle cx="92" cy="114" r="2" fill={`url(#crestBlue-${mode})`} opacity="0.8" />
    </svg>
  );

  if (mode === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center rounded-2xl bg-[#092221] border border-teal-500/30 p-2 shadow-lg hover:border-teal-400/40 transition-all duration-300 ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  if (mode === 'horizontal') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <div className="p-1.5 bg-[#092221] rounded-2xl border border-teal-500/30 shadow-md shrink-0 hover:border-teal-400/40 transition-all duration-300">
          {renderIcon()}
        </div>
        <div className="flex flex-col min-w-0">
          {/* Outstanding high contrast, vivid text rendering for NEET Prep */}
          <span className={`font-black text-xl tracking-tight leading-none uppercase ${theme === 'dark' ? 'text-white' : 'text-[#0B3C39]'}`}>
            NEET <span className={theme === 'dark' ? 'text-teal-350 font-black drop-shadow-sm' : 'text-teal-650 font-black'}>Prep</span>
          </span>
          <span className={`text-[10px] font-extrabold tracking-widest uppercase mt-1 ${theme === 'dark' ? 'text-amber-400' : 'text-teal-600'}`}>
            Learn Smarter / Score Higher
          </span>
        </div>
      </div>
    );
  }

  // default: 'full' mode (vertical stacking)
  return (
    <div className={`flex flex-col items-center text-center p-3 select-none ${className}`}>
      <div className="relative mb-3.5 p-2 bg-[#082221] rounded-2xl border border-teal-500/30 shadow-xl hover:border-teal-450/40 transition-all duration-300">
        {renderIcon()}
        {/* Active, prestigious live diagnostic pulse beacon */}
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-400 border-2 border-[#082221]"></span>
        </span>
      </div>
      
      <div className="flex flex-col">
        {/* Exceptionally readable, custom-designed medical brand text */}
        <h2 className={`text-2xl font-black tracking-tight leading-none mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-[#062624]'}`}>
          NEET <span className={theme === 'dark' ? 'text-teal-350 font-black drop-shadow-md' : 'text-teal-650 font-black'}>Prep</span>
        </h2>
        <p className={`text-[9.5px] font-black uppercase tracking-widest leading-relaxed ${theme === 'dark' ? 'text-teal-350/90' : 'text-teal-650'}`}>
          Learn Smarter, Score Higher
        </p>
      </div>
    </div>
  );
}
