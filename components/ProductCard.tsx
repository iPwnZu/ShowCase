
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [showArInfo, setShowArInfo] = useState(false);

  return (
    <div className="group flex flex-col gap-6 cursor-pointer" onClick={() => onClick(product)}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 sepia-[0.1]"
        />
        
        {/* AR Info Overlay */}
        {showArInfo && (
            <div 
                className="absolute inset-0 bg-[#F5F2EB]/95 z-30 flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in-up"
                onClick={(e) => e.stopPropagation()} // Prevent card click
            >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2C2A26] rounded-full flex items-center justify-center text-[#F5F2EB] mb-3 sm:mb-4 flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                    </svg>
                </div>
                <h4 className="font-serif text-lg sm:text-xl text-[#2C2A26] mb-2 leading-tight">Virtuální zrcadlo</h4>
                <p className="text-xs sm:text-sm text-[#5D5A53] mb-4 sm:mb-6 leading-relaxed max-w-[90%]">
                    Uvidíte, jak {product.name} vypadá přímo na vás. Technologie WebXR sleduje vaši ruku a umístí model do prostoru.
                </p>
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
                     <button 
                        onClick={(e) => { e.stopPropagation(); alert('Spouštím kameru...'); }}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-[#2C2A26] text-[#F5F2EB] text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#433E38] transition-colors"
                    >
                        Spustit
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowArInfo(false); }}
                        className="px-3 py-2 sm:px-4 sm:py-2 border border-[#D6D1C7] text-[#2C2A26] text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#EBE7DE] transition-colors"
                    >
                        Zavřít
                    </button>
                </div>
            </div>
        )}

        {/* Hover overlay with Actions - Hide when AR info is shown */}
        {!showArInfo && (
            <div className="absolute inset-0 bg-[#2C2A26]/0 group-hover:bg-[#2C2A26]/10 transition-colors duration-500 flex flex-col items-center justify-center gap-3">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex flex-col items-center gap-3 px-4 text-center">
                    <span className="bg-white/90 backdrop-blur text-[#2C2A26] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium shadow-sm hover:bg-white transition-colors">
                        Zobrazit detail
                    </span>

                    {product.category === 'Wearable' && (
                    <button 
                        onClick={(e) => {
                        e.stopPropagation();
                        setShowArInfo(true);
                        }}
                        className="bg-[#2C2A26] text-[#F5F2EB] px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium shadow-lg hover:scale-105 hover:bg-black transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                        </svg>
                        Otevřít v AR
                    </button>
                    )}
                </div>
            </div>
        )}
      </div>
      
      <div className="text-center">
        <h3 className="text-2xl font-serif font-medium text-[#2C2A26] mb-1 group-hover:opacity-70 transition-opacity">{product.name}</h3>
        <p className="text-sm font-light text-[#5D5A53] mb-3 tracking-wide">{product.category}</p>
        <span className="text-sm font-medium text-[#2C2A26] block">${product.price}</span>
      </div>
    </div>
  );
};

export default ProductCard;
