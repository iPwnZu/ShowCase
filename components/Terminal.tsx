
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BRAND_NAME, EMAIL, SOCIAL_LINKS } from '../constants';
import { analyzeNetworkNode } from '../services/geminiService';

// --- Types & Interfaces ---

interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'component' | 'error';
  content: React.ReactNode;
}

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSnow: () => void;
}

type SystemTab = 'TERMINAL' | 'IDENTITY' | 'NETWORK';

interface ScannedDevice {
  id: string;
  lat: number;
  lon: number;
  hostname: string;
  status: 'Online' | 'Offline';
  latency: number;
  packetLoss: number;
  location: string;
  isUser?: boolean;
}

interface TrafficLog {
  id: string;
  source: string;
  dest: string;
  size: string;
  status: 'Success' | 'Dropped';
  timestamp: string;
}

const Icons = {
  Terminal: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Cpu: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>,
  Database: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
  Verify: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
};

// --- Sub-Component: Identity View ---
const IdentityView: React.FC = () => {
    const [systemInfo, setSystemInfo] = useState<any>(null);
    const [scanning, setScanning] = useState(true);
    const [uptime, setUptime] = useState('00:00:00:00');
    const [cpuLoad, setCpuLoad] = useState(12);

    useEffect(() => {
        // Define a static start time for this session (simulated long-term uptime)
        const sessionStartTime = Date.now() - (Math.random() * 86400000 * 5); // Randomly 1-5 days ago
        
        const fetchHardwareData = async () => {
            let storageData = { quota: 'N/A', usage: 'N/A', percent: 0, rawQuota: 0 };
            try {
                if (navigator.storage && navigator.storage.estimate) {
                    const estimate = await navigator.storage.estimate();
                    if (estimate.quota !== undefined && estimate.usage !== undefined) {
                        const qGb = (estimate.quota / (1024 ** 3)).toFixed(2);
                        const uGb = (estimate.usage / (1024 ** 3)).toFixed(2);
                        storageData = { 
                          quota: `${qGb} GB`, 
                          usage: `${uGb} GB`, 
                          rawQuota: estimate.quota,
                          percent: Math.round((estimate.usage / estimate.quota) * 100) 
                        };
                    }
                }
            } catch (e) { console.error(e); }

            let batteryInfo = 'AC Connection';
            try {
                if ((navigator as any).getBattery) {
                    const battery = await (navigator as any).getBattery();
                    batteryInfo = `${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})`;
                }
            } catch (e) { }

            setSystemInfo({
                user: { name: 'František Kalášek', nickname: 'pwnz-admin', role: 'Chief Architect', node: 'CZ-BRNO-54' },
                hardware: { 
                  cores: navigator.hardwareConcurrency || 'N/A', 
                  memory: (performance as any).memory ? `${Math.round((performance as any).memory.jsHeapSizeLimit / (1024 ** 2))} MB` : 'Dynamic', 
                  platform: navigator.platform, 
                  arch: navigator.userAgent.includes('x64') ? 'x86_64' : navigator.userAgent.includes('arm') ? 'arm64' : 'Universal',
                  resolution: `${window.screen.width}x${window.screen.height}`,
                  gpu: 'WebGL 2.0 (High Performance)'
                },
                storage: storageData,
                browser: { 
                  name: navigator.userAgent.split(') ')[1]?.split(' ')[0] || 'Chromium-based', 
                  lang: navigator.language,
                  online: navigator.onLine ? 'ESTABLISHED' : 'DISCONNECTED'
                }
            });
            setScanning(false);
        };

        const interval = setInterval(() => {
            const diff = Date.now() - sessionStartTime;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            setUptime(`${days}d ${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);
            
            // Random jitter for CPU load
            setCpuLoad(prev => {
              const jitter = Math.random() * 4 - 2;
              return Math.max(5, Math.min(95, Math.round(prev + jitter)));
            });
        }, 1000);

        fetchHardwareData();
        return () => clearInterval(interval);
    }, []);

    if (scanning) return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border border-indigo-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-2 border-transparent border-t-indigo-400 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border border-indigo-500/10 rounded-full animate-pulse"></div>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-indigo-400/60 animate-pulse">Synchronizing Telemetry...</div>
        </div>
    );

    return (
        <div className="p-8 md:p-14 h-full overflow-y-auto no-scrollbar animate-fade-in-up bg-gradient-to-b from-transparent to-indigo-950/5">
            {/* Top Identity Bar */}
            <div className="flex flex-col md:flex-row items-center gap-10 mb-14 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                <div className="w-28 h-28 rounded-[2rem] border-2 border-indigo-500/20 p-1.5 bg-indigo-500/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                    <Icons.User />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-[#0a0a14] flex items-center justify-center shadow-lg">
                        <Icons.Verify />
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-serif text-white mb-2 tracking-tight">{systemInfo.user.name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                        <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-300 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">{systemInfo.user.nickname}</span>
                        <span className="px-4 py-1.5 bg-white/5 text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/5">{systemInfo.user.role}</span>
                        <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">Node: {systemInfo.user.node}</span>
                    </div>
                </div>
                <div className="md:ml-auto text-right">
                    <span className="block text-[8px] font-bold uppercase tracking-[0.4em] text-indigo-400/60 mb-2">SYSTEM UPTIME</span>
                    <span className="text-3xl font-mono text-white/90 tracking-tighter">{uptime}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* CPU Metrics */}
                <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all hover:border-indigo-500/20">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Process Load</span>
                        <Icons.Cpu />
                    </div>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-5xl font-mono text-white">{cpuLoad}</span>
                        <span className="text-sm font-mono text-white/20">%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700 ease-out" style={{ width: `${cpuLoad}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest mt-4">
                        <span>Idle</span>
                        <span>Peak Capacity</span>
                    </div>
                </div>

                {/* Storage Diagnostics */}
                <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all hover:border-emerald-500/20">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Quota Usage</span>
                        <Icons.Database />
                    </div>
                    <div className="flex flex-col gap-1 mb-6">
                        <span className="text-4xl font-mono text-white">{systemInfo.storage.usage}</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">of {systemInfo.storage.quota} allocated</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-in-out" style={{ width: `${systemInfo.storage.percent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest mt-4">
                        <span>{systemInfo.storage.percent}% Consumption</span>
                        <span>Persistent Store</span>
                    </div>
                </div>

                {/* Environment Table */}
                <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 lg:col-span-1">
                    <span className="block text-[8px] font-bold uppercase tracking-[0.4em] text-indigo-400 mb-6">ENVIRONMENTALS</span>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Architecture</span>
                            <span className="text-xs font-mono text-white">{systemInfo.hardware.arch}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Native Platform</span>
                            <span className="text-xs font-mono text-white truncate max-w-[120px]">{systemInfo.hardware.platform}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Resolution</span>
                            <span className="text-xs font-mono text-white">{systemInfo.hardware.resolution}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Uplink Status</span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${systemInfo.browser.online === 'ESTABLISHED' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {systemInfo.browser.online}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hardware Footer Info */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-black/20 border border-white/5">
                <div>
                    <span className="block text-[8px] text-white/20 uppercase font-bold mb-1">Processor Cores</span>
                    <span className="text-xs text-white/80 font-mono">{systemInfo.hardware.cores} Logical Units</span>
                </div>
                <div>
                    <span className="block text-[8px] text-white/20 uppercase font-bold mb-1">Assigned Heap</span>
                    <span className="text-xs text-white/80 font-mono">{systemInfo.hardware.memory}</span>
                </div>
                <div>
                    <span className="block text-[8px] text-white/20 uppercase font-bold mb-1">Engine Language</span>
                    <span className="text-xs text-white/80 font-mono">{systemInfo.browser.lang}</span>
                </div>
                <div>
                    <span className="block text-[8px] text-white/20 uppercase font-bold mb-1">Rendering Pipeline</span>
                    <span className="text-xs text-white/80 font-mono">{systemInfo.hardware.gpu}</span>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Network View ---
const NetworkView: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [logs, setLogs] = useState<TrafficLog[]>([]);
    const mountRef = useRef<HTMLDivElement>(null);
    const packetsRef = useRef<{ mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number; dropped: boolean }[]>([]);

    const infraNodes: ScannedDevice[] = [
        { id: 'aws-va', lat: 38.0293, lon: -78.4767, hostname: 'AWS-VIRGINIA', status: 'Online', latency: 98, packetLoss: 0.02, location: 'Virginia, USA' },
        { id: 'gcp-eu', lat: 50.1109, lon: 8.6821, hostname: 'GCP-FRANKFURT', status: 'Online', latency: 22, packetLoss: 0.01, location: 'Frankfurt, DE' },
        { id: 'azure-hk', lat: 22.3193, lon: 114.1694, hostname: 'AZURE-HONGKONG', status: 'Online', latency: 245, packetLoss: 0.08, location: 'Hong Kong, HK' }
    ];

    useEffect(() => {
        // Geolocation from IP (Privacy-friendly, no permission dialog)
        fetch('http://ip-api.com/json/')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserData(data);
                    handleAIAnalysis(data);
                } else {
                    setUserData({ query: '127.0.0.1', city: 'Isolated Enclave', country: 'Localhost', lat: 50.0755, lon: 14.4378 });
                }
            })
            .catch(() => setUserData({ query: 'OFFLINE', city: 'Prague', country: 'CZ', lat: 50.0755, lon: 14.4378 }));
    }, []);

    const handleAIAnalysis = async (data: any) => {
        setAnalyzing(true);
        try {
            const result = await analyzeNetworkNode({ ip: data.query, city: data.city, country: data.country, lat: data.lat, lon: data.lon });
            setAnalysis(result);
        } catch (e) { console.error(e); }
        finally { setAnalyzing(false); }
    };

    useEffect(() => {
        if (!mountRef.current || !userData) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 15, 25);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        const globeRadius = 7.5;
        const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
        const globeMat = new THREE.MeshPhongMaterial({ color: 0x1e1b4b, emissive: 0x0a0a2a, wireframe: true, transparent: true, opacity: 0.2 });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        globeGroup.add(globe);

        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambient);
        const point = new THREE.PointLight(0x6366f1, 200, 100);
        point.position.set(10, 20, 10);
        scene.add(point);

        const latLonToVector = (lat: number, lon: number, radius: number) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        };

        const userPos = latLonToVector(userData.lat, userData.lon, globeRadius + 0.1);
        const userNode = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.8 }));
        userNode.position.copy(userPos);
        globeGroup.add(userNode);

        const nodes: Record<string, THREE.Vector3> = { 'user': userPos };
        infraNodes.forEach(node => {
            const pos = latLonToVector(node.lat, node.lon, globeRadius + 0.1);
            nodes[node.id] = pos;
            const m = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true }));
            m.position.copy(pos);
            globeGroup.add(m);

            // Arc line
            const mid = pos.clone().lerp(userPos, 0.5).normalize().multiplyScalar(globeRadius + 2.5);
            const curve = new THREE.QuadraticBezierCurve3(userPos, mid, pos);
            const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(25)), new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.1 }));
            globeGroup.add(line);
        });

        const spawnPacket = () => {
            const targetNode = infraNodes[Math.floor(Math.random() * infraNodes.length)];
            const target = nodes[targetNode.id];
            const toUser = Math.random() > 0.5;
            const start = toUser ? target.clone() : userPos.clone();
            const end = toUser ? userPos.clone() : target.clone();
            const isDropped = Math.random() < targetNode.packetLoss;
            const speed = 0.005 + (1 / targetNode.latency) * 0.4;

            const packet = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: isDropped ? 0xef4444 : 0x818cf8, transparent: true, opacity: 0.9 }));
            packet.position.copy(start);
            scene.add(packet);
            packetsRef.current.push({ mesh: packet, start, end, progress: 0, speed, dropped: isDropped });

            setLogs(prev => {
                const l: TrafficLog = { id: Math.random().toString(36).substr(2,9), source: toUser ? targetNode.hostname : 'USER_BRIDGE', dest: toUser ? 'USER_BRIDGE' : targetNode.hostname, size: (Math.floor(Math.random() * 1400) + 64) + 'B', status: isDropped ? 'Dropped' : 'Success', timestamp: new Date().toLocaleTimeString().split(' ')[0] };
                return [l, ...prev].slice(0, 10);
            });
        };

        let lastS = 0;
        const animate = (t: number) => {
            if (t - lastS > 700) { spawnPacket(); lastS = t; }
            globeGroup.rotation.y += 0.002;
            for (let i = packetsRef.current.length - 1; i >= 0; i--) {
                const p = packetsRef.current[i];
                p.progress += p.speed;
                if (p.dropped && p.progress > 0.6) { p.mesh.scale.multiplyScalar(0.9); (p.mesh.material as THREE.MeshBasicMaterial).opacity -= 0.1; }
                if (p.progress >= 1 || (p.dropped && (p.mesh.material as THREE.MeshBasicMaterial).opacity <= 0)) { scene.remove(p.mesh); packetsRef.current.splice(i, 1); }
                else { p.mesh.position.lerpVectors(p.start, p.end, p.progress); }
            }
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        return () => { if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement); renderer.dispose(); };
    }, [userData]);

    return (
        <div className="flex flex-col h-full animate-fade-in-up bg-[#0c0c1e]">
            <div className="h-[55%] relative border-b border-white/5 overflow-hidden">
                <div ref={mountRef} className="w-full h-full" />
                {!userData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] mt-4">Calibrating Flux...</span>
                    </div>
                ) : (
                    <div className="absolute top-6 left-6 p-4 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 flex flex-col gap-1">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Bridged Node Active</span></div>
                        <div className="text-xl font-mono text-indigo-400">{userData.query}</div>
                        <div className="text-[9px] text-white/30 uppercase tracking-tighter">{userData.city}, {userData.country}</div>
                    </div>
                )}
                {analyzing && <div className="absolute bottom-6 left-6 z-10"><span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Running Deep Packet Geolocation...</span></div>}
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-[60%] border-r border-white/5 p-6 overflow-y-auto no-scrollbar bg-slate-900/10">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-4 block">Neural Network Intel</span>
                    {analysis ? (
                        <div className="space-y-4 animate-fade-in-up">
                            <p className="text-xs text-white/60 leading-relaxed font-light italic">"{analysis.text}"</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {infraNodes.map(n => <div key={n.id} className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl"><div className="text-[9px] font-bold text-white mb-1">{n.hostname}</div><div className="text-[8px] text-white/30">{n.latency}ms</div></div>)}
                            </div>
                        </div>
                    ) : <div className="h-full flex items-center justify-center opacity-10 text-[10px] uppercase tracking-[0.4em]">Establishing Context</div>}
                </div>
                <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-black/30 font-mono">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-4 block">Traffic Flow Log</span>
                    <div className="space-y-1.5">
                        {logs.map(log => (
                            <div key={log.id} className="flex justify-between text-[9px] opacity-60 hover:opacity-100 transition-opacity">
                                <span className={log.status === 'Dropped' ? 'text-red-400' : 'text-emerald-400'}>[{log.status[0]}]</span>
                                <span className="text-indigo-200/50 truncate max-w-[55px]">{log.source}</span>
                                <span className="text-white/10">→</span>
                                <span className="text-indigo-200/50 truncate max-w-[55px]">{log.dest}</span>
                                <span className="text-white/20">{log.size}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Terminal Component ---
const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose, onToggleSnow }) => {
  const [activeTab, setActiveTab] = useState<SystemTab>('TERMINAL');
  const [inputLine, setInputLine] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: 'TopBot.Studio Shell v4.8.2-PRIME' },
    { type: 'system', content: 'Secure access established. User context: active.' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines, activeTab]);

  const handleCommand = (cmd: string) => {
      const clean = cmd.trim().toLowerCase();
      if (!clean) return;
      setLines(p => [...p, { type: 'input', content: cmd }]);
      
      if (clean === 'sudo rm -rf /') {
          setLines(p => [...p, { type: 'error', content: 'Permission denied: Operation not permitted on the root file system.' }]);
      } else if (clean === 'ls') {
          setLines(p => [...p, { type: 'output', content: (
            <div className="flex gap-6 py-1 text-indigo-400 font-mono">
                <span className="flex items-center gap-1"><Icons.Database /> whoami.txt</span>
                <span className="flex items-center gap-1">projects/</span>
                <span className="flex items-center gap-1 opacity-40">hidden.sys</span>
            </div>
          )}]);
      } else if (clean === 'whoami' || clean === 'cat whoami.txt') {
          setLines(p => [...p, { type: 'component', content: (
            <div className="py-6 animate-fade-in-up">
                <div className="max-w-xl bg-slate-900/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group hover:border-indigo-500/30 transition-all duration-500">
                    <div className="relative h-32 bg-gradient-to-r from-indigo-900 via-slate-900 to-black overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Identity Verified</span>
                        </div>
                    </div>
                    <div className="relative px-8 pb-8 -mt-16">
                        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                            <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-800">
                                <img 
                                    src="https://ik.imagekit.io/ipwnzu/IMG_0021(1).PNG?updatedAt=1763676215389" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt="František Kalášek" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
                            </div>
                            <div className="flex-1 pb-2">
                                <h3 className="text-3xl font-serif text-white mb-1 tracking-tight">František Kalášek</h3>
                                <div className="flex gap-3 items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Node-Admin // Architect</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[8px] uppercase tracking-widest text-white/30 block mb-2">Primary Uplink</span>
                                    <p className="text-xs text-indigo-200">{EMAIL}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[8px] uppercase tracking-widest text-white/30 block mb-2">Location Hub</span>
                                    <p className="text-xs text-indigo-200">Javorek, CZ (Central-EU)</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <span className="text-[8px] uppercase tracking-widest text-white/30 block mb-3">Core Expertise</span>
                                    <div className="space-y-2.5">
                                        {[
                                            { name: 'System Arch', val: 98 },
                                            { name: 'Neural Int', val: 95 },
                                            { name: 'XR Bridge', val: 92 }
                                        ].map(s => (
                                            <div key={s.name} className="flex flex-col gap-1.5">
                                                <div className="flex justify-between text-[9px]">
                                                    <span className="text-white/60">{s.name}</span>
                                                    <span className="text-indigo-400">{s.val}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full animate-progress" style={{ width: `${s.val}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center">
                            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">Social Flux:</span>
                            <div className="flex gap-4">
                                {SOCIAL_LINKS.slice(0, 4).map(s => (
                                    <a key={s.name} href={s.url} target="_blank" className="text-white/40 hover:text-indigo-400 transition-colors">
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{s.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          ) }]);
      } else if (clean === 'help') {
          setLines(p => [...p, { type: 'output', content: (
              <div className="flex flex-col gap-2 py-2 font-mono text-[10px]">
                  <div className="flex gap-4"><span className="w-16 text-indigo-400 font-bold">whoami</span><span>Access encrypted user profile</span></div>
                  <div className="flex gap-4"><span className="w-16 text-indigo-400 font-bold">identity</span><span>Display core hardware telemetry</span></div>
                  <div className="flex gap-4"><span className="w-16 text-indigo-400 font-bold">network</span><span>Global flux visualization</span></div>
                  <div className="flex gap-4"><span className="w-16 text-indigo-400 font-bold">ls</span><span>Enumerate local storage files</span></div>
                  <div className="flex gap-4"><span className="w-16 text-indigo-400 font-bold">clear</span><span>Purge terminal session data</span></div>
                  <div className="flex gap-4"><span className="w-16 text-indigo-400 font-bold">exit</span><span>Terminate shell environment</span></div>
              </div>
          )}]);
      } else if (clean === 'identity') setActiveTab('IDENTITY');
      else if (clean === 'network') setActiveTab('NETWORK');
      else if (clean === 'clear') setLines([]);
      else if (clean === 'exit') onClose();
      else setLines(p => [...p, { type: 'error', content: `Access Denied: Directive "${cmd}" not found in core binary.` }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative w-full max-w-6xl h-[92vh] md:h-[88vh] bg-[#0a0a14]/90 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col overflow-hidden ring-1 ring-white/10 animate-fade-in-up">
            <div className="h-16 flex items-center justify-between px-10 relative z-50 border-b border-white/5 bg-black/40">
                <div className="flex gap-3">
                    <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors border border-white/5" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50 border border-white/5" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-white/5" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/30 uppercase tracking-[0.8em] pointer-events-none flex items-center gap-3"><Icons.Terminal /> {BRAND_NAME}</div>
                <div className="hidden sm:flex items-center gap-3 text-[9px] font-bold text-white/10 tracking-widest uppercase">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                   Kernel: 4.8.2-Prime-LTS
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden p-6 md:p-8 pt-6">
                <div className="flex justify-center mb-8">
                    <div className="bg-black/40 p-1.5 rounded-2xl flex gap-1 border border-white/5">
                        {(['TERMINAL', 'IDENTITY', 'NETWORK'] as SystemTab[]).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative z-10 ${activeTab === tab ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
                                {tab}{activeTab === tab && <div className="absolute inset-0 bg-indigo-500/10 rounded-xl -z-10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] animate-fade-in-up"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 bg-black/60 rounded-[3rem] border border-white/5 overflow-hidden shadow-inner relative ring-1 ring-inset ring-white/5">
                    {activeTab === 'TERMINAL' && (
                        <div className="h-full p-10 md:p-14 font-mono text-sm overflow-y-auto no-scrollbar scroll-smooth" onClick={() => document.getElementById('studio-cli')?.focus()}>
                            {lines.map((l, i) => (
                                <div key={i} className="mb-4 flex items-start animate-fade-in-up">
                                    {l.type === 'input' && <span className="text-indigo-400 mr-4 opacity-50 font-bold">#</span>}
                                    {l.type === 'error' && <span className="text-red-500 mr-4 font-bold">✖</span>}
                                    <div className={`inline-block ${l.type === 'error' ? 'text-red-400' : l.type === 'system' ? 'text-slate-500/80' : 'text-slate-200'}`}>{l.content}</div>
                                </div>
                            ))}
                            <div className="flex items-center mt-8">
                                <span className="text-indigo-400 mr-4 animate-pulse font-bold">#</span>
                                <input id="studio-cli" type="text" value={inputLine} onChange={e => setInputLine(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { handleCommand(inputLine); setInputLine(''); } }} className="flex-1 bg-transparent border-none outline-none text-white/90 caret-indigo-500 font-mono tracking-wider placeholder-white/5" placeholder="Waiting for directive..." autoFocus autoComplete="off" spellCheck={false} />
                            </div>
                            <div ref={scrollRef} />
                        </div>
                    )}
                    {activeTab === 'IDENTITY' && <IdentityView />}
                    {activeTab === 'NETWORK' && <NetworkView />}
                </div>
            </div>
            <div className="h-10 flex items-center justify-between px-10 text-[8px] font-bold text-white/5 tracking-[0.5em] uppercase bg-black/40 border-t border-white/5">
                <div className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></div>Environment: Local-Host</div>
                <div className="flex gap-10"><button onClick={onToggleSnow} className="hover:text-white/20 transition-colors">Toggle FX</button><span>{new Date().toLocaleTimeString()}</span></div>
            </div>
        </div>
    </div>
  );
};

export default Terminal;
