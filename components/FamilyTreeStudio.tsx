
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FamilyMember } from '../types';
import { parseFamilyHistory, verifyFamilyMember, analyzeDocumentImage } from '../services/geminiService';

interface FamilyTreeStudioProps {
  onBack: () => void;
}

interface TransformState {
  x: number;
  y: number;
  scale: number;
}

interface NodePosition {
  x: number;
  y: number;
  data: FamilyMember;
}

const FamilyTreeStudio: React.FC<FamilyTreeStudioProps> = ({ onBack }) => {
  const [story, setStory] = useState('');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'input' | 'visual'>('input');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  
  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);

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

  // --- Handlers ---

  const handleGenerate = async () => {
    if (!story.trim()) return;
    setLoading(true);
    try {
      const parsedMembers = await parseFamilyHistory(story);
      setMembers(parsedMembers);
      setViewMode('visual');
      setTransform({ x: 0, y: 100, scale: 0.8 });
    } catch (e) {
      alert("Chyba při analýze historie.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setAnalyzingDoc(true);
      try {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
              const base64 = (reader.result as string).split(',')[1];
              const extractedMembers = await analyzeDocumentImage(base64, file.type);
              
              // Simple Merge Logic: Add new members, link them if possible (Future: UI for merging)
              setMembers(prev => [...prev, ...extractedMembers]);
              if (viewMode === 'input') setViewMode('visual');
          };
      } catch (err) {
          console.error(err);
          alert("Nepodařilo se analyzovat dokument.");
      } finally {
          setAnalyzingDoc(false);
      }
  };

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

  const handleReset = () => {
      if(confirm("Opravdu chcete smazat celý rodokmen?")) {
          setMembers([]);
          localStorage.removeItem('myFamilyTree');
          setViewMode('input');
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

  // --- Graph Layout Calculation ---
  const layout = useMemo(() => {
    if (members.length === 0) return { nodes: [], edges: [] };

    // 1. Assign generations (simple DFS/BFS)
    const genMap = new Map<string, number>();
    const nodeMap = new Map<string, FamilyMember>();
    members.forEach(m => nodeMap.set(m.id, m));

    // Find roots (no parents in list)
    const roots = members.filter(m => !m.parents || m.parents.length === 0 || !m.parents.some(pid => nodeMap.has(pid)));
    
    // Fallback if circular or weird data
    if(roots.length === 0 && members.length > 0) roots.push(members[0]);

    const queue = roots.map(r => ({ id: r.id, gen: 0 }));
    const visited = new Set<string>();

    while(queue.length > 0) {
        const { id, gen } = queue.shift()!;
        if(visited.has(id)) continue;
        visited.add(id);
        genMap.set(id, gen);
        
        const m = nodeMap.get(id);
        if(m) {
            m.children.forEach(cid => {
                if(nodeMap.has(cid)) queue.push({ id: cid, gen: gen + 1 });
            });
            // Handle spouses - keep same generation
            m.spouses.forEach(sid => {
                 if(nodeMap.has(sid) && !visited.has(sid)) {
                     queue.push({ id: sid, gen: gen }); // Spouses same gen
                 }
            });
        }
    }

    // 2. Group by generation
    const levels: Record<number, FamilyMember[]> = {};
    let minGen = 0;
    let maxGen = 0;

    members.forEach(m => {
        const g = genMap.get(m.id) ?? 0;
        if (!levels[g]) levels[g] = [];
        levels[g].push(m);
        if(g < minGen) minGen = g;
        if(g > maxGen) maxGen = g;
    });

    // 3. Calculate Coordinates
    const NODE_WIDTH = 220;
    const NODE_HEIGHT = 120;
    const GAP_X = 40;
    const GAP_Y = 180;

    const nodes: NodePosition[] = [];
    const edges: { x1: number, y1: number, x2: number, y2: number, id: string }[] = [];

    // Simple layout: center rows
    for (let g = minGen; g <= maxGen; g++) {
        const rowMembers = levels[g];
        if(!rowMembers) continue;
        
        const rowWidth = rowMembers.length * (NODE_WIDTH + GAP_X) - GAP_X;
        let startX = -rowWidth / 2;

        rowMembers.forEach((m, idx) => {
            nodes.push({
                x: startX + idx * (NODE_WIDTH + GAP_X),
                y: g * (NODE_HEIGHT + GAP_Y),
                data: m
            });
        });
    }

    // 4. Create Edges
    const posMap = new Map<string, {x: number, y: number}>();
    nodes.forEach(n => posMap.set(n.data.id, { x: n.x + NODE_WIDTH/2, y: n.y + NODE_HEIGHT }));

    nodes.forEach(n => {
        const parentPos = posMap.get(n.data.id);
        if(!parentPos) return;

        n.data.children.forEach(cid => {
            const childNode = nodes.find(node => node.data.id === cid);
            if (childNode) {
                const childX = childNode.x + NODE_WIDTH/2;
                const childY = childNode.y; // Top of child node
                edges.push({
                    x1: parentPos.x,
                    y1: parentPos.y,
                    x2: childX,
                    y2: childY,
                    id: `${n.data.id}-${cid}`
                });
            }
        });
    });

    return { nodes, edges };

  }, [members]);

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
        
        <div className="flex items-center gap-3">
          {/* Document Upload */}
          <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={analyzingDoc}
             className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 rounded-full text-xs font-bold uppercase transition-all"
          >
             {analyzingDoc ? (
                 <span className="animate-pulse">Skenuji dokument...</span>
             ) : (
                 <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2} /></svg>
                    Nahrát Listinu
                 </>
             )}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

          {/* View Toggles */}
          <div className="flex bg-[#EBE7DE] rounded-full p-1 border border-[#D6D1C7]">
            <button 
                onClick={() => setViewMode('input')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${viewMode === 'input' ? 'bg-[#2C2A26] text-white' : 'text-[#A8A29E]'}`}
            >
                Příběh
            </button>
            <button 
                onClick={() => setViewMode('visual')}
                disabled={members.length === 0}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${viewMode === 'visual' ? 'bg-[#2C2A26] text-white' : 'text-[#A8A29E] disabled:opacity-30'}`}
            >
                Strom
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#EBE7DE]">
        {viewMode === 'input' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-fade-in-up">
            <div className="max-w-2xl w-full">
              <h2 className="text-3xl font-serif mb-6 text-center text-[#2C2A26]">Vyprávějte příběh své krve</h2>
              <textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Např.: Můj pradědeček Jan se narodil v roce 1890 v Praze. Měl manželku Marii a syna Karla..."
                className="w-full h-48 bg-white/50 border border-[#D6D1C7] p-6 rounded-2xl text-lg font-serif outline-none focus:border-[#2C2A26] transition-all resize-none shadow-inner mb-6 text-[#2C2A26] placeholder-[#A8A29E]"
              />
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !story.trim()}
                    className="py-4 bg-[#2C2A26] text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Generovat Strom"}
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="py-4 bg-white text-[#2C2A26] border border-[#D6D1C7] rounded-2xl font-bold uppercase tracking-widest shadow-sm hover:bg-[#F5F2EB] transition-all flex items-center justify-center gap-2"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2} /></svg>
                     Nahrát rodný list
                  </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none bg-[radial-gradient(#A8A29E_1px,transparent_1px)] [background-size:20px_20px] opacity-100"
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
              className="absolute transition-transform duration-75 ease-out will-change-transform origin-center"
              style={{ 
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                width: '100%',
                height: '100%'
              }}
            >
              {/* Center point of the universe */}
              <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
                  
                  {/* Edges Layer (SVG) */}
                  <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" style={{ transform: 'translate(0, 0)' }}>
                      {layout.edges.map(edge => (
                          <path 
                              key={edge.id}
                              d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${edge.y1 + 80}, ${edge.x2} ${edge.y2 - 80}, ${edge.x2} ${edge.y2}`}
                              fill="none"
                              stroke="#A8A29E"
                              strokeWidth="2"
                              opacity="0.6"
                          />
                      ))}
                  </svg>

                  {/* Nodes Layer */}
                  {layout.nodes.map(node => (
                      <div 
                          key={node.data.id}
                          onClick={() => setSelectedMember(node.data)}
                          className="absolute w-[220px] bg-[#F5F2EB] border border-[#D6D1C7] p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 hover:border-[#2C2A26] transition-all cursor-pointer group flex flex-col items-center text-center"
                          style={{ 
                              transform: `translate(${node.x}px, ${node.y}px)` 
                          }}
                      >
                          <div className="absolute -top-3 w-8 h-8 rounded-full bg-[#2C2A26] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                              {node.data.name.charAt(0)}
                          </div>
                          
                          <h3 className="font-serif text-lg font-bold truncate w-full mt-2 text-[#2C2A26]">{node.data.name}</h3>
                          <div className="w-full h-px bg-[#D6D1C7] my-2"></div>
                          <p className="text-[10px] text-[#A8A29E] uppercase tracking-widest mb-1">
                              {node.data.birthDate || '?' }
                          </p>
                          <p className="text-[10px] text-[#5D5A53]">
                              {node.data.birthPlace}
                          </p>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Tool Controls */}
        {viewMode === 'visual' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-[#2C2A26] p-2 rounded-2xl shadow-2xl border border-white/10 z-10">
            <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }))} className="p-3 text-white hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} /></svg>
            </button>
            <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.2) }))} className="p-3 text-white hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth={2} /></svg>
            </button>
            <button onClick={() => setTransform({ x: 0, y: 0, scale: 0.8 })} className="p-3 text-white hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4h16v16H4z" strokeWidth={2} /></svg>
            </button>
            <div className="w-px bg-white/20 mx-1"></div>
            <button onClick={handleReset} className="p-3 text-red-400 hover:bg-white/10 rounded-xl" title="Smazat">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)} />
          <div className="relative bg-[#F5F2EB] w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up border border-[#D6D1C7] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-2 text-[#A8A29E] hover:text-[#2C2A26]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={1.5} /></svg>
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mb-2 block">Dohledaný předek</span>
            <h2 className="text-4xl font-serif text-[#2C2A26] mb-4">{selectedMember.name}</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-[#EBE7DE] px-4 py-2 rounded-xl text-xs font-bold text-[#5D5A53]">
                Narozen: {selectedMember.birthDate || 'Neznámo'}
              </div>
              <div className="bg-[#EBE7DE] px-4 py-2 rounded-xl text-xs font-bold text-[#5D5A53]">
                Místo: {selectedMember.birthPlace || 'Neznámo'}
              </div>
            </div>
            
            {selectedMember.bio && (
                <p className="text-[#5D5A53] leading-relaxed mb-8 font-light italic border-l-2 border-[#2C2A26] pl-4">
                    "{selectedMember.bio}"
                </p>
            )}
            
            <div className="bg-[#2C2A26] p-6 rounded-3xl text-white">
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                Matriční rešerše (Google Grounding)
              </h4>
              <p className="text-xs text-white/60 mb-4">
                  AI prohledá dostupné online rejstříky a historické kontexty pro tuto osobu.
              </p>
              {!verificationResult ? (
                <button 
                  onClick={() => handleVerify(selectedMember)}
                  disabled={verifying}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifying ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        Analyzuji archivy...
                      </>
                  ) : "Dohledat v matrikách"}
                </button>
              ) : (
                <div className="text-[11px] leading-relaxed opacity-90 animate-fade-in-up bg-black/20 p-3 rounded-xl border border-white/5">
                  {typeof verificationResult === 'string' ? verificationResult : "Data nalezena."}
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
