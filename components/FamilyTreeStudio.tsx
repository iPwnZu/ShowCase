
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FamilyMember } from '../types';
import { parseFamilyHistory, verifyFamilyMember } from '../services/geminiService';

interface FamilyTreeStudioProps {
  onBack: () => void;
}

interface TransformState {
  x: number;
  y: number;
  scale: number;
}

const FamilyTreeStudio: React.FC<FamilyTreeStudioProps> = ({ onBack }) => {
  const [story, setStory] = useState('');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'input' | 'visual'>('input');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  // Pan & Zoom State
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 0.8 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('myFamilyTree');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
          setViewMode('visual');
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('myFamilyTree', JSON.stringify(members));
  }, [members]);

  const handleGenerate = async () => {
    if (!story.trim()) return;
    setLoading(true);
    try {
      const parsedMembers = await parseFamilyHistory(story);
      setMembers(parsedMembers);
      setViewMode('visual');
      setTransform({ x: 0, y: 0, scale: 0.8 });
    } catch (e) {
      alert("Chyba při analýze historie.");
    } finally {
      setLoading(false);
    }
  };

  // --- Pan & Zoom Logic ---
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'visual') return;
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(transform.scale + delta, 0.2), 2);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'visual') return;
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { isDragging.current = false; };

  // Mobile Touch Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDist.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastMousePos.current.x;
      const dy = e.touches[0].clientY - lastMousePos.current.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - lastPinchDist.current) * 0.01;
      const newScale = Math.min(Math.max(transform.scale + delta, 0.2), 2);
      setTransform(prev => ({ ...prev, scale: newScale }));
      lastPinchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    lastPinchDist.current = null;
  };

  const graphData = useMemo(() => {
    const map = new Map<string, FamilyMember>();
    members.forEach(m => map.set(m.id, m));
    const levels: Record<string, FamilyMember[]> = {};
    const assignGen = (id: string, gen: number) => {
      const m = map.get(id);
      if (!m) return;
      if (!levels[gen]) levels[gen] = [];
      if (!levels[gen].find(x => x.id === id)) levels[gen].push(m);
      m.children.forEach(c => assignGen(c, gen + 1));
    };
    const roots = members.filter(n => !n.parents.some(p => map.has(p)));
    roots.forEach(r => assignGen(r.id, 0));
    return { levels, map };
  }, [members]);

  const handleVerify = async (member: FamilyMember) => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyFamilyMember(member);
      setVerificationResult(result);
    } catch (e) {
      setVerificationResult("Ověření se nezdařilo.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#F5F2EB] flex flex-col font-sans select-none overflow-hidden">
      {/* Dynamic Header */}
      <div className="z-50 bg-[#F5F2EB]/90 backdrop-blur-md border-b border-[#D6D1C7] px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2} /></svg>
          </button>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#2C2A26]">LifeBridge Studio</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#A8A29E]">Spatial Genealogy AI</p>
          </div>
        </div>
        
        <div className="flex bg-[#EBE7DE] rounded-full p-1 border border-[#D6D1C7]">
          <button 
            onClick={() => setViewMode('input')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${viewMode === 'input' ? 'bg-[#2C2A26] text-white' : 'text-[#A8A29E]'}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setViewMode('visual')}
            disabled={members.length === 0}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${viewMode === 'visual' ? 'bg-[#2C2A26] text-white' : 'text-[#A8A29E] disabled:opacity-30'}`}
          >
            Canvas
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#EBE7DE]">
        {viewMode === 'input' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-fade-in-up">
            <div className="max-w-2xl w-full">
              <h2 className="text-3xl font-serif mb-6 text-center">Vyprávějte příběh své krve</h2>
              <textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Např.: Můj pradědeček Jan se narodil v roce 1890 v Praze..."
                className="w-full h-48 bg-white/50 border border-[#D6D1C7] p-6 rounded-2xl text-lg font-serif outline-none focus:border-[#2C2A26] transition-all resize-none shadow-inner mb-6"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !story.trim()}
                className="w-full py-4 bg-[#2C2A26] text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Inicializovat Most"}
              </button>
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="absolute transition-transform duration-75 ease-out will-change-transform"
              style={{ 
                transform: `translate(calc(50% + ${transform.x}px), calc(50% + ${transform.y}px)) scale(${transform.scale})`,
                transformOrigin: '0 0'
              }}
            >
              <div className="flex flex-col items-center gap-32">
                {Object.entries(graphData.levels).sort((a,b) => Number(a[0]) - Number(b[0])).map(([gen, genMembers]) => (
                  <div key={gen} className="flex gap-12">
                    {/* Explicitly cast genMembers to FamilyMember[] to resolve the 'unknown' type error from Object.entries */}
                    {(genMembers as FamilyMember[]).map(m => (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedMember(m)}
                        className="w-56 bg-[#F5F2EB] border border-[#D6D1C7] p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
                      >
                        <div className="h-1.5 w-12 bg-[#2C2A26]/10 group-hover:bg-indigo-500 rounded-full mb-4 transition-colors"></div>
                        <h3 className="font-serif text-lg font-bold truncate">{m.name}</h3>
                        <p className="text-[10px] text-[#A8A29E] uppercase tracking-widest mb-2">
                          {m.birthDate || '?' } — {m.deathDate || '...'}
                        </p>
                        <p className="text-xs text-[#5D5A53] line-clamp-2 italic">"{m.bio?.substring(0, 60)}..."</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Tool Controls */}
        {viewMode === 'visual' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-[#2C2A26] p-2 rounded-2xl shadow-2xl border border-white/10">
            <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }))} className="p-3 text-white hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} /></svg>
            </button>
            <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.2) }))} className="p-3 text-white hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth={2} /></svg>
            </button>
            <button onClick={() => setTransform({ x: 0, y: 0, scale: 0.8 })} className="p-3 text-white hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4h16v16H4z" strokeWidth={2} /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)} />
          <div className="relative bg-[#F5F2EB] w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up border border-[#D6D1C7]">
            <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-2 text-[#A8A29E] hover:text-[#2C2A26]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={1.5} /></svg>
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mb-2 block">Dohledaný předek</span>
            <h2 className="text-4xl font-serif text-[#2C2A26] mb-4">{selectedMember.name}</h2>
            <div className="flex gap-4 mb-6">
              <div className="bg-[#EBE7DE] px-4 py-2 rounded-xl text-xs font-bold text-[#5D5A53]">
                Born: {selectedMember.birthPlace || 'Unknown'}
              </div>
            </div>
            <p className="text-[#5D5A53] leading-relaxed mb-8 font-light italic">"{selectedMember.bio}"</p>
            
            <div className="bg-[#2C2A26] p-6 rounded-3xl text-white">
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                Real-World Link (Search Grounding)
              </h4>
              {!verificationResult ? (
                <button 
                  onClick={() => handleVerify(selectedMember)}
                  disabled={verifying}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {verifying ? "Searching Repositories..." : "Dohledat v matrikách a archivu"}
                </button>
              ) : (
                <div className="text-[11px] leading-relaxed opacity-90 animate-fade-in-up">
                  {typeof verificationResult === 'string' ? verificationResult : "Data nalezena v externích registrech."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeStudio;
