
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

            {/* Technical Expertise Grid */}
            <div className="lg:col-span-7 lg:pl-12">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-6 block">Expertíza</span>
                <h3 className="text-3xl font-serif text-[#2C2A26] mb-8 md:mb-12">Technický Stack</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-12">
                    <div>
                        <h4 className="font-serif text-lg text-[#2C2A26] mb-4 border-b border-[#D6D1C7] pb-2">Frontend & UI</h4>
                        <ul className="space-y-2 text-[#5D5A53] font-light">
                            <li>React / Next.js (Architecture)</li>
                            <li>TypeScript / ESNext</li>
                            <li>Tailwind CSS / Styled Components</li>
                            <li>Framer Motion / GSAP Animations</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg text-[#2C2A26] mb-4 border-b border-[#D6D1C7] pb-2">Backend & Cloud</h4>
                        <ul className="space-y-2 text-[#5D5A53] font-light">
                            <li>Node.js / Express / NestJS</li>
                            <li>Python (FastAPI / Django)</li>
                            <li>PostgreSQL / MongoDB / Redis</li>
                            <li>Docker / AWS / Vercel</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg text-[#2C2A26] mb-4 border-b border-[#D6D1C7] pb-2">Creative & WebXR</h4>
                        <ul className="space-y-2 text-[#5D5A53] font-light">
                            <li>Three.js / React Three Fiber</li>
                            <li>WebGL / GLSL Shaders</li>
                            <li>Generative Design (p5.js)</li>
                            <li>Immersive Web Experiences</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-serif text-lg text-[#2C2A26] mb-4 border-b border-[#D6D1C7] pb-2">AI & Innovations</h4>
                        <ul className="space-y-2 text-[#5D5A53] font-light">
                            <li>Gemini API Integration</li>
                            <li>TensorFlow.js</li>
                            <li>AI-Driven UX/UI Patterns</li>
                            <li>Prompt Engineering & RAG</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;
