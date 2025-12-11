
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

// Helper for responsive images - Optimized for wider range of devices
const getUnsplashSrcSet = (url: string) => {
    if (!url.includes('images.unsplash.com')) return undefined;
    const base = url.replace(/&w=\d+/, '');
    // Added 800w for tablets and 2400w for high-res desktop displays
    return `${base}&w=600 600w, ${base}&w=800 800w, ${base}&w=1200 1200w, ${base}&w=1600 1600w, ${base}&w=2400 2400w`;
};

const CAREER_MILESTONES = [
    {
        title: 'TopBot.PwnZ™',
        description: 'Založení vlastní značky spojující enterprise architekturu s AI a WebXR. Cílem je vytvářet "inteligentní" web, který se adaptuje na uživatele.',
        current: true
    },
    {
        title: 'Senior Web Architect',
        description: 'Specializace na React ekosystém a optimalizaci výkonu. Vedení technických rozhodnutí u rozsáhlých frontendových aplikací.',
        current: false
    },
    {
        title: 'Full Stack Deep Dive',
        description: 'Přechod do hloubky backendu (Node.js, Python). Pochopení komplexity distribuovaných systémů a databázových struktur.',
        current: false
    },
    {
        title: 'Hello World & Počátky',
        description: 'Vše začalo touhou dekonstruovat digitální svět. První experimenty s kódem a fascinace možností vytvořit něco z ničeho.',
        current: false
    }
];

// Enhanced Skills Data with proficiency levels
const SKILL_CATEGORIES = [
  {
    title: "Frontend & Architecture",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    skills: [
      { name: "React / Next.js", level: 98 },
      { name: "TypeScript Architecture", level: 95 },
      { name: "Tailwind / Design Systems", level: 95 },
      { name: "Performance Optimization", level: 90 }
    ]
  },
  {
    title: "Backend & Cloud",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    skills: [
      { name: "Node.js / NestJS", level: 92 },
      { name: "Python / FastAPI", level: 85 },
      { name: "PostgreSQL / SQL", level: 88 },
      { name: "Docker / Vercel CI/CD", level: 85 }
    ]
  },
  {
    title: "Creative & WebXR",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    skills: [
      { name: "Three.js / R3F", level: 90 },
      { name: "WebGL / Shaders", level: 82 },
      { name: "UI/UX Motion", level: 94 },
      { name: "Generative Art", level: 80 }
    ]
  },
  {
    title: "AI & Innovation",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    skills: [
      { name: "Gemini / OpenAI API", level: 95 },
      { name: "RAG & Vector DBs", level: 85 },
      { name: "AI Agent Architecture", level: 90 },
      { name: "Prompt Engineering", level: 92 }
    ]
  }
];

