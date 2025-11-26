
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

interface WebXRShowcaseProps {
  onProjectClick: (project: Project) => void;
}

// Helper to generate Unsplash srcSet with more granular breakpoints
const getUnsplashSrcSet = (url: string) => {
  if (!url.includes('images.unsplash.com')) return undefined;
  const base = url.replace(/&w=\d+/, '');
  // Added 300w for very small screens/thumbnails and 2000w for high-DPI large screens
  return `${base}&w=300 300w, ${base}&w=600 600w, ${base}&w=900 900w, ${base}&w=1200 1200w, ${base}&w=1600 1600w, ${base}&w=2000 2000w`;
};

const WebXRShowcase: React.FC<WebXRShowcaseProps> = ({ onProjectClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="showcase" className="py-20 md:py-32 px-6 md:px-12 bg-[#F5F2EB]" aria-label="Portfolio projektů">
      <div className="max-w-[1800px] mx-auto">
        
        <div className="flex flex-col items-start mb-12 md:mb-20 border-b border-[#D6D1C7] pb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-4">Portfolio</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">WebXR Showcase</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16" role="list">
          {PROJECTS.map((project, idx) => {
            // Generate unique IDs for aria-labelledby referencing
            const titleId = `project-title-${project.id}`;
            const descId = `project-desc-${project.id}`;
            const catId = `project-cat-${project.id}`;
            
            // LCP Optimization: Load first 2 images eagerly and with high priority
            const isPriority = idx < 2;

            return (
              <button 
                  key={project.id}
                  role="listitem"
                  className={`group w-full text-left flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2A26] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F5F2EB] rounded-sm transition-all duration-700 ease-out mt-0 ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onProjectClick(project)}
                  aria-labelledby={`${catId} ${titleId} ${descId}`}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#2C2A26] mb-6 shadow-lg shadow-[#2C2A26]/5 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-[#2C2A26]/15" aria-hidden="true">
                  <img 
                    src={project.imageUrl} 
                    srcSet={getUnsplashSrcSet(project.imageUrl)}
                    // Precise sizing: 
                    // Mobile: 100vw minus padding (approx 48px)
                    // Tablet/Desktop: 50vw minus gaps and padding
                    // Max: capped at container max-width / 2
                    sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1800px) calc(50vw - 48px), 860px"
                    loading={isPriority ? "eager" : "lazy"}
                    // @ts-ignore - fetchPriority is standard but React types might not cover it yet
                    fetchPriority={isPriority ? "high" : "auto"}
                    decoding="async"
                    alt="" 
                    // COLOR CORRECTION & ANIMATION: 
                    // - Subtle zoom (scale-105) for parallax feel
                    // - Sepia/Saturate removal on hover for "focus" effect
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100 sepia-[0.1] saturate-[0.8] contrast-[1.05] group-hover:sepia-0 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/10 backdrop-blur-[1px]">
                      <span className="bg-[#F5F2EB] text-[#2C2A26] px-6 py-3 text-xs uppercase tracking-widest font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          Prohlédnout Projekt
                      </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-start w-full transition-opacity duration-500 group-hover:opacity-90">
                  <span id={catId} className="text-xs font-bold uppercase tracking-widest text-[#A8A29E] mb-2 group-hover:text-[#2C2A26] transition-colors">{project.category}</span>
                  <h3 id={titleId} className="text-3xl font-serif text-[#2C2A26] mb-3 group-hover:underline underline-offset-4 decoration-1 decoration-[#A8A29E]/50">{project.name}</h3>
                  <p id={descId} className="text-[#5D5A53] font-light leading-relaxed max-w-md">{project.description}</p>
                  
                  <div className="flex gap-2 mt-4 flex-wrap" aria-label="Použité technologie">
                      {project.techStack.map(tech => (
                          <span key={tech} className="text-[10px] uppercase border border-[#D6D1C7] px-2 py-1 text-[#5D5A53] group-hover:border-[#2C2A26] transition-colors">{tech}</span>
                      ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WebXRShowcase;
