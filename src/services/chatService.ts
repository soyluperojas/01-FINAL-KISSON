
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types"; // Import from types instead of declaring locally
import { fallbackTextToSpeech } from "./speechService";
import { toast } from "@/components/ui/sonner";

// Export ChatMessage type from types.ts
export type { ChatMessage } from "./types";

// Track API failures to avoid repeated failing requests
let ttsServiceFailures = 0;
const MAX_FAILURES = 3;
const FAILURE_RESET_TIME = 60000; // 1 minute
let isUsingFallbackTTS = false;

// ChatService handles chat interactions with OpenAI via Edge Function
export async function sendMessage(
  messages: ChatMessage[], 
  onPartialResponse: (text: string) => void
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        endpoint: '/chat/completions',
        method: 'POST',
        body: {
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 500,
          stream: true,
        }
      }
    });

    if (error) {
      console.error("Chat API error:", error);
      throw new Error(`Error sending message: ${error.message}`);
    }

    // Handle streaming response
    let fullText = "";
    
    // For now, return the full response since streaming through Edge Functions requires additional setup
    if (data && data.choices && data.choices[0]?.message?.content) {
      fullText = data.choices[0].message.content;
      onPartialResponse(fullText);
    }
    
    console.log("Full response received:", fullText.substring(0, 50) + "...");
    return fullText;
  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
}

// Add enhanced text-to-speech functionality with better voice quality
export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  // If we're using fallback TTS or have had too many failures, use the fallback
  if (isUsingFallbackTTS || ttsServiceFailures >= MAX_FAILURES) {
    throw new Error("Using fallback TTS");
  }

  try {
    console.log("Sending text to TTS API via Edge Function:", text.substring(0, 30) + "...");
    
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        endpoint: '/audio/speech',
        method: 'POST',
        body: {
          model: "tts-1-hd",
          voice: "nova",
          input: text,
          speed: 1.1,
          response_format: "mp3",
        }
      }
    });

    if (error) {
      console.error("TTS API error:", error);
      
      // Check if this is a quota error
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        console.log("API quota exceeded for TTS, switching to fallback");
        isUsingFallbackTTS = true;
        toast.error("OpenAI API quota exceeded for text-to-speech. Using browser speech instead.");
        
        // Reset after some time
        setTimeout(() => {
          isUsingFallbackTTS = false;
          ttsServiceFailures = 0;
        }, FAILURE_RESET_TIME);
        
        throw new Error("Using fallback TTS");
      }
      
      throw new Error(`Error generating speech: ${error.message}`);
    }

    // Convert base64 response to ArrayBuffer
    if (typeof data === 'string') {
      const binaryString = atob(data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }

    return data;
  } catch (error) {
    console.error("TTS service error:", error);
    
    // Track the failure if it's not the fallback message
    if (!error.message?.includes("Using fallback TTS")) {
      ttsServiceFailures++;
      setTimeout(() => {
        ttsServiceFailures = Math.max(0, ttsServiceFailures - 1);
      }, FAILURE_RESET_TIME);
    }
    
    throw error;
  }
}

// Function to generate speech based on chunks for real-time conversation
export async function generateSpeechFromChunk(chunk: string): Promise<HTMLAudioElement | null> {
  if (!chunk.trim()) return null;

  try {
    // Optimize speech generation by filtering out very short or meaningless chunks
    if (chunk.length < 4 && !chunk.match(/[.!?]/)) return null;
    
    // Process speech generation
    try {
      console.log("Generating speech from chunk:", chunk.substring(0, 30) + "...");
      const audioData = await textToSpeech(chunk);
      
      // Create blob from the audio data
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      
      // Create audio element
      const audio = new Audio(url);
      
      // Clean up the URL object once the audio has played
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
      
      return audio;
    } catch (error) {
      if (error.message?.includes("Using fallback TTS")) {
        console.log("Using fallback TTS for chunk:", chunk.substring(0, 30) + "...");
        // Use browser's built-in speech synthesis
        await fallbackTextToSpeech(chunk);
        return null; // No audio element needed when using browser speech
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error generating speech from chunk:", error);
    return null;
  }
}
