
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";
import VoiceInput from './VoiceInput';
import VoiceOutput from './VoiceOutput';
import { RecipeData } from './RecipeWizard';
import { sendMessage, type ChatMessage } from '@/services/chatService';
import { toast } from "@/components/ui/sonner";

interface VoiceAssistantProps {
  recipeData: RecipeData;
  updateRecipeData: (data: Partial<RecipeData>) => void;
  onClose?: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  recipeData,
  updateRecipeData,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful cooking assistant that helps create recipes from memories. Keep responses brief and focused. Ask one question at a time." },
    { role: "assistant", content: "Hi! I'm your memory recipe assistant. What kind of memory would you like to transform into a recipe?" }
  ]);
  const [currentResponse, setCurrentResponse] = useState<string>(messages[1].content);
  const [isConversationActive, setIsConversationActive] = useState(false);

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript || isProcessing) return;
    
    const userMessage = { role: "user" as const, content: transcript };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      let responseText = "";
      await sendMessage([...messages, userMessage], (partialResponse) => {
        responseText = partialResponse;
        setCurrentResponse(partialResponse);
      });
      
      // Add the final response to messages
      setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
      
      // Extract recipe data from the response
      parseAndUpdateRecipeData(responseText);
      
      // Set conversation as active once we've had user input
      if (!isConversationActive) {
        setIsConversationActive(true);
      }
      
    } catch (error) {
      console.error("Error processing voice input:", error);
      toast.error("Failed to process your input. Please try again.");
      setCurrentResponse("I'm sorry, I couldn't process that. Could you try again?");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const parseAndUpdateRecipeData = (responseText: string) => {
    // Check for memory type
    const memoryTypeMatch = responseText.match(/memory (type|kind|is about):\s*([^\.;,\n]+)/i);
    if (memoryTypeMatch && !recipeData.memoryType) {
      updateRecipeData({ memoryType: memoryTypeMatch[2].trim() });
    }
    
    // Check for emotional ingredients
    const emotionalIngredientsMatch = responseText.match(/emotional ingredients:\s*([^\.;,\n]+)/i);
    if (emotionalIngredientsMatch && recipeData.emotionalIngredients.length === 0) {
      const ingredients = emotionalIngredientsMatch[1].split(',').map(item => item.trim());
      updateRecipeData({ emotionalIngredients: ingredients });
    }
    
    // Check for actual ingredient
    const actualIngredientMatch = responseText.match(/actual ingredient:\s*([^\.;,\n]+)/i);
    if (actualIngredientMatch && !recipeData.actualIngredient) {
      updateRecipeData({ actualIngredient: actualIngredientMatch[1].trim() });
    }
    
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

  return (
    <>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full p-3 bg-orange-500 hover:bg-orange-600 shadow-lg"
        >
          <Mic className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="fixed bottom-6 right-6 p-4 shadow-lg w-80 z-50 border border-orange-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Voice Assistant</h3>
            <Button variant="ghost" size="sm" onClick={onClose || (() => setIsOpen(false))} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-4 p-3 bg-muted rounded-md max-h-32 overflow-y-auto">
            {currentResponse}
          </div>
          
          <div className="flex flex-col gap-3">
            <VoiceInput
              recipeData={recipeData}
              updateRecipeData={(data) => {
                if (data.writtenMemory) {
                  handleVoiceInput(data.writtenMemory);
                }
                updateRecipeData(data);
              }}
              compact={true}
              autoStart={isConversationActive}
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {isProcessing ? "Processing..." : "Ready to listen"}
              </span>
              <VoiceOutput 
                text={currentResponse} 
                autoPlay={true} 
              />
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default VoiceAssistant;
