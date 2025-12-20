
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import SnowEffect from './components/SnowEffect';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WebXRShowcase from './components/WebXRShowcase';
import Journal from './components/Journal';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Assistant from './components/Assistant';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import JournalDetail from './components/JournalDetail';
import ProductDetail from './components/ProductDetail';
import VeoStudio from './components/VeoStudio';
import FamilyTreeStudio from './components/FamilyTreeStudio'; // Import FamilyTreeStudio

import { Project, Product, JournalArticle } from './types';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';

function App() {
  const [blink, setBlink] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [snowing, setSnowing] = useState(false);
  
  // Navigation State
  const [view, setView] = useState<'home' | 'product-detail' | 'journal-detail' | 'checkout' | 'veo-studio' | 'family-tree'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Hooks
  const { addToHistory, getHistory } = useRecentlyViewed();

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
      // Toggle on Backtick ` (Backquote) or Ctrl+Space
      if (e.code === 'Backquote' || (e.ctrlKey && e.code === 'Space')) {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation Handlers
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (view !== 'home') {
      setView('home');
      // Wait for render then scroll
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
       // Default anchor behavior will likely work, but let's smooth scroll just in case
       const el = document.getElementById(targetId);
       if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProjectClick = (project: Project) => {
    addToHistory(project);
    // Open detail modal or navigate if we had a detail page for projects
    // For now, assume it's WebXR activation which is handled in component
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
    window.scrollTo(0, 0);
  };

  const handleArticleClick = (article: JournalArticle) => {
    setSelectedArticle(article);
    setView('journal-detail');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // --- Views Rendering ---

  // Special full-screen tools
  if (view === 'family-tree') {
      return (
        <div className="font-sans text-[#2C2A26]">
          <FamilyTreeStudio onBack={() => setView('home')} />
        </div>
      );
  }

  if (view === 'veo-studio') {
      return (
        <div className="font-sans text-[#2C2A26]">
           <VeoStudio onBack={() => setView('home')} />
        </div>
      );
  }

  if (view === 'checkout') {
    return <Checkout items={cartItems} onBack={() => setView('home')} />;
  }
  
  if (view === 'journal-detail' && selectedArticle) {
    return (
      <>
        <Navbar onNavClick={handleNavClick} />
        <JournalDetail article={selectedArticle} onBack={() => setView('home')} />
        <Footer onLinkClick={handleNavClick} />
      </>
    );
  }

  if (view === 'product-detail' && selectedProduct) {
     return (
       <>
         <Navbar onNavClick={handleNavClick} />
         <CartDrawer 
            isOpen={cartOpen} 
            onClose={() => setCartOpen(false)} 
            items={cartItems} 
            onRemoveItem={handleRemoveFromCart}
            onCheckout={() => { setCartOpen(false); setView('checkout'); }}
         />
         <ProductDetail 
            product={selectedProduct} 
            onBack={() => setView('home')} 
            onAddToCart={handleAddToCart} 
         />
       </>
     );
  }

  return (
    <div className="font-sans text-[#2C2A26] bg-[#F5F2EB] selection:bg-[#2C2A26] selection:text-[#F5F2EB]">
      
      {/* Snow Effect Layer */}
      {snowing && <SnowEffect />}

      {/* The Interactive Terminal Overlay */}
      <Terminal 
        isOpen={terminalOpen} 
        onClose={() => setTerminalOpen(false)} 
        onToggleSnow={() => setSnowing(prev => !prev)}
      />
      
      <Navbar onNavClick={handleNavClick} />
      
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cartItems} 
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => { setCartOpen(false); setView('checkout'); }}
      />

      <main>
        <Hero />
        <About />
        <WebXRShowcase onProjectClick={handleProjectClick} onFeedbackClick={() => {}} />
        
        {/* Products Section with Cart Integration */}
        <ProductGrid onProductClick={handleProductClick} />

        {/* AI Tools Section (Navigational Cards) */}
        <section className="py-20 px-6 bg-[#2C2A26] text-[#F5F2EB]">
            <div className="max-w-[1800px] mx-auto">
                <h2 className="text-3xl font-serif mb-12 text-center">AI Laboratoř</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div 
                        onClick={() => setView('veo-studio')}
                        className="group border border-[#F5F2EB]/20 p-8 cursor-pointer hover:bg-[#F5F2EB]/5 transition-colors relative overflow-hidden"
                    >
                        <h3 className="text-2xl font-serif mb-2 relative z-10">Veo Studio</h3>
                        <p className="text-[#A8A29E] font-light relative z-10">Oživte statické fotografie pomocí generativního videa.</p>
                        <div className="absolute top-4 right-4 text-[#F5F2EB]/20 group-hover:text-[#F5F2EB] transition-colors">↗</div>
                    </div>
                    <div 
                        onClick={() => setView('family-tree')}
                        className="group border border-[#F5F2EB]/20 p-8 cursor-pointer hover:bg-[#F5F2EB]/5 transition-colors relative overflow-hidden"
                    >
                        <h3 className="text-2xl font-serif mb-2 relative z-10">LifeBridge (Rodokmen)</h3>
                        <p className="text-[#A8A29E] font-light relative z-10">Generování rodokmenu z příběhů a dokumentů pomocí AI.</p>
                        <div className="absolute top-4 right-4 text-[#F5F2EB]/20 group-hover:text-[#F5F2EB] transition-colors">↗</div>
                    </div>
                </div>
            </div>
        </section>

        <Journal onArticleClick={handleArticleClick} />
        <Contact />
      </main>

      <Footer onLinkClick={handleNavClick} />

      <Assistant 
        currentContext={view} 
        onNavigate={(section) => {
            const el = document.getElementById(section);
            if(el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
