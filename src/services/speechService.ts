
import { apiKeyManager } from "./apiKeyManager";
import { toast } from "@/components/ui/sonner";

// Track API failures to avoid repeated failing requests
let speechServiceFailures = 0;
const MAX_FAILURES = 3;
const FAILURE_RESET_TIME = 60000; // 1 minute

// SpeechService handles speech-to-text functionality
export async function transcribeSpeech(audioBlob: Blob): Promise<string> {
  if (!apiKeyManager.isApiKeyConfigured()) {
    throw new Error("API key not configured");
  }

  // If we've had too many failures recently, don't try again
  if (speechServiceFailures >= MAX_FAILURES) {
    console.log("Too many speech service failures recently, not attempting transcription");
    
    // Reset failures after some time to allow retrying
    setTimeout(() => {
      speechServiceFailures = 0;
      console.log("Speech service failures reset");
    }, FAILURE_RESET_TIME);
    
    return ""; // Return empty string to allow app to continue functioning
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model", "whisper-1");
  // Use English language parameter to ensure consistent results
  formData.append("language", "en");
  formData.append("response_format", "json");
  
  console.log("Sending audio for transcription...");
  
  try {
    // Set a shorter timeout for faster response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for faster response
    
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKeyManager.getApiKey()}`,
      },
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("Transcription error - Status:", response.status);
      const errorText = await response.text();
      console.error("Transcription error details:", errorText);
      
      // Handle quota exceeded errors
      if (errorText.includes("quota") || response.status === 429) {
        handleQuotaExceeded("transcription");
        return ""; // Return empty to allow app to continue
      }
      
      throw new Error(`Transcription failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Error transcribing speech");
    }
    
    console.log("Transcription successful:", data.text.substring(0, 30) + "...");
    return data.text;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Transcription request timed out");
      throw new Error("Transcription request timed out. Please try again.");
    }
    
    // Track the failure
    speechServiceFailures++;
    setTimeout(() => {
      speechServiceFailures = Math.max(0, speechServiceFailures - 1);
    }, FAILURE_RESET_TIME);
    
    console.error("OpenAI API error in transcription:", error);
    throw error;
  }
}

// Helper function to handle quota exceeded errors
function handleQuotaExceeded(service: string) {
  toast.error(`OpenAI API quota exceeded for ${service}. Using fallback mode.`);
  speechServiceFailures = MAX_FAILURES; // Prevent further attempts for a while
  
  // Reset after some time
  setTimeout(() => {
    speechServiceFailures = 0;
    console.log("Speech service failures reset");
  }, FAILURE_RESET_TIME);
}

// Improved fallback text-to-speech function with better reliability
export function fallbackTextToSpeech(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!text || !window.speechSynthesis) {
      resolve();
      return;
    }
    
    // Clean up any existing speech synthesis
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Set the voice to a natural sounding one if available
    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      // If no voices available yet, wait for them to load
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        
        // Try to find a good voice
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Natural') || 
          voice.name.includes('Female') ||
          voice.name.includes('Microsoft')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Now speak
        window.speechSynthesis.speak(utterance);
        console.log("Speaking with fallback TTS:", text.substring(0, 30) + "...");
      };
    } else {
      // Try to find a good voice
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') || 
        voice.name.includes('Female') ||
        voice.name.includes('Microsoft')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Now speak
      window.speechSynthesis.speak(utterance);
      console.log("Speaking with fallback TTS:", text.substring(0, 30) + "...");
    }
    
    // Handle completion and errors
    utterance.onend = () => {
      console.log("Fallback speech completed");
      resolve();
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      reject(new Error("Speech synthesis failed"));
    };
    
    // Ensure we resolve even if onend doesn't fire (which happens sometimes)
    const maxDuration = text.length * 50; // Rough estimate of speech duration
    setTimeout(() => {
      if (utterance.onend) {
        console.log("Resolving fallback speech promise after timeout");
        resolve();
      }
    }, Math.min(maxDuration, 10000)); // Cap at 10 seconds max wait
  });
}

// Check if speech synthesis is available in the browser
export function isSpeechSynthesisAvailable(): boolean {
  return 'speechSynthesis' in window;
}