const About: React.FC = () => {
  return (
    <section id="about" className="bg-[#EBE7DE]">
      
      {/* Introduction / Who's this guy */}
      <div className="py-16 md:py-24 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-32 mb-16 md:mb-24">
            <div className="md:w-1/3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-6 block">Kdo jsem?</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C2A26] leading-tight">
                Hello World 🫵 <br/>
                Jmenuji se František Kalášek.
            </h2>
            </div>
            <div className="md:w-2/3 max-w-2xl">
            <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-6 md:mb-8">
                Můj domov, ukrytý v kouzelném regionu Moravy poblíž Nového Města na Moravě, je nevyčerpatelným zdrojem inspirace. Zde se zvlněné kopce setkávají se starobylou architekturou a živá komunita hladce prolíná nadčasové tradice s moderními inovacemi.
            </p>
            <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed">
                Je to místo, kde divoká krása přírody konverguje s lidskou vynalézavostí, což ve mně probouzí nekonečné možnosti pro práci v oblasti technologií a designu.
            </p>
            </div>
        </div>

        {/* Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[50vh] border-t border-[#D6D1C7]">
            <div className="flex flex-col justify-center py-12 lg:pr-24 order-2 lg:order-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-6">Moje Filosofie</span>
                <h3 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 text-[#2C2A26] leading-tight">
                    Nestavím jen weby. <br/>
                    Inovuji řešení.
                </h3>
                <p className="text-lg text-[#5D5A53] font-light leading-relaxed mb-8">
                    Jsem mostem, kde se kreativní vize setkává s technickou exekucí. Vytvářím digitální krajiny, které jsou krásné na pohled a bezchybně funkční.
                </p>
                <blockquote className="border-l-2 border-[#2C2A26] pl-6 italic text-lg md:text-xl text-[#2C2A26] font-serif">
                    "Bridge the gap, create the world. Vnímáme svět, kde jsou hranice překonány a kultury spojeny kreativitou."
                </blockquote>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-auto overflow-hidden group mt-8 lg:mt-0 order-1 lg:order-2">
                <img 
                    src="https://ik.imagekit.io/ipwnzu/Moravian.png" 
                    srcSet={getUnsplashSrcSet("https://ik.imagekit.io/ipwnzu/Moravian.png")}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
                    loading="lazy"
                    decoding="async"
                    alt="Moravian Nature synthesized with Digital Technology" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
            </div>
        </div>

        {/* Career & Skills Expansion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 md:mt-24 pt-16 md:pt-24 border-t border-[#D6D1C7]">
            {/* Career Journey Timeline */}
            <div className="lg:col-span-5">
                <div className="flex flex-row-reverse md:flex-row items-start justify-between md:justify-start gap-6 mb-12">
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-[#EBE7DE] overflow-hidden rounded-full border border-[#D6D1C7] shadow-lg">
                        <img 
                            src="https://ik.imagekit.io/ipwnzu/IMG_0021(1).PNG?updatedAt=1763676215389" 
                            loading="lazy"
                            alt="František Kalášek" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 pt-4 text-right md:text-left">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-4 block">Moje Cesta</span>
                        <h3 className="text-3xl font-serif text-[#2C2A26]">Kariérní Timeline</h3>
                    </div>
                </div>

                <div className="relative pl-6 md:pl-4 ml-2 md:ml-8 border-l border-[#D6D1C7]">
                    {CAREER_MILESTONES.map((milestone, idx) => (
                        <div 
                            key={idx} 
                            className="relative pl-6 md:pl-8 pb-12 last:pb-0 group opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Timeline Node */}
                            <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border border-[#EBE7DE] transition-all duration-300 group-hover:scale-150 ${
                                milestone.current ? 'bg-[#2C2A26] scale-125' : 'bg-[#A8A29E]'
                            }`}>
                                {milestone.current && (
                                    <div className="absolute inset-0 bg-[#2C2A26] rounded-full animate-ping opacity-20"></div>
                                )}
                            </div>
                            
                            <h4 className="font-bold text-[#2C2A26] text-lg mb-2 group-hover:translate-x-1 transition-transform duration-300">
                                {milestone.title}
                            </h4>
                            
                            <p className="text-[#5D5A53] font-light leading-relaxed text-sm">
                                {milestone.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technical Expertise Visual Grid */}
            <div className="lg:col-span-7 lg:pl-12">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-6 block">Expertíza</span>
                <h3 className="text-3xl font-serif text-[#2C2A26] mb-8 md:mb-12">Technický Stack</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
                    {SKILL_CATEGORIES.map((category, idx) => (
                        <div key={idx} className="group">
                             <div className="flex items-center gap-3 mb-6 border-b border-[#D6D1C7] pb-2">
                                <span className="text-[#2C2A26]">{category.icon}</span>
                                <h4 className="font-serif text-lg text-[#2C2A26]">{category.title}</h4>
                             </div>
                             <div className="space-y-6">
                                {category.skills.map((skill, sIdx) => (
                                    <div key={sIdx}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-medium text-[#5D5A53]">{skill.name}</span>
                                            <span className="text-xs text-[#A8A29E] font-mono">{skill.level}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-[#D6D1C7]/50 overflow-hidden rounded-full">
                                            <div 
                                                className="h-full bg-[#2C2A26] transition-all duration-[1.5s] ease-out rounded-full"
                                                style={{ 
                                                    width: `${skill.level}%`,
                                                    transitionDelay: `${(idx * 200) + (sIdx * 100)}ms`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;
