
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { openAIService, ChatMessage } from "@/services/openAiService";
import { MessageSquare, Send, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatAssistantProps {
  recipeData?: any;
  currentStep?: number;
}

const ChatAssistant = ({ recipeData, currentStep = 0 }: ChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant guiding users through creating emotional recipes from memories. You offer creative suggestions and thoughtful perspectives." },
    { role: "assistant", content: "Hello! I'm your Memory Recipe assistant. How can I help you craft your emotional recipe today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key");
      return;
    }
    
    openAIService.setApiKey(apiKey);
    setIsKeySet(true);
    toast.success("API key set successfully");
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Create context for the assistant based on current recipe data
      let contextPrompt = "";
      if (recipeData) {
        contextPrompt = `The user is currently working on a memory recipe with the following data:\n`;
        if (recipeData.memoryType) contextPrompt += `- Memory type: ${recipeData.memoryType}\n`;
        if (recipeData.emotionalIngredients?.length) contextPrompt += `- Emotional ingredients: ${recipeData.emotionalIngredients.join(", ")}\n`;
        if (recipeData.actualIngredient) contextPrompt += `- Actual ingredient: ${recipeData.actualIngredient}\n`;
        if (recipeData.dedication) contextPrompt += `- Dedication: ${recipeData.dedication}\n`;
        if (recipeData.intensity) contextPrompt += `- Intensity: ${recipeData.intensity}\n`;
        contextPrompt += `They are currently at step ${currentStep + 1} of the recipe creation process.`;
      }

      const chatHistory = [...messages, userMessage];
      if (contextPrompt) {
        // Insert context as a system message before the user's latest message
        chatHistory.splice(chatHistory.length - 1, 0, { 
          role: "system", 
          content: contextPrompt 
        });
      }

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
      
      // Ensure the final response is added
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === "assistant") {
          return prev; // Already updated through streaming
        }
        return [...prev, { role: "assistant", content: responseText }];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              <span>Recipe Assistant</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>

          {!isKeySet ? (
            <CardContent className="space-y-4">
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
            </CardContent>
          ) : (
            <>
              <CardContent className="pt-2">
                <div className="h-60 overflow-y-auto p-3 bg-muted/20 rounded-md space-y-4">
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
              </CardContent>
              <CardFooter className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask something about your recipe..."
                  className="flex-1 resize-none"
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
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatAssistant;
