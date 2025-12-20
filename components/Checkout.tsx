/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Product } from '../types';

interface CheckoutProps {
  items: Product[];
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
        setStep('success');
    }, 1500);
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-[#2C2A26] rounded-full flex items-center justify-center text-[#F5F2EB] mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
              </div>
              <h2 className="text-4xl font-serif text-[#2C2A26] mb-4">Order Confirmed</h2>
              <p className="text-[#5D5A53] max-w-md mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
              <button 
                  onClick={onBack}
                  className="px-8 py-4 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-sm font-bold hover:bg-[#433E38] transition-colors"
              >
                  Return Home
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] pt-24 pb-12 px-6 md:px-12 animate-fade-in-up">
        <div className="max-w-6xl mx-auto">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-12"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to Cart
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Forms */}
                <div>
                    <h2 className="text-3xl font-serif text-[#2C2A26] mb-8">
                        {step === 'details' ? 'Shipping Details' : 'Payment'}
                    </h2>

                    {step === 'details' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">First Name</label>
                                    <input type="text" required className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none focus:border-[#2C2A26]" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">Last Name</label>
                                    <input type="text" required className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none focus:border-[#2C2A26]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">Email</label>
                                <input type="email" required className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none focus:border-[#2C2A26]" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">Address</label>
                                <input type="text" required className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none focus:border-[#2C2A26]" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">City</label>
                                    <input type="text" required className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none focus:border-[#2C2A26]" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-[#A8A29E] mb-2">Postal Code</label>
                                    <input type="text" required className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none focus:border-[#2C2A26]" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-sm font-bold mt-8 hover:bg-[#433E38] transition-colors">
                                Continue to Payment
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-[#EBE7DE] p-6 border border-[#D6D1C7] rounded-sm">
                                <p className="text-sm text-[#5D5A53] mb-4">This is a demo checkout. No actual payment will be processed.</p>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Card Number" className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none" disabled />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="MM/YY" className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none" disabled />
                                        <input type="text" placeholder="CVC" className="w-full bg-white border border-[#D6D1C7] p-4 text-[#2C2A26] outline-none" disabled />
                                    </div>
                                </div>
                            </div>
                            <button onClick={handlePayment} className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-sm font-bold mt-8 hover:bg-[#433E38] transition-colors">
                                Pay ${total.toFixed(2)}
                            </button>
                            <button onClick={() => setStep('details')} className="w-full text-xs uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] py-4">
                                Back to Details
                            </button>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="bg-[#EBE7DE]/50 p-8 h-fit border border-[#D6D1C7]">
                    <h3 className="text-xl font-serif text-[#2C2A26] mb-6">Order Summary</h3>
                    <div className="space-y-4 mb-8">
                        {items.map((item, i) => (
                            <div key={i} className="flex justify-between items-start text-sm">
                                <span className="text-[#5D5A53] max-w-[70%]">{item.name}</span>
                                <span className="text-[#2C2A26] font-medium">${item.price}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#D6D1C7] pt-6 flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-widest text-[#2C2A26]">Total</span>
                        <span className="text-2xl font-serif text-[#2C2A26]">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Checkout;
