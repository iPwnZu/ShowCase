
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { generateVeoVideo } from '../services/geminiService';

interface VeoStudioProps {
  onBack: () => void;
}

const VeoStudio: React.FC<VeoStudioProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Prosím nahrajte pouze obrázek (JPG, PNG).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedVideoUrl(null); // Reset previous result
      setError(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/xxx;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const base64 = await convertFileToBase64(selectedFile);
      const mimeType = selectedFile.type;
      
      const videoUrl = await generateVeoVideo(base64, mimeType, prompt, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Chyba při generování videa. Zkuste to prosím znovu.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        
        {/* Header */}
        <div className="flex flex-col items-start mb-12">
            <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Zpět domů
            </button>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-4">AI Tools</span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#2C2A26] mb-4">Veo Studio</h1>
            <p className="text-[#5D5A53] font-light max-w-2xl">
                Oživte statické fotografie pomocí generativního videa. Nahrajte obrázek a nechte AI (model Veo), ať vytvoří filmovou animaci.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Controls */}
            <div className="space-y-8">
                {/* 1. Upload */}
                <div 
                    className={`border-2 border-dashed border-[#D6D1C7] rounded-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#2C2A26] hover:bg-[#EBE7DE]/30 transition-all ${selectedFile ? 'border-solid border-[#2C2A26] bg-[#EBE7DE]/30' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    
                    {previewUrl ? (
                        <div className="relative w-full aspect-video overflow-hidden bg-[#2C2A26]">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-[#F5F2EB] text-sm font-medium uppercase tracking-widest">Změnit obrázek</span>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-[#A8A29E] mb-4 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="block text-sm font-medium uppercase tracking-widest text-[#2C2A26]">Klikněte pro nahrání fotky</span>
                            <span className="text-xs text-[#A8A29E] mt-2">JPG, PNG (Max 5MB)</span>
                        </div>
                    )}
                </div>

                {/* 2. Settings */}
                <div>
                    <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">Prompt (Volitelné)</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Např.: Filmový záběr, jemný pohyb kamery, vítr ve vlasech..."
                        rows={3}
                        className="w-full bg-transparent border border-[#D6D1C7] p-4 text-[#2C2A26] text-sm outline-none focus:border-[#2C2A26] transition-colors rounded-none resize-none"
                    />
                </div>

                <div>
                    <span className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-3">Poměr stran</span>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setAspectRatio('16:9')}
                            className={`flex-1 py-3 px-4 text-sm font-medium border transition-all ${aspectRatio === '16:9' ? 'border-[#2C2A26] bg-[#2C2A26] text-[#F5F2EB]' : 'border-[#D6D1C7] text-[#5D5A53] hover:border-[#2C2A26]'}`}
                        >
                            16:9 (Na šířku)
                        </button>
                        <button 
                            onClick={() => setAspectRatio('9:16')}
                            className={`flex-1 py-3 px-4 text-sm font-medium border transition-all ${aspectRatio === '9:16' ? 'border-[#2C2A26] bg-[#2C2A26] text-[#F5F2EB]' : 'border-[#D6D1C7] text-[#5D5A53] hover:border-[#2C2A26]'}`}
                        >
                            9:16 (Na výšku)
                        </button>
                    </div>
                </div>

                {/* 3. Action */}
                <button 
                    onClick={handleGenerate}
                    disabled={!selectedFile || isGenerating}
                    className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-sm font-bold hover:bg-[#433E38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-[#F5F2EB] border-t-transparent rounded-full animate-spin"></div>
                            Generuji video...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                            Generovat Animaci
                        </>
                    )}
                </button>
                
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-200">
                        {error}
                    </div>
                )}
            </div>

            {/* Right: Output */}
            <div className="bg-[#EBE7DE] min-h-[400px] flex items-center justify-center border border-[#D6D1C7] relative">
                 {isGenerating ? (
                     <div className="text-center p-8">
                         <div className="w-16 h-16 border-4 border-[#2C2A26] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                         <h3 className="font-serif text-xl text-[#2C2A26] mb-2">AI pracuje</h3>
                         <p className="text-[#5D5A53] text-sm">Model Veo analyzuje váš obrázek a vytváří mezisnímky. <br/>Může to trvat až minutu.</p>
                     </div>
                 ) : generatedVideoUrl ? (
                     <div className="w-full h-full p-4 flex flex-col">
                         <video 
                            src={generatedVideoUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="w-full h-full object-contain shadow-xl"
                         />
                         <a 
                            href={generatedVideoUrl} 
                            download="veo-animation.mp4"
                            className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-[#2C2A26] underline underline-offset-4 hover:opacity-70"
                         >
                             Stáhnout video
                         </a>
                     </div>
                 ) : (
                     <div className="text-center p-8 opacity-40">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                        </svg>
                         <p className="font-serif text-lg">Zde se objeví vaše video</p>
                     </div>
                 )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default VeoStudio;
