/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  category: string;
  imageUrl: string;
  modelUrl?: string;
}

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
  image: string;
  content: string;
}

export interface GeminiToolCall {
  name: string;
  args: any;
}

export interface GeminiResponse {
  text: string;
  toolCalls?: GeminiToolCall[];
  sources?: { uri: string; title: string }[];
  grounding?: any;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: { uri: string; title: string }[];
}

export interface FamilyMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  bio?: string;
  parents: string[];
  children: string[];
  spouses: string[];
  role?: string;
}
