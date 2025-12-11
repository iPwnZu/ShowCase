
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Project } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface AssistantProps {
  currentContext: string;
  activeProject?: Project; // Prop for deep contextual suggestions
  onNavigate: (sectionId: string) => void;
  initialMessage?: string; // Allow triggering with a message
  forceOpen?: boolean;     // Allow opening from parent
}

const Assistant: React.FC<AssistantProps> = ({ currentContext, activeProject, onNavigate, initialMessage, forceOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Dobrý den! Jsem AI asistent Františka Kaláška. Mohu provést technickou analýzu projektů, diskutovat o architektuře nebo vás navigovat. Jak vám mohu pomoci?', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle external triggers (like "Ask AI" button in projects)
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  useEffect(() => {
    if (initialMessage && isOpen) {
       // Only send if it's a new request (simple check to avoid loops, in production use ID)
       const lastMsg = messages[messages.length - 1];
       if (lastMsg.role !== 'user' || lastMsg.text !== initialMessage) {
           handleSend(initialMessage);
       }
    }
  }, [initialMessage, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isThinking]);

  // Dynamic suggestions based on context string and active project
  const getSuggestions = () => {
      // 1. Detailed Project Context
      if (activeProject) {
          const tech = activeProject.techStack[0];
          return [
              `Proč jsi použil ${tech}?`,
              `Architektura: ${activeProject.name}?`,
              `Výzvy v kategorii ${activeProject.category}?`,
              `Business hodnota?`
          ];
      }

      // 2. Section Context
      if (currentContext.includes('WebXR') || currentContext.includes('showcase')) {
          return ["Nejnovější WebXR projekt?", "Vysvětli rozdíl WebGL vs WebXR", "Ukaž mi AI projekty"];
      }
      if (currentContext.includes('Kontakt')) {
          return ["Jaká je dostupnost?", "Kde František sídlí?", "Spolupráce na projektu"];
      }
      
      // 3. General / Home
      return ["Kdo je František?", "Shrň dovednosti", "Naviguj na Kontakt", "Co je WebXR?"];
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const response = await sendMessageToGemini(history, userMsg.text, currentContext);
      
      if (response.toolCalls && response.toolCalls.length > 0) {
        response.toolCalls.forEach(call => {
          if (call.name === 'navigateToSection' && call.args.sectionId) {
             onNavigate(call.args.sectionId);
             // On mobile, maybe close chat after navigation to show content? 
             // Keeping it open for now for continuity.
          }
        });
      }

      const aiMsg: ChatMessage = { 
        role: 'model', 
        text: response.text, 
        timestamp: Date.now(),
        sources: response.sources
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, { role: 'model', text: "Omlouvám se, došlo k chybě při komunikaci.", timestamp: Date.now() }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end font-sans w-full sm:w-auto pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-[#F5F2EB] w-full sm:w-[380px] h-[85vh] sm:h-[600px] flex flex-col overflow-hidden border-t sm:border border-[#D6D1C7] shadow-2xl sm:rounded-sm animate-slide-up-fade">
          {/* Header */}
          <div className="bg-[#2C2A26] p-4 sm:p-5 border-b border-[#D6D1C7] flex justify-between items-center text-[#F5F2EB]">
            <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-2 h-2 bg-[#F5F2EB] rounded-full animate-pulse"></div>
                   <div className="absolute top-0 left-0 w-2 h-2 bg-[#F5F2EB] rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="flex flex-col">
                    <span className="font-serif italic text-lg leading-none">AI Concierge</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#A8A29E]">Powered by Gemini</span>
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="text-[#A8A29E] hover:text-white transition-colors p-2 -mr-2"
                aria-label="Zavřít chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F5F2EB]" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                <div 
                  className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#EBE7DE] text-[#2C2A26] border border-[#D6D1C7]' 
                      : 'bg-white text-[#5D5A53] border border-[#EBE7DE]'
                  }`}
                >
                  {msg.text}
                </div>
                
                {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-col items-start gap-1 max-w-[85%]">
                     <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] pl-1">Zdroje (Google Maps):</span>
                     {msg.sources.map((source, sIdx) => (
                       <a 
                          key={sIdx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-white border border-[#D6D1C7] px-3 py-2 text-xs text-[#2C2A26] hover:bg-[#EBE7DE] transition-colors w-full"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#A8A29E]">
                           <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                         </svg>
                         <span className="truncate">{source.title}</span>
                       </a>
                     ))}
                  </div>
                )}
              </div>
            ))}
            {isThinking && (
               <div className="flex justify-start">
                 <div className="bg-white border border-[#EBE7DE] p-4 flex gap-1 items-center shadow-sm">
                   <div className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
            )}
          </div>

          {/* Suggestions & Input Area */}
          <div className="bg-[#F5F2EB] border-t border-[#D6D1C7] pb-safe-area-bottom">
            {/* Smart Suggestions */}
            <div className="px-4 sm:px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar mask-gradient touch-pan-x">
                {getSuggestions().map((sugg, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(sugg)}
                        disabled={isThinking}
                        className="flex-shrink-0 px-3 py-2 bg-[#EBE7DE] hover:bg-[#2C2A26] hover:text-[#F5F2EB] border border-[#D6D1C7] text-xs font-medium text-[#5D5A53] transition-colors rounded-full"
                    >
                        {sugg}
                    </button>
                ))}
            </div>

            <div className="p-4 sm:p-5 pt-0">
                <div className="flex gap-2 relative">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Zeptejte se..." 
                    className="flex-1 bg-white border border-[#D6D1C7] focus:border-[#2C2A26] px-4 py-3 text-base sm:text-sm outline-none transition-colors placeholder-[#A8A29E] text-[#2C2A26] rounded-none appearance-none"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isThinking}
                    className="bg-[#2C2A26] text-[#F5F2EB] px-5 hover:bg-[#444] transition-colors disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className={`pointer-events-auto p-4 sm:p-0 ${isOpen ? 'hidden sm:block' : 'block'}`}>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#2C2A26] text-[#F5F2EB] w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:scale-105 transition-all duration-500 border border-[#F5F2EB]/20 group relative"
            aria-label={isOpen ? "Zavřít asistenta" : "Otevřít asistenta"}
        >
            {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            ) : (
                <>
                    <span className="font-serif italic text-lg group-hover:scale-110 transition-transform">Ai</span>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8A29E] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default Assistant;
