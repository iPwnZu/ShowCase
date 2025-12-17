
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import SnowEffect from './components/SnowEffect';

function App() {
  const [blink, setBlink] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [snowing, setSnowing] = useState(false);

  // Simple blinking cursor effect for the landing text
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(b => !b);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle keyboard shortcut global listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Backtick ` or Ctrl+Space
      if (e.key === '`' || (e.ctrlKey && e.code === 'Space')) {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#1a1a1a] font-mono text-[#F5F2EB] selection:bg-[#F5F2EB] selection:text-[#1a1a1a] flex flex-col items-center justify-center p-4 cursor-pointer relative overflow-hidden"
      onClick={() => !terminalOpen && setTerminalOpen(true)}
    >
      
      {/* Snow Effect Layer */}
      {snowing && <SnowEffect />}

      {/* The Interactive Terminal */}
      <Terminal 
        isOpen={terminalOpen} 
        onClose={() => setTerminalOpen(false)} 
        onToggleSnow={() => setSnowing(prev => !prev)}
      />
      
      {/* Minimal Landing UI (Background/Fallback) */}
      <div className="max-w-2xl w-full space-y-8 z-0">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
            TopBot.PwnZ™
          </h1>
          <p className="text-sm md:text-base text-gray-500 uppercase tracking-[0.2em]">
            Senior Architecture // AI Integration
          </p>
        </div>

        <div className="border-l-2 border-cyan-500/50 pl-6 py-2 space-y-4">
          <p className="text-lg md:text-xl text-gray-300 font-light">
            Initialize Workspace.
          </p>
          <div className="inline-block bg-black/50 border border-gray-700 rounded px-4 py-2 group-hover:border-cyan-500/50 transition-colors">
            <p className="text-sm text-cyan-500 font-bold">
              <span className="hidden md:inline">Press <span className="px-1.5 py-0.5 bg-gray-700 text-white rounded mx-1">`</span> or <span className="px-1.5 py-0.5 bg-gray-700 text-white rounded mx-1">Ctrl + Space</span></span>
              <span className="md:hidden">Tap anywhere</span> to access terminal
              <span className={`${blink ? 'opacity-100' : 'opacity-0'} ml-1`}>_</span>
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full text-center text-[10px] text-gray-600 uppercase tracking-widest">
           František Kalášek &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default App;
