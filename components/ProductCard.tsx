
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="group flex flex-col gap-6 cursor-pointer" onClick={() => onClick(product)}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 sepia-[0.1]"
        />
        
        {/* Hover overlay with Actions */}
        <div className="absolute inset-0 bg-[#2C2A26]/0 group-hover:bg-[#2C2A26]/10 transition-colors duration-500 flex flex-col items-center justify-center gap-3">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex flex-col items-center gap-3">
                <span className="bg-white/90 backdrop-blur text-[#2C2A26] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium shadow-sm hover:bg-white transition-colors">
                    Zobrazit detail
                </span>

                {product.category === 'Wearable' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Opening AR view for ${product.name}`);
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
