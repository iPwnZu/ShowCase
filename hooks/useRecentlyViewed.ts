
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useEffect } from 'react';
import { Project } from '../types';

export const useRecentlyViewed = () => {
  const [history, setHistory] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            setHistory(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  const addToHistory = (project: Project) => {
    setHistory(prev => {
      // Remove if exists (to move to top)
      const filtered = prev.filter(p => p.id !== project.id);
      // Add to start, keep max 4
      const newHistory = [project, ...filtered].slice(0, 4);
      
      try {
        localStorage.setItem('recentlyViewed', JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      
      return newHistory;
    });
  };

  const getHistory = () => history;

  return { addToHistory, getHistory };
};
