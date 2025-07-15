
// Import toast at the top to avoid circular dependency issues
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Main service file that re-exports everything
import { sendMessage, textToSpeech } from "./chatService";
import { transcribeSpeech } from "./speechService";
import { generateText } from "./textGenerationService";
import { generateImage } from "./imageGenerationService";
import { ChatMessage } from "./types";

// Re-export types
export type { ChatMessage };

// OpenAIService class that provides a unified interface to all services
class OpenAIService {
  // Track which permissions the API key has
  private permissions = {
    chat: false,
    image: false
  };

  setApiKey(key: string) {
    // This method is now deprecated since we use server-side API key
    console.log("API key setting is now handled server-side for security");
    toast.success("Application is using secure server-side API key configuration");
  }

  private async checkApiKeyPermissions() {
    try {
      console.log("Checking API key permissions via Edge Function...");
      
      // Test chat permissions
      const { data, error } = await supabase.functions.invoke('openai-proxy', {
        body: {
          endpoint: '/chat/completions',
          method: 'POST',
          body: {
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "Permission check" }],
            max_tokens: 1,
          }
        }
      });
      
      if (!error && data) {
        console.log("API key has valid permissions for chat completions");
        this.permissions.chat = true;
        
        // Test DALL-E permissions
        try {
          const imageTest = await supabase.functions.invoke('openai-proxy', {
            body: {
              endpoint: '/images/generations',
              method: 'POST',
              body: {
                model: "dall-e-3",
                prompt: "A simple test image of a circle",
                n: 1,
                size: "1024x1024",
              }
            }
          });
          
          if (!imageTest.error) {
            console.log("API key has valid permissions for DALL-E image generation ✓");
            this.permissions.image = true;
            toast.success("DALL-E image generation is enabled", {
              position: "top-center",
              duration: 3000,
            });
          }
        } catch (e) {
          console.warn("DALL-E may not be available:", e);
        }
      } else {
        console.warn("API key may have limited permissions:", error);
        toast.warning("API key permissions may be limited", {
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Failed to verify API key permissions:", error);
      toast.error("Could not verify API key permissions", {
        position: "top-center",
        duration: 3000,
      });
    }
  }

  getApiKey() {
    // Return a placeholder since we now use server-side API key
    return "server-side-configured";
  }

  isApiKeyConfigured() {
    // Always return true since we use server-side configuration
    console.log("Using server-side API key configuration");
    return true;
  }
  
  hasImagePermission() {
    return this.permissions.image;
  }

  async sendMessage(messages: ChatMessage[], onPartialResponse: (text: string) => void): Promise<string> {
    return sendMessage(messages, onPartialResponse);
  }

  async transcribeSpeech(audioBlob: Blob): Promise<string> {
    return transcribeSpeech(audioBlob);
  }

  async generateText(prompt: string): Promise<string> {
    return generateText(prompt);
  }

  async generateImage(prompt: string, shape?: string, ingredients?: string[], intensity?: string): Promise<string> {
    console.log("OpenAIService: Generating image with prompt:", prompt, "shape:", shape, "ingredients:", ingredients, "intensity:", intensity);
    return generateImage(prompt, shape, ingredients, intensity);
  }
  
  async textToSpeech(text: string): Promise<ArrayBuffer> {
    return textToSpeech(text);
  }

  // Add a method to manually check DALL-E permissions
  async checkDallEPermissions(): Promise<boolean> {
    try {
      console.log("Manually checking DALL-E permissions via Edge Function...");
      
      const { data, error } = await supabase.functions.invoke('openai-proxy', {
        body: {
          endpoint: '/images/generations',
          method: 'POST',
          body: {
            model: "dall-e-3",
            prompt: "A simple test image of a circle on a white background",
            n: 1,
            size: "1024x1024",
          }
        }
      });
      
      if (!error && data) {
        console.log("DALL-E permissions verified ✓");
        this.permissions.image = true;
        toast.success("DALL-E image generation is enabled and working!");
        return true;
      } else {
        console.warn("DALL-E permission issue:", error);
        toast.error(`DALL-E is not available: ${error?.message || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error("Failed to check DALL-E permissions:", error);
      toast.error("Error checking DALL-E permissions");
      return false;
    }
  }

  // Initialize permissions check on service creation
  async initialize() {
    await this.checkApiKeyPermissions();
  }
}

export const openAIService = new OpenAIService();

// Initialize the service
openAIService.initialize();
