
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { RecipeData } from "../../RecipeWizard";
import VoiceInput from "../../VoiceInput";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { validateInput } from "@/utils/profanityFilter";

interface WrittenMemoryInputProps {
  writtenMemory: string;
  onMemoryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  recipeData: RecipeData;
}

const WrittenMemoryInput = ({
  writtenMemory,
  onMemoryChange,
  recipeData
}: WrittenMemoryInputProps) => {
  const [showVoiceInput, setShowVoiceInput] = React.useState(false);
  const [error, setError] = useState<string>("");

  const handleMemoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const validation = validateInput(e.target.value);
    
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }
    
    setError("");
    onMemoryChange(e);
  };

  const handleVoiceMemoryUpdate = (transcription: string) => {
    const validation = validateInput(transcription);
    
    if (!validation.isValid) {
      setError(validation.message || "");
      return;
    }
    
    setError("");
    
    // Update parent with transcribed voice input
    const syntheticEvent = {
      target: { value: transcription }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onMemoryChange(syntheticEvent);
  };

  return (
    <div className="space-y-3 mt-3">
      <Textarea 
        placeholder="" 
        className="min-h-[100px] bg-background/50 border-orange-500/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
        value={writtenMemory}
        onChange={handleMemoryChange}
      />
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      
      {/* Elimino el botón y la opción de grabar memoria */}
      {/*
      {!showVoiceInput ? (
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center gap-2 mt-2"
          onClick={() => setShowVoiceInput(true)}
        >
          <Mic className="w-4 h-4" /> Record your memory
        </Button>
      ) : (
        <div className="p-3 border rounded-md mt-2">
          <VoiceInput 
            recipeData={recipeData} 
            updateRecipeData={(data) => {
              if (data.writtenMemory) {
                handleVoiceMemoryUpdate(data.writtenMemory);
              }
            }}
            compact={true}
            onClose={() => setShowVoiceInput(false)}
            onTranscriptionComplete={handleVoiceMemoryUpdate}
          />
        </div>
      )}
      */}
    </div>
  );
};

export default WrittenMemoryInput;
