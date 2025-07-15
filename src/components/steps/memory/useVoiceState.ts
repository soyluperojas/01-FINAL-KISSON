
import { useState, useEffect } from "react";

export const useVoiceState = (introText: string) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false); // Default to false instead of true
  const [voiceResponseQueue, setVoiceResponseQueue] = useState<string[]>([]);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  
  // Process the voice response queue
  useEffect(() => {
    if (voiceResponseQueue.length > 0 && !isVoiceSpeaking) {
      setIsVoiceSpeaking(true);
    }
  }, [voiceResponseQueue, isVoiceSpeaking]);
  
  // Initialize with intro text but don't automatically enable voice
  useEffect(() => {
    setVoiceResponseQueue([introText]);
    // Removed automatic enabling of voice mode
  }, [introText]);
  
  // Helper to add responses to the queue
  const addVoiceResponse = (text: string) => {
    setVoiceResponseQueue(prev => [...prev, text]);
  };
  
  // Enable voice mode
  const enableVoiceMode = () => {
    setIsVoiceMode(true);
    
    // Welcome message for voice mode
    addVoiceResponse("Voice mode activated. I'll guide you through creating a memory recipe. What kind of memory would you like to transform into a recipe? You can choose from childhood memory, a feeling, an emotional event, or a story to pass on.");
  };
  
  // Handle voice playback completion
  const handleVoicePlaybackComplete = () => {
    setIsVoiceSpeaking(false);
  };
  
  return {
    isVoiceMode,
    voiceResponseQueue,
    isVoiceSpeaking,
    addVoiceResponse,
    enableVoiceMode,
    handleVoicePlaybackComplete,
    setVoiceResponseQueue,
  };
};
