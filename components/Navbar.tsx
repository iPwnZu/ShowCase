
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { BRAND_NAME } from '../constants';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    onNavClick(e, targetId);
  };

  const textColorClass = (scrolled || mobileMenuOpen) ? 'text-[#2C2A26]' : 'text-[#2C2A26] md:text-[#F5F2EB]';

  // Navigation Data Structure - Simplified
  const NAV_ITEMS = [
    { id: 'home', label: 'Domů' },
    { id: 'about', label: 'O mně' },
    { id: 'contact', label: 'Kontakt' }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled || mobileMenuOpen ? 'bg-[#F5F2EB]/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavClick(e, '');
            }}
            className={`text-2xl md:text-3xl font-serif font-bold tracking-tight z-50 relative transition-colors duration-500 ${textColorClass}`}
          >
            {BRAND_NAME}
          </a>
          
          {/* Center Links - Desktop */}
          <div className={`hidden md:flex items-center gap-12 text-sm font-medium tracking-widest uppercase transition-colors duration-500 ${textColorClass}`}>
            {NAV_ITEMS.map((item) => (
                <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    onClick={(e) => handleLinkClick(e, item.id)} 
                    className="hover:opacity-60 transition-opacity"
                >
                    {item.label}
                </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`block md:hidden focus:outline-none z-50 transition-colors duration-500 ${textColorClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Slide from Left with Staggered Items */}
      <div className={`fixed inset-0 bg-[#F5F2EB] z-40 flex flex-col justify-center items-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          mobileMenuOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-full pointer-events-none'
      }`}>
          <div className="flex flex-col items-center space-y-8 text-xl font-serif font-medium text-[#2C2A26]">
            {NAV_ITEMS.map((item, idx) => (
                <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    onClick={(e) => handleLinkClick(e, item.id)} 
                    className={`
                        hover:opacity-60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    `}
                    style={{ 
                        transitionDelay: mobileMenuOpen ? `${150 + (idx * 100)}ms` : '0ms' 
                    }}
                >
                    {item.label}
                </a>
            ))}
          </div>
      </div>
    </>
  );
};

export default Navbar;
