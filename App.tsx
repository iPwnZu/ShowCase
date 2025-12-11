
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WebXRShowcase from './components/WebXRShowcase';
import About from './components/About';
import Contact from './components/Contact';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import { ViewState } from './types';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';

// Helper for responsive images
const getUnsplashSrcSet = (url: string) => {
  if (!url.includes('images.unsplash.com')) return undefined;
  const base = url.replace(/&w=\d+/, '');
  return `${base}&w=400 400w, ${base}&w=600 600w, ${base}&w=1200 1200w, ${base}&w=1800 1800w, ${base}&w=2400 2400w`;
};

function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const { addToHistory, getHistory } = useRecentlyViewed();
  
  // State to trigger AI Assistant from external buttons
  const [aiTrigger, setAiTrigger] = useState<{ open: boolean, message?: string }>({ open: false });

  // Handle navigation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | null, targetId: string) => {
    if (e) e.preventDefault();
    
    if (view.type !== 'home') {
      setView({ type: 'home' });
      // Allow state to update before scrolling
      setTimeout(() => scrollToSection(targetId), 100);
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {
        // Ignore SecurityError
      }
    }
  };

  const handleProjectClick = (project: any) => {
      addToHistory(project);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView({ type: 'project', project });
  };

  // Helper to get current context for AI
  const getCurrentContext = (): string => {
      if (view.type === 'home') {
          return "Uživatel se nachází na hlavní stránce. Vidí sekce: Hero, O mně, WebXR Showcase (portfolio), Kontakt.";
      }
      if (view.type === 'project') {
          return `Uživatel si detailně prohlíží projekt s názvem: "${view.project.name}". Kategorie: ${view.project.category}. Popis: ${view.project.description}. TechStack: ${view.project.techStack.join(', ')}`;
      }
      return "Neznámý kontext";
  };

  const handleAiInsight = () => {
      if (view.type === 'project') {
          setAiTrigger({ 
              open: true, 
              message: `Analyzuj technickou architekturu projektu ${view.project.name} a vysvětli hlavní výzvy při použití technologií: ${view.project.techStack.join(', ')}.` 
          });
      }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-[#2C2A26] selection:bg-[#2C2A26] selection:text-[#F5F2EB]">
      <Navbar onNavClick={handleNavClick} />
      
      <main>
        {view.type === 'home' && (
          <>
            <Hero />
            <About />
            <WebXRShowcase onProjectClick={handleProjectClick} />
            <Contact />
          </>
        )}

        {view.type === 'project' && (
           <div className="pt-24 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
              <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
                <button 
                  onClick={() => {
                    setView({ type: 'home' });
                    setTimeout(() => scrollToSection('showcase'), 50);
                  }}
                  className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-8 p-2 -ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Zpět na Portfolio
                </button>

                {/* Main Content Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
                  <div className="w-full aspect-[4/3] md:aspect-[16/10] bg-[#2C2A26] overflow-hidden shadow-xl shadow-[#2C2A26]/10">
                      <img 
                        src={view.project.imageUrl} 
                        srcSet={getUnsplashSrcSet(view.project.imageUrl)}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        alt={view.project.name} 
                        loading="eager" 
                        decoding="async"
                        // Applied filters for color coordination
                        className="w-full h-full object-cover animate-fade-in-up sepia-[0.1] saturate-[0.85] contrast-[1.05]"
                      />
                  </div>

                  <div className="flex flex-col justify-center max-w-xl">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-[#A8A29E] uppercase tracking-widest">{view.project.category}</span>
                        {/* AI Insight Trigger */}
                        <button 
                            onClick={handleAiInsight}
                            className="flex items-center gap-2 px-3 py-1 bg-[#EBE7DE] hover:bg-[#2C2A26] hover:text-[#F5F2EB] transition-colors text-xs font-bold uppercase tracking-widest border border-[#D6D1C7] rounded-full group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:animate-pulse">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                            AI Analýza
                        </button>
                     </div>
                     
                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2C2A26] mb-4 leading-tight">{view.project.name}</h1>
                     <p className="text-lg sm:text-xl font-serif italic text-[#2C2A26] mb-8">{view.project.tagline}</p>
                     <p className="text-[#5D5A53] leading-relaxed font-light text-base sm:text-lg mb-8 border-b border-[#D6D1C7] pb-8">
                       {view.project.description}
                     </p>

                     <div>
                       <span className="block text-xs font-bold uppercase tracking-widest text-[#2C2A26] mb-4">Tech Stack</span>
                       <div className="flex flex-wrap gap-2">
                          {view.project.techStack.map(tech => (
                              <span key={tech} className="px-4 py-2 border border-[#2C2A26] text-[#2C2A26] text-sm font-medium">
                                {tech}
                              </span>
                          ))}
                       </div>
                     </div>
                  </div>
                </div>

                {/* Recently Viewed */}
                {getHistory().length > 0 && (
                     <div className="border-t border-[#D6D1C7] pt-16">
                         <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-8 block">Historie</span>
                         <h2 className="text-2xl font-serif text-[#2C2A26] mb-8">Naposledy zobrazené</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                             {getHistory().map(p => (
                                 <button 
                                     key={p.id} 
                                     onClick={() => handleProjectClick(p)}
                                     className="group text-left"
                                 >
                                     <div className="aspect-[16/10] bg-[#EBE7DE] mb-3 overflow-hidden">
                                         <img 
                                            src={p.imageUrl} 
                                            srcSet={getUnsplashSrcSet(p.imageUrl)}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            alt={p.name} 
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover sepia-[0.2] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
                                          />
                                     </div>
                                     <h3 className="font-serif text-[#2C2A26] text-lg group-hover:underline">{p.name}</h3>
                                     <span className="text-xs uppercase text-[#A8A29E]">{p.category}</span>
                                 </button>
                             ))}
                         </div>
                     </div>
                )}

              </div>
           </div>
        )}
      </main>

      {view.type === 'home' && <Footer onLinkClick={handleNavClick} />}
      
      <Assistant 
        currentContext={getCurrentContext()} 
        // Pass the actual project object for smarter suggestions
        activeProject={view.type === 'project' ? view.project : undefined}
        onNavigate={(sectionId) => handleNavClick(null, sectionId)}
        initialMessage={aiTrigger.message}
        forceOpen={aiTrigger.open}
      />
    </div>
  );
}

export default App;
