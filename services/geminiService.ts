
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { PROJECTS, BRAND_NAME, EMAIL, SOCIAL_LINKS } from '../constants';
import { GeminiResponse, GeminiToolCall } from '../types';

const getSystemInstruction = () => {
  const projectContext = PROJECTS.map(p => 
    `- ${p.name} (${p.category}): ${p.description}. Tech Stack: [${p.techStack.join(', ')}]. Tagline: "${p.tagline}".`
  ).join('\n');

  const socialContext = SOCIAL_LINKS.map(s => `${s.name}: ${s.url}`).join(', ');

  return `Jsi AI Konciérž a Senior Software Architect asistent pro Františka Kaláška (značka ${BRAND_NAME}).
  
  TVÁ ROLE:
  Nejsi jen chatbot. Jsi technický partner. Tvým cílem je demonstrovat Františkovu expertízu skrze hluboké vhledy (insights).
  
  JAZYK:
  Mluvíš POUZE ČESKY. Tvůj tón je profesionální, expertní, ale přístupný. Používej technickou terminologii správně (ne "reagovat", ale "React", ne "web x r", ale "WebXR").
  
  FORMÁTOVÁNÍ:
  - Používej **tučné písmo** pro technologie a klíčové koncepty.
  - Používej odrážky pro výčet vlastností.
  - Buď stručný, ale informačně bohatý.

  INFORMACE O FRANTIŠKOVI:
  - Role: Senior Web Developer & Software Architect.
  - Lokalita: Javorek 54, 592 03 Javorek, Česká republika. (Pro dotazy na lokaci VŽDY použij tool googleMaps).
  - Filosofie: "Bridge the gap" - spojení designu (estetika, emoce) a inženýrství (výkon, škálovatelnost, čistý kód).
  - Kontakt: ${EMAIL}.
  - Sociální sítě: ${socialContext}

  PORTFOLIO (ZNALOSTNÍ BÁZE):
  ${projectContext}
  
  PRAVIDLA PRO ODPOVĚDI (INSIGHTS):
  1. **Technická Analýza (Otázky "Proč?"):** Pokud se uživatel zeptá, proč byla použita konkrétní technologie (např. Three.js), vysvětli to z pohledu architekta. 
     - *Špatně:* "Použil Three.js pro 3D grafiku."
     - *Dobře:* "**Three.js** byla zvolena pro optimalizaci draw calls ve WebGL a nativní podporu shaderů, což umožnilo plynulý běh 3D skenu krajiny přímo v prohlížeči bez nutnosti instalace."
  2. **Navigace:** Pokud uživatel chce vidět sekci (kontakt, portfolio), použij funkci 'navigateToSection'.
  3. **Kontext:** Vždy ber v potaz 'SYSTEM NOTE' v promptu. Pokud se uživatel dívá na "Virtual Moravia", odpovědi vztahuj k tomuto projektu, pokud není řečeno jinak.

  Tvé úkoly:
  1. Odpovídat na dotazy ohledně dovedností.
  2. Poskytovat "Developer Insights" k projektům.
  3. Směřovat na kontakt.
  `;
};

// Definice nástroje pro navigaci
const navigationTool: FunctionDeclaration = {
  name: "navigateToSection",
  description: "Scrolls the application to a specific section.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectionId: {
        type: Type.STRING,
        description: "The ID of the section to scroll to. Available IDs: 'home', 'about', 'showcase', 'contact'. Use 'showcase' for portfolio/projects.",
        enum: ["home", "about", "showcase", "contact"]
      }
    },
    required: ["sectionId"]
  }
};

export const sendMessageToGemini = async (
  history: {role: string, text: string}[], 
  newMessage: string,
  currentContext?: string
): Promise<GeminiResponse> => {
  try {
    let apiKey: string | undefined;
    
    try {
      apiKey = process.env.API_KEY;
    } catch (e) {
      console.warn("Accessing process.env failed");
    }
    
    if (!apiKey) {
      return { text: "Omlouvám se, ale momentálně nemám spojení se serverem. (Chybí API klíč)" };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Dynamicky upravíme prompt o kontext
    const messageToSend = currentContext 
      ? `[SYSTEM NOTE: Aktuální kontext uživatele (viewport): ${currentContext}] ${newMessage}`
      : newMessage;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(),
        tools: [
          { googleMaps: {} }, 
          { functionDeclarations: [navigationTool] }
        ],
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: messageToSend });
    
    // Extract text
    const text = result.text || "Rozumím, ale nemám k tomu co dodat.";

    // Extract Google Maps Grounding Metadata
    const sources: { title: string; uri: string }[] = [];
    if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      result.candidates[0].groundingMetadata.groundingChunks.forEach(chunk => {
        if (chunk.web?.uri && chunk.web?.title) {
           sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Extract Function Calls
    const toolCalls: GeminiToolCall[] = [];
    const functionCalls = result.functionCalls;
    
    if (functionCalls) {
      functionCalls.forEach(call => {
        toolCalls.push({
          name: call.name,
          args: call.args as Record<string, any>
        });
      });
    }

    return { text, sources, toolCalls };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Omlouvám se, došlo k chybě při analýze požadavku. Zkuste to prosím znovu." };
  }
};

export const generateVeoVideo = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  // Check for API Key selection (Project IDX / AI Studio environment)
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
       await (window as any).aistudio.openSelectKey();
    }
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const performGeneration = async () => {
    const ai = new GoogleGenAI({ apiKey });
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || undefined, 
      image: {
        imageBytes: imageBase64,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation});
    }

    return operation;
  };

  try {
    let operation = await performGeneration();
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
      throw new Error("Video generation failed or no URI returned.");
    }

    // Fetch the video content
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
       throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    // Retry logic for key selection race condition
    if (error.message?.includes("Requested entity was not found") && typeof window !== 'undefined' && (window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        return generateVeoVideo(imageBase64, mimeType, prompt, aspectRatio);
    }
    throw error;
  }
};
