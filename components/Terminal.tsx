/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

// Types
interface DetectedNode {
  ip: string;
  os: string;
  vendor: string;
  uptime: string;
  connection: 'WIFI' | 'ETHERNET';
  status: 'ACTIVE' | 'IDLE';
  flowUp?: number;
  flowDown?: number;
}

// Icons Components
const Icons = {
  Wifi: () => (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  Ethernet: () => (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
};

// Helper function
const resolveDevice = (ip: string): Partial<DetectedNode> => {
  const vendors = ['Apple Inc.', 'Espressif', 'Ubiquiti', 'Intel Corp', 'Synology', 'Sonos', 'Philips Hue'];
  const osList = [
    'macOS 14.4 (Sonoma)', 
    'Ubuntu 22.04 LTS', 
    'Windows 11 Pro', 
    'FreeRTOS v10', 
    'Debian GNU/Linux 12', 
    'iOS 17.4', 
    'Android 14',
    'Synology DSM 7.2'
  ];
  
  return {
    ip,
    connection: Math.random() > 0.4 ? 'WIFI' : 'ETHERNET',
    uptime: `${Math.floor(Math.random() * 45)}d ${Math.floor(Math.random() * 23)}h`,
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    os: osList[Math.floor(Math.random() * osList.length)]
  };
};

// --- Internal Component: NetworkScanner (CLI Version) ---
const NetworkScanner: React.FC = () => {
  const [devices, setDevices] = useState<DetectedNode[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(true);

  // Simulation: Progressive Discovery
  useEffect(() => {
    const ipsToScan = [
      '192.168.1.1',
      '192.168.1.14',
      '192.168.1.55',
      '192.168.1.88', // User
      '192.168.1.102',
      '192.168.1.145'
    ];

    let currentIndex = 0;
    const scanInterval = setInterval(() => {
      if (currentIndex >= ipsToScan.length) {
        clearInterval(scanInterval);
        setScanning(false);
        return;
      }
      
      const ip = ipsToScan[currentIndex];
      const baseInfo = resolveDevice(ip);
      
      setDevices(prev => [...prev, {
        ...baseInfo,
        flowUp: Math.floor(Math.random() * 50),
        flowDown: Math.floor(Math.random() * 200),
        status: 'ACTIVE'
      } as DetectedNode]);
      
      setProgress(Math.round(((currentIndex + 1) / ipsToScan.length) * 100));
      currentIndex++;
    }, 400);

    return () => clearInterval(scanInterval);
  }, []);

  return (
    <div className="flex flex-col gap-2 mt-2 mb-4 font-mono text-[10px] md:text-xs animate-fade-in-up w-full overflow-hidden">
      {/* Scan Progress Bar */}
      {scanning && (
        <div className="flex items-center gap-3 mb-4 text-indigo-300">
           <span className="animate-pulse">SCANNING SUBNET 192.168.1.0/24</span>
           <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
           </div>
           <span>{progress}%</span>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-12 border-b border-indigo-500/30 pb-2 text-indigo-400 font-bold uppercase tracking-wider mb-1 px-2">
        <span className="col-span-1">TYPE</span>
        <span className="col-span-3">IP ADDRESS</span>
        <span className="col-span-3 hidden sm:block">OS DETAIL</span>
        <span className="col-span-3 sm:col-span-2">VENDOR</span>
        <span className="col-span-3 sm:col-span-2 text-right">UPTIME</span>
        <span className="col-span-2 sm:col-span-1 text-right">STAT</span>
      </div>

      {/* Rows */}
      {devices.map((d) => (
        <div key={d.ip} className="grid grid-cols-12 text-slate-300 hover:bg-white/5 py-1.5 px-2 rounded transition-colors border-l-2 border-transparent hover:border-indigo-500/50 items-center">
          <span className="col-span-1 flex items-center gap-2" title={d.connection}>
            {d.connection === 'WIFI' ? <Icons.Wifi /> : <Icons.Ethernet />}
          </span>
          <span className="col-span-3 text-emerald-400/90 font-mono tracking-tight">{d.ip}</span>
          <span className="col-span-3 hidden sm:block opacity-70 font-mono text-[9px] truncate" title={d.os}>{d.os}</span>
          <span className="col-span-3 sm:col-span-2 truncate opacity-80 text-[9px] uppercase">{d.vendor}</span>
          <span className="col-span-3 sm:col-span-2 text-right font-mono text-indigo-300/80">
            {d.uptime}
          </span>
          <span className={`col-span-2 sm:col-span-1 text-right font-bold text-[9px] uppercase tracking-wider ${d.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-600'}`}>
            {d.status === 'ACTIVE' ? 'ACT' : 'IDL'}
          </span>
        </div>
      ))}
      
      {!scanning && (
        <div className="mt-3 pt-2 border-t border-white/5 text-indigo-300/50 text-[9px] flex justify-between">
           <span>Scan complete. {devices.length} devices found. Security protocols active.</span>
        </div>
      )}
    </div>
  );
};

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
    onToggleSnow: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose, onToggleSnow }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
            <div className="bg-[#1e1e1e] w-full max-w-[800px] h-[600px] max-h-[80vh] rounded-lg shadow-2xl border border-gray-700 flex flex-col pointer-events-auto font-mono text-xs overflow-hidden animate-fade-in-up">
                {/* Title Bar */}
                <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-gray-700 select-none">
                    <div className="flex gap-2">
                        <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={onClose} aria-label="Close"></button>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer"></div>
                    </div>
                    <div className="text-gray-400 font-medium text-[10px] md:text-xs">TopBot Terminal — bash — 80x24</div>
                    <div className="w-10"></div>
                </div>
                
                {/* Terminal Body */}
                <div className="flex-1 bg-[#1e1e1e] p-4 text-gray-300 overflow-y-auto font-mono" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-4 text-emerald-500">
                        Welcome to TopBot.PwnZ Interactive Terminal v2.0.4<br/>
                        System is ready.
                    </div>

                    <NetworkScanner />
                    
                    {/* Input Area */}
                    <div className="flex gap-2 items-center mt-4">
                        <span className="text-emerald-500">➜</span>
                        <span className="text-blue-400">~</span>
                        <input 
                            type="text" 
                            className="bg-transparent border-none outline-none text-gray-200 flex-1 focus:ring-0 placeholder-gray-600"
                            autoFocus
                            placeholder="Type 'snow' or 'exit'..."
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') {
                                    const val = e.currentTarget.value.trim().toLowerCase();
                                    if(val === 'snow') {
                                        onToggleSnow();
                                        e.currentTarget.value = '';
                                    } else if(val === 'exit') {
                                        onClose();
                                    } else {
                                        e.currentTarget.value = '';
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terminal;