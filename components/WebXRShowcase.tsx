
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

interface WebXRShowcaseProps {
  onProjectClick: (project: Project) => void;
  onFeedbackClick: (project: Project) => void;
}

const WebXRShowcase: React.FC<WebXRShowcaseProps> = ({ onProjectClick, onFeedbackClick }) => {
  const [activeModels, setActiveModels] = useState<Set<string>>(new Set());
  const ModelViewer = 'model-viewer' as any;

  const handleLoadModel = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setActiveModels(prev => new Set(prev).add(projectId));
  };

  return (
    <section id="showcase" className="py-20 md:py-32 px-4 md:px-12 bg-[#F5F2EB]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col items-start mb-12 border-b border-[#D6D1C7] pb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-4">XR Reality Bridge</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">Interaktivní Projekty</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {PROJECTS.map((project) => (
            <div key={project.id} className="flex flex-col group">
              <div 
                className="w-full h-[300px] md:h-[450px] bg-[#EBE7DE] rounded-[2rem] overflow-hidden relative shadow-xl border border-[#D6D1C7] touch-none"
              >
                {activeModels.has(project.id) && project.modelUrl ? (
                  <ModelViewer
                    src={project.modelUrl}
                    auto-rotate
                    camera-controls
                    touch-action="none"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className="absolute inset-0 group" onClick={(e) => handleLoadModel(e, project.id)}>
                    <img src={project.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700" alt={project.name} />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <button className="bg-[#2C2A26] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-2xl group-hover:bg-indigo-600 transition-colors">
                          Aktivovat 3D Bridge
                       </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-8">
                <h3 className="text-2xl font-serif mb-2">{project.name}</h3>
                <p className="text-[#5D5A53] font-light text-sm mb-4 leading-relaxed">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.techStack.map(t => (
                    <span key={t} className="text-[10px] uppercase border border-[#D6D1C7] px-3 py-1 rounded-full text-[#A8A29E]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebXRShowcase;
