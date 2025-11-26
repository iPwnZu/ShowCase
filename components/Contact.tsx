
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { EMAIL, MAP_LINK } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 bg-[#2C2A26] text-[#F5F2EB]">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Header Section */}
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-6 block">Kontakt</span>
        <h2 className="text-5xl md:text-7xl font-serif mb-10 md:mb-12 leading-tight">
             Připraveni <br/> spolupracovat?
        </h2>
        <p className="text-xl md:text-2xl text-[#A8A29E] font-light mb-16 max-w-2xl leading-relaxed">
             Napište mi přímo na <a href={`mailto:${EMAIL}`} className="text-[#F5F2EB] underline underline-offset-8 hover:text-white transition-colors">{EMAIL}</a><br/>
             nebo se zastavte na kávu.
        </p>

        {/* Info Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start text-left border-t border-[#433E38] pt-16">
            
            {/* Address Column */}
            <div className="flex flex-col items-start md:items-end md:text-right">
                <h3 className="text-lg font-serif mb-4 text-[#F5F2EB]">Sídlo & Studio</h3>
                <p className="text-[#A8A29E] font-light mb-6 leading-relaxed">
                    TopBot.PwnZ™<br/>
                    Javorek 54<br/>
                    592 03 Javorek<br/>
                    Česká republika
                </p>
                <a 
                    href={MAP_LINK}
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F5F2EB] border-b border-[#F5F2EB] pb-1 hover:opacity-70 transition-opacity"
                >
                    Otevřít v Google Maps
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </a>
            </div>

            {/* Map Column */}
            <div className="w-full h-[300px] overflow-hidden border border-[#5D5A53]/30 grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.131214633241!2d16.17043197679114!3d49.651826871450695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470d9ba2826830e5%3A0x2ec62106a40c9332!2zVG9wQm90LlB3blrihKI!5e0!3m2!1scs!2scz!4v1764105892043!5m2!1scs!2scz" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="TopBot.PwnZ Location"
                ></iframe>
            </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
