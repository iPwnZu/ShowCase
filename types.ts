
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
  | { type: 'project', project: Project };

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
