/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, FunctionDeclaration, Type, Schema } from "@google/genai";
import { PROJECTS, BRAND_NAME, EMAIL, SOCIAL_LINKS } from '../constants';
import { GeminiResponse, GeminiToolCall, FamilyMember } from '../types';

export const analyzeNetworkNode = async (nodeData: { ip: string, city: string, country: string, lat: number, lon: number }): Promise<any> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Proveď hloubkovou analýzu síťového uzlu: IP ${nodeData.ip}, lokalita ${nodeData.city}, ${nodeData.country}. 
  Souřadnice: ${nodeData.lat}, ${nodeData.lon}.
  Použij Google Maps pro identifikaci blízkých datových center nebo technologických hubů. 
  Použij Google Search pro zjištění informací o poskytovateli připojení (ISP) v této oblasti a stabilitě sítě. 
  Vrať technický, ale čtivý report v češtině.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: nodeData.lat,
            longitude: nodeData.lon
          }
        }
      }
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const verifyFamilyMember = async (member: FamilyMember): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Hledej historické, matriční nebo regionální záznamy pro osobu: ${member.name}, narozen ${member.birthDate || 'neznámo'} v lokalitě ${member.birthPlace || 'neznámo'}. 
  Uveď konkrétní fakta, pokud existují, nebo kontext dané doby a místa, který by mohl pomoci identifikovat tuto osobu v archivech. Buď velmi stručný a profesionální.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return response.text || "V historických záznamech nebyly nalezeny přímé shody.";
};

export const sendMessageToGemini = async (
  history: {role: string, text: string}[], 
  newMessage: string,
  currentContext?: string
): Promise<GeminiResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return { text: "Chybí API klíč." };

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Jsi AI asistent Františka Kaláška. Mluvíš česky. Jsi expert na technologie a genealogii.`,
      },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return { text: result.text || "" };
  } catch (error) {
    return { text: "Chyba API." };
  }
};

export const parseFamilyHistory = async (story: string): Promise<FamilyMember[]> => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        birthDate: { type: Type.STRING },
        deathDate: { type: Type.STRING },
        birthPlace: { type: Type.STRING },
        bio: { type: Type.STRING },
        parents: { type: Type.ARRAY, items: { type: Type.STRING } },
        children: { type: Type.ARRAY, items: { type: Type.STRING } },
        spouses: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["id", "name", "parents", "children"],
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyzuj text a vytvoř rodokmen: "${story}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || "[]");
};

export const generateVeoVideo = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: { imageBytes: imageBase64, mimeType },
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation});
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${apiKey}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
