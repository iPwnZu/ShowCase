
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
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
        // Ignore
      }
    }
  };

  return (
    <section id="home" className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#2C2A26]">
      
      {/* Background - Technical but Organic */}
      <div className="absolute inset-0 w-full h-full">
        <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            alt="Cybernetic abstract landscape" 
            className="w-full h-full object-cover opacity-60 grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F5F2EB]/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 md:px-6">
        <div className="animate-fade-in-up max-w-4xl">
          <span className="block text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#A8A29E] mb-4 md:mb-6 animate-delay-200">
            František Kalášek
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-[#F5F2EB] tracking-tight mb-6 md:mb-8 leading-tight">
            I create stunning <br />
            <span className="italic text-[#A8A29E]">graphic designs</span> <br />
            & innovative code.
          </h1>
          <p className="max-w-xs sm:max-w-xl mx-auto text-base md:text-lg text-[#F5F2EB]/80 font-light leading-relaxed mb-8 md:mb-12">
            Senior Web Developer & Software Architect
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-xs sm:max-w-none mx-auto">
            <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, 'contact')}
                className="w-full sm:w-auto px-8 py-4 bg-[#F5F2EB] text-[#2C2A26] rounded-none text-sm font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 text-center"
            >
                Get in touch
            </a>
            <a 
                href="#showcase" 
                onClick={(e) => handleNavClick(e, 'showcase')}
                className="w-full sm:w-auto px-8 py-4 border border-[#F5F2EB]/30 text-[#F5F2EB] rounded-none text-sm font-bold uppercase tracking-widest hover:bg-[#F5F2EB]/10 transition-all duration-300 text-center"
            >
                View Portfolio
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-[#F5F2EB]/30">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
