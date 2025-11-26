
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { SOCIAL_LINKS, ADDRESS, EMAIL } from '../constants';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  // Prevent scroll when modal is open
  React.useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);
  
  // Helper to render icon based on name
  const renderIcon = (name: string) => {
      switch(name) {
          case 'Instagram':
              return <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>;
          case 'Facebook':
              return <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>;
          case 'WhatsApp':
              return <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>;
          case 'LinkedIn':
              return <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>;
          case 'X.com':
              return <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>;
          default:
              return null;
      }
  };

  return (
    <>
      <footer className="bg-[#EBE7DE] py-16 px-6 text-[#5D5A53] border-t border-[#D6D1C7]">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          
          {/* Identity */}
          <div className="text-left">
            <h4 className="text-2xl font-serif text-[#2C2A26] mb-2">František Kalášek</h4>
            <p className="text-xs uppercase tracking-widest text-[#A8A29E] mb-1">TopBot.PwnZ™</p>
            <p className="text-[10px] text-[#A8A29E]">IČO: 23628588</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-8 text-sm font-light">
            <a href="#home" onClick={(e) => onLinkClick(e, 'home')} className="hover:text-[#2C2A26] transition-colors">Domů</a>
            <a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="hover:text-[#2C2A26] transition-colors">O mně</a>
            <a href="#showcase" onClick={(e) => onLinkClick(e, 'showcase')} className="hover:text-[#2C2A26] transition-colors">Portfolio</a>
            <a href="#contact" onClick={(e) => onLinkClick(e, 'contact')} className="hover:text-[#2C2A26] transition-colors">Kontakt</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
              {SOCIAL_LINKS.map((social) => (
                  <a 
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#A8A29E] hover:text-[#2C2A26] transition-all duration-300 hover:scale-110"
                      title={social.name}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                          {renderIcon(social.name)}
                      </svg>
                  </a>
              ))}
          </div>
        </div>

        {/* Bottom Bar with Legal */}
        <div className="max-w-[1800px] mx-auto mt-12 pt-8 border-t border-[#D6D1C7] flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#A8A29E]">
            <div className="flex gap-6">
                <button onClick={() => setActiveModal('privacy')} className="hover:text-[#2C2A26] transition-colors uppercase tracking-wider">
                    Ochrana osobních údajů
                </button>
                <button onClick={() => setActiveModal('terms')} className="hover:text-[#2C2A26] transition-colors uppercase tracking-wider">
                    Podmínky užití
                </button>
            </div>
            <div className="uppercase tracking-widest opacity-60">
                &copy; {new Date().getFullYear()} František Kalášek.
            </div>
        </div>
      </footer>

      {/* Legal Modals */}
      {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <div 
                  className="absolute inset-0 bg-[#2C2A26]/80 backdrop-blur-sm"
                  onClick={() => setActiveModal(null)}
              ></div>
              <div className="relative bg-[#F5F2EB] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D6D1C7] animate-fade-in-up">
                  <div className="sticky top-0 right-0 p-4 flex justify-end bg-[#F5F2EB]/95 backdrop-blur border-b border-[#D6D1C7]">
                      <button onClick={() => setActiveModal(null)} className="text-[#A8A29E] hover:text-[#2C2A26] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
                  <div className="p-8 md:p-12 prose prose-stone max-w-none">
                      {activeModal === 'privacy' && (
                          <>
                              <h2 className="font-serif text-3xl text-[#2C2A26] mb-6">Zásady ochrany osobních údajů</h2>
                              <p>Vážení návštěvníci, bezpečí vašich osobních údajů je pro mě prioritou. Zde naleznete informace o tom, jaká data shromažďuji a jak s nimi nakládám.</p>
                              
                              <h3 className="font-bold text-[#2C2A26] mt-6">1. Správce údajů</h3>
                              <p>Správcem vašich osobních údajů je:<br/>
                              <strong>František Kalášek</strong><br/>
                              IČO: 23628588<br/>
                              Sídlo: {ADDRESS}<br/>
                              E-mail: {EMAIL}</p>

                              <h3 className="font-bold text-[#2C2A26] mt-6">2. Jaké údaje zpracovávám</h3>
                              <p>V případě použití kontaktního formuláře zpracovávám údaje, které mi sami poskytnete, zpravidla:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                  <li>Jméno a příjmení</li>
                                  <li>E-mailová adresa</li>
                                  <li>Obsah vaší zprávy</li>
                              </ul>

                              <h3 className="font-bold text-[#2C2A26] mt-6">3. Účel zpracování</h3>
                              <p>Údaje zpracovávám výhradně za účelem vyřízení vašeho dotazu, poptávky nebo pro budoucí smluvní spolupráci.</p>

                              <h3 className="font-bold text-[#2C2A26] mt-6">4. Vaše práva</h3>
                              <p>Podle GDPR máte právo na přístup k údajům, opravu, výmaz ("právo být zapomenut"), omezení zpracování a podání stížnosti u ÚOOÚ.</p>
                          </>
                      )}

                      {activeModal === 'terms' && (
                          <>
                              <h2 className="font-serif text-3xl text-[#2C2A26] mb-6">Podmínky užití</h2>
                              
                              <h3 className="font-bold text-[#2C2A26] mt-6">1. Úvodní ustanovení</h3>
                              <p>Tyto podmínky upravují užívání internetové prezentace provozované Františkem Kaláškem, IČO: 23628588 (dále jen "Provozovatel").</p>

                              <h3 className="font-bold text-[#2C2A26] mt-6">2. Autorská práva</h3>
                              <p>Veškerý obsah na tomto webu (texty, design, fotografie, ukázky kódu a portfolio) je duševním vlastnictvím Provozovatele a je chráněn autorským zákonem. Jakékoli kopírování, šíření nebo komerční využití obsahu bez písemného souhlasu autora je zakázáno.</p>

                              <h3 className="font-bold text-[#2C2A26] mt-6">3. Odpovědnost</h3>
                              <p>Informace uvedené na tomto webu slouží k prezentačním účelům. Provozovatel nenese odpovědnost za případné nepřesnosti nebo chyby v obsahu, ani za škody vzniklé užíváním webu. Odkazy na externí stránky třetích stran jsou mimo kontrolu Provozovatele.</p>

                              <h3 className="font-bold text-[#2C2A26] mt-6">4. Změny podmínek</h3>
                              <p>Provozovatel si vyhrazuje právo tyto podmínky kdykoliv změnit. Používáním webu vyjadřujete souhlas s aktuálním zněním podmínek.</p>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default Footer;
