
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Project, Product, JournalArticle } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Virtual Moravia XR',
    tagline: 'Immerzivní cesta regionem.',
    description: 'Experimentální WebXR zážitek, který přenáší krásy Nového Města na Moravě do virtuální reality. Využívá fotogrammetrii a WebGL pro plynulý běh v prohlížeči.',
    techStack: ['Three.js', 'WebXR', 'React', 'WebGL'],
    category: 'WebXR',
    // ImageKit URL
    imageUrl: 'https://ik.imagekit.io/ipwnzu/Virtual.png',
  },
  {
    id: 'p2',
    name: 'Filling Pieces AI',
    tagline: 'Generativní design.',
    description: 'Systém využívající strojové učení k vytváření unikátních vzorů pro textilní průmysl. Spojuje tradiční umění s algoritmickou přesností.',
    techStack: ['TensorFlow.js', 'Python', 'Node.js'],
    category: 'AI',
    // ImageKit URL
    imageUrl: 'https://ik.imagekit.io/ipwnzu/Fill.png',
  },
  {
    id: 'p3',
    name: 'TopBot Dashboard',
    tagline: 'Analytika v reálném čase.',
    description: 'Komplexní administrátorské rozhraní pro správu IoT zařízení. Čistý kód, maximální výkon a intuitivní UX design.',
    techStack: ['React', 'TypeScript', 'D3.js', 'WebSocket'],
    category: 'Web',
    // ImageKit URL
    imageUrl: 'https://ik.imagekit.io/ipwnzu/dash2.png',
  },
  {
    id: 'p4',
    name: 'CyberSculpture',
    tagline: 'Digitální umění.',
    description: 'Interaktivní 3D instalace reagující na pohyb kurzoru a zvuk. Demonstrace možností moderního prohlížeče.',
    techStack: ['WebGL', 'GLSL', 'Audio API'],
    category: 'Design',
    // ImageKit URL - Updated
    imageUrl: 'https://ik.imagekit.io/ipwnzu/Gemini_Generated_Image_8pyicl8pyicl8pyi.png',
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Aura One',
    price: 299,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
    description: 'High-fidelity audio in a sandstone enclosure.',
    longDescription: 'Aura One redefines home audio. Encased in hand-carved sandstone, it delivers pristine sound with zero resonance. Connects seamlessly via Wi-Fi and Bluetooth.',
    features: ['Natural Sandstone Enclosure', 'Active Noise Cancellation', '30-hour Battery Life', 'Bluetooth 5.2']
  },
  {
    id: 'prod2',
    name: 'Chronos',
    price: 450,
    category: 'Wearable',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    description: 'Minimalist smart watch with e-ink display.',
    longDescription: 'Distraction-free technology. Chronos uses an e-ink display to provide essential information only when you need it. Battery lasts for weeks, not days.',
    features: ['E-ink Display', 'Heart Rate Monitor', 'Water Resistant 50m', '4-week Battery Life']
  },
  {
    id: 'prod3',
    name: 'Lumina',
    price: 120,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=1000',
    description: 'Smart ambient lighting for modern spaces.',
    longDescription: 'Lumina adapts to the time of day, mimicking natural sunlight patterns to support your circadian rhythm. Crafted from recycled glass and aluminum.',
    features: ['Circadian Rhythm Sync', 'Voice Control', 'Energy Efficient LED', 'Recycled Materials']
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art1',
    title: 'The Future of WebXR',
    date: 'Oct 12, 2023',
    excerpt: 'Exploring how the web is becoming a spatial operating system.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&q=80&w=1000',
    content: 'WebXR is rapidly evolving. We are moving beyond simple 360 photos into fully interactive, immersive experiences that live directly in the browser...'
  },
  {
    id: 'art2',
    title: 'Sustainable Tech Design',
    date: 'Sep 05, 2023',
    excerpt: 'Why we need to build software that lasts longer than hardware.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000',
    content: 'In a world of planned obsolescence, writing efficient code is an act of rebellion. Optimized software extends the lifespan of devices and reduces electronic waste...'
  },
  {
    id: 'art3',
    title: 'AI as a Creative Partner',
    date: 'Aug 20, 2023',
    excerpt: 'Navigating the new landscape of generative art.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    content: 'Artificial Intelligence is not replacing artists; it is empowering them. By handling the mundane, AI frees the human mind to focus on pure conceptualization...'
  }
];

export const BRAND_NAME = 'TopBot.PwnZ™';
export const EMAIL = 'FandaKalasek@icloud.com';
export const ADDRESS = 'Javorek 54, 592 03 Javorek, Česká republika';
export const MAP_LINK = 'https://maps.app.goo.gl/RGv2CzHczAEWVMog8';

export const SOCIAL_LINKS = [
    { name: 'Instagram', url: 'https://instagram.com/pwnz.qq', icon: 'instagram' },
    { name: 'Facebook', url: 'https://facebook.com/topwnz', icon: 'facebook' },
    { name: 'WhatsApp', url: 'https://wa.me/420722426195', icon: 'whatsapp' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/pwnz', icon: 'linkedin' },
    { name: 'X.com', url: 'https://x.com/pwnz_qq', icon: 'x' }
];
