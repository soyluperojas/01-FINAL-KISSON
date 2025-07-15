
// ApiKeyManager is now deprecated - we use server-side API key configuration
// This file is kept for backward compatibility but no longer manages actual API keys

class ApiKeyManager {
  private apiKey: string | null = null;

  constructor() {
    // Clear any existing API keys from localStorage for security
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      console.log("Removing client-side API key for security");
      localStorage.removeItem("openai_api_key");
    }
  }

  setApiKey(key: string): void {
    // Deprecated - API keys are now handled server-side
    console.log("API key configuration is now handled server-side for security");
  }

  getApiKey(): string | null {
    // Return placeholder since we use server-side configuration
    return "server-side-configured";
  }

  isApiKeyConfigured(): boolean {
    // Always return true since we use server-side configuration
    return true;
  }
}

export const apiKeyManager = new ApiKeyManager();
