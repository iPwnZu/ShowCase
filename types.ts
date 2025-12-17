
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  galleryImages?: string[];
  link?: string;
  modelUrl?: string; // URL to .glb/.gltf 3D model
  category: 'WebXR' | 'AI' | 'Web' | 'Design';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: { title: string; uri: string }[];
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'project', project: Project }
  | { type: 'family-tree' };

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  longDescription?: string;
  features: string[];
}

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: ReactNode;
  image: string;
}

export interface GeminiToolCall {
  name: string;
  args: Record<string, any>;
}

export interface GeminiResponse {
  text: string;
  sources?: { title: string; uri: string }[];
  toolCalls?: GeminiToolCall[];
}

// Genealogy Types
export interface FamilyMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  bio?: string;
  // IDs of related members
  parents: string[]; 
  children: string[];
  spouses: string[];
  generation?: number; // Calculated for visualization
}