import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { openAIService, ChatMessage } from "@/services/openAiService";
import { Send, Lock, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import type { RecipeData } from "./RecipeWizard";

interface ConversationInterfaceProps {
  recipeData: RecipeData;
  updateRecipeData: (data: Partial<RecipeData>) => void;
  viewRecipe: () => void;
}

const ConversationInterface = ({ recipeData, updateRecipeData, viewRecipe }: ConversationInterfaceProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant guiding users through creating emotional recipes from memories. Always respond in English regardless of the language of user input. You offer creative suggestions and thoughtful perspectives. Ask only ONE question at a time and wait for the user's response before moving to the next question. This creates a natural conversation flow. Extract information gradually and acknowledge what you learn about their recipe." },
    { role: "assistant", content: "Hello! I'm your Memory Recipe assistant. I'll help you create a recipe based on your memories and emotions. Let's start with one simple question: What kind of memory would you like to transform into a recipe today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [userContext, setUserContext] = useState<string>(""); // Store full user context
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Check if OpenAI API key is already set in the service
    setIsKeySet(openAIService.isApiKeyConfigured());
  }, []);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    
    openAIService.setApiKey(apiKey);
    setIsKeySet(true);
    toast.success("API key set successfully", {
      position: "top-center",
      duration: 3000,
    });
  };

  // Enhanced parsing with better context preservation
  const parseAndUpdateRecipeData = (responseText: string) => {
    console.log("Parsing AI response for recipe data:", responseText);
    
    // Build cumulative user context from all user messages
    const userMessages = messages
      .filter(msg => msg.role === "user")
      .map(msg => msg.content)
      .join(" ");
    setUserContext(userMessages);
    
    // Check for memory type
    const memoryTypeMatch = responseText.match(/memory (type|kind|is about):\s*([^\.;,\n]+)/i);
    if (memoryTypeMatch && !recipeData.memoryType) {
      updateRecipeData({ memoryType: memoryTypeMatch[2].trim() });
    }
    
    // Enhanced emotional ingredients extraction
    const emotionalIngredientsMatch = responseText.match(/emotional ingredients:\s*([^\.;,\n]+)/i);
    if (emotionalIngredientsMatch && recipeData.emotionalIngredients.length === 0) {
      const ingredients = emotionalIngredientsMatch[1].split(',').map(item => item.trim());
      updateRecipeData({ emotionalIngredients: ingredients });
    }
    
    // Check for actual ingredient with better context
    const actualIngredientMatch = responseText.match(/actual ingredient:\s*([^\.;,\n]+)/i);
    if (actualIngredientMatch && !recipeData.actualIngredient) {
      updateRecipeData({ actualIngredient: actualIngredientMatch[1].trim() });
    }
    
    // Store user preferences mentioned in conversation
    const userPreferences = {
      mentionedIngredients: extractMentionedIngredients(userMessages),
      preferredFlavors: extractPreferredFlavors(userMessages),
      cookingStyle: extractCookingStyle(userMessages)
    };
    
    // Store this in the recipe data for later use
    updateRecipeData({ 
      userPreferences,
      conversationContext: userMessages
    });
    
    // Check for dedication
    const dedicationMatch = responseText.match(/dedication:\s*([^\.;,\n]+)/i);
    if (dedicationMatch && !recipeData.dedication) {
      updateRecipeData({ dedication: dedicationMatch[1].trim() });
    }
    
    // Check for spice/condiment
    const spiceMatch = responseText.match(/spice or condiment:\s*([^\.;,\n]+)/i);
    if (spiceMatch && !recipeData.spiceOrCondiment) {
      updateRecipeData({ spiceOrCondiment: spiceMatch[1].trim() });
    }
    
    // Check for intensity
    const intensityMatch = responseText.match(/intensity:\s*([^\.;,\n]+)/i);
    if (intensityMatch && !recipeData.intensity) {
      updateRecipeData({ intensity: intensityMatch[1].trim() });
    }
    
    // Check for final emotion
    const finalEmotionMatch = responseText.match(/final emotion:\s*([^\.;,\n]+)/i);
    if (finalEmotionMatch && !recipeData.finalEmotion) {
      updateRecipeData({ finalEmotion: finalEmotionMatch[1].trim() });
    }
    
    // Check for serve time
    const serveTimeMatch = responseText.match(/serve time:\s*([^\.;,\n]+)/i);
    if (serveTimeMatch) {
      updateRecipeData({ serveTime: serveTimeMatch[1].trim() });
    }
  };

  // Helper functions to extract user preferences
  const extractMentionedIngredients = (text: string): string[] => {
    const commonIngredients = [
      'chicken', 'beef', 'pork', 'fish', 'vegetables', 'mushrooms', 'cheese',
      'apple', 'berries', 'chocolate', 'vanilla', 'cinnamon', 'garlic', 'herbs',
      'onion', 'tomato', 'spinach', 'carrots', 'potatoes'
    ];
    
    return commonIngredients.filter(ingredient => 
      text.toLowerCase().includes(ingredient.toLowerCase())
    );
  };

  const extractPreferredFlavors = (text: string): string[] => {
    const flavors = ['sweet', 'savory', 'spicy', 'mild', 'rich', 'light', 'creamy', 'fresh'];
    return flavors.filter(flavor => 
      text.toLowerCase().includes(flavor.toLowerCase())
    );
  };

  const extractCookingStyle = (text: string): string => {
    if (text.toLowerCase().includes('traditional') || text.toLowerCase().includes('classic')) {
      return 'traditional';
    }
    if (text.toLowerCase().includes('modern') || text.toLowerCase().includes('fusion')) {
      return 'modern';
    }
    if (text.toLowerCase().includes('simple') || text.toLowerCase().includes('easy')) {
      return 'simple';
    }
    return 'balanced';
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Create enhanced context for the assistant
      let contextPrompt = `You are helping to create a memory recipe. Always respond in English regardless of the input language. 

IMPORTANT GUIDELINES:
1. Ask only ONE question at a time.
2. Wait for the user to respond before asking the next question.
3. Keep your responses conversational and focused.
4. When you identify information about the recipe, note it clearly like "I understand your memory is about [memory]".
5. Pay close attention to specific ingredients, flavors, or cooking methods the user mentions.
6. Remember and acknowledge user preferences from previous messages.

CRITICAL: Always extract and acknowledge specific user inputs like:
- Ingredients they mention or prefer
- Cooking styles they describe
- Emotional connections they make
- Personal stories or details they share

Currently collected information:
`;

      if (recipeData.memoryType) contextPrompt += `- Memory type: ${recipeData.memoryType}\n`;
      if (recipeData.emotionalIngredients?.length) contextPrompt += `- Emotional ingredients: ${recipeData.emotionalIngredients.join(", ")}\n`;
      if (recipeData.actualIngredient) contextPrompt += `- Actual ingredient: ${recipeData.actualIngredient}\n`;
      if (recipeData.dedication) contextPrompt += `- Dedication: ${recipeData.dedication}\n`;
      if (recipeData.spiceOrCondiment) contextPrompt += `- Spice/condiment: ${recipeData.spiceOrCondiment}\n`;
      if (recipeData.intensity) contextPrompt += `- Intensity: ${recipeData.intensity}\n`;
      if (recipeData.shape) {
        contextPrompt += `- Shape: ${recipeData.shape.metaphor} (${recipeData.shape.geometry}) like ${recipeData.shape.example}\n`;
      }
      if (recipeData.finalEmotion) contextPrompt += `- Final emotion: ${recipeData.finalEmotion}\n`;
      if (recipeData.serveTime) contextPrompt += `- Serve time: ${recipeData.serveTime}\n`;
      if (recipeData.userPreferences) {
        contextPrompt += `- User mentioned ingredients: ${recipeData.userPreferences.mentionedIngredients?.join(", ") || "none"}\n`;
        contextPrompt += `- User preferred flavors: ${recipeData.userPreferences.preferredFlavors?.join(", ") || "none"}\n`;
        contextPrompt += `- User cooking style: ${recipeData.userPreferences.cookingStyle || "not specified"}\n`;
      }
      
      const chatHistory = [
        { role: "system" as const, content: contextPrompt },
        ...messages.filter(msg => msg.role !== "system"),
        userMessage
      ];

      let responseText = "";
      await openAIService.sendMessage(chatHistory, (partialResponse) => {
        responseText = partialResponse;
        setMessages(prev => {
          // Check if we've already added an assistant message
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === "assistant") {
            // Update the existing message
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: partialResponse }
            ];
          }
          // Add a new assistant message
          return [...prev, { role: "assistant", content: partialResponse }];
        });
      });
      
      // Parse the response to extract recipe data
      parseAndUpdateRecipeData(responseText);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.", {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecipeAndView = async () => {
    // Check if we have enough data to generate a recipe
    if (!recipeData.memoryType) {
      toast.warning("Please share more about your memory before generating a recipe", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    setIsGeneratingRecipe(true);

    try {
      // Set default values for any missing required fields
      const updatedData: Partial<RecipeData> = {};
      
      if (!recipeData.emotionalIngredients?.length) {
        updatedData.emotionalIngredients = ["nostalgia", "warmth"];
      }
      
      if (!recipeData.actualIngredient) {
        // Use user mentioned ingredients if available
        const mentionedIngredients = recipeData.userPreferences?.mentionedIngredients;
        updatedData.actualIngredient = mentionedIngredients?.[0] || "mushrooms";
      }
      
      if (!recipeData.dedication) {
        updatedData.dedication = "loved ones";
      }
      
      if (!recipeData.spiceOrCondiment) {
        updatedData.spiceOrCondiment = "salt";
      }
      
      if (!recipeData.intensity) {
        updatedData.intensity = "medium";
      }
      
      if (!recipeData.finalEmotion) {
        updatedData.finalEmotion = "comfort";
      }

      if (!recipeData.shape) {
        updatedData.shape = {
          value: "pebble",
          metaphor: "Like a wet stone",
          geometry: "Oval",
          example: "river rock",
          image: ""
        };
      }
      
      if (!recipeData.serveTime) {
        updatedData.serveTime = "present";
      }
      
      // Update recipe data with defaults if needed
      if (Object.keys(updatedData).length > 0) {
        updateRecipeData(updatedData);
      }
      
      // Call viewRecipe function to navigate to the recipe display
      console.log("Creating recipe with user context:", userContext);
      viewRecipe();
      
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create your recipe. Please try again.", {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!isKeySet ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Please enter your OpenAI API key to continue.
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
              <Lock className="h-4 w-4 mr-1" /> Set Key
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-grow flex flex-col">
            <Card className="bg-muted/20 rounded-md flex-grow p-4 overflow-y-auto mb-4">
              <div className="space-y-4">
                {messages.filter(msg => msg.role !== "system").map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </Card>
            
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your memory, or ask for guidance on creating your recipe..."
                className="flex-1 resize-none min-h-[100px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || isLoading}
                className="h-auto"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleCreateRecipeAndView} 
                disabled={isGeneratingRecipe || !recipeData.memoryType}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
              >
                {isGeneratingRecipe ? (
                  <>Creating Recipe...</>
                ) : (
                  <>Create Recipe <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationInterface;
