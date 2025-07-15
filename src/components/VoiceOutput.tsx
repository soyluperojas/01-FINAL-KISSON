
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { generateSpeechFromChunk } from "@/services/chatService";
import { toast } from "@/components/ui/sonner";

interface VoiceOutputProps {
  text: string;
  autoPlay?: boolean;
  onPlaybackComplete?: () => void;
  playImmediately?: boolean; // New prop to force immediate playback
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({ 
  text, 
  autoPlay = false,
  onPlaybackComplete,
  playImmediately = false // Default to false for backward compatibility
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const previousTextRef = useRef<string>("");
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Effect for handling new text input
  useEffect(() => {
    if (isMuted) return;
    
    // If playImmediately is true, always speak the text even if it's the same
    const shouldSpeakText = playImmediately || (
      text && 
      text !== previousTextRef.current && 
      !isPlaying
    );
    
    if (shouldSpeakText) {
      previousTextRef.current = text;
      if (autoPlay || playImmediately) {
        speakText(text);
      }
    }
  }, [text, autoPlay, isMuted, playImmediately]);
  
  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Clear any queued audio
      audioQueueRef.current.forEach(audio => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      });
      audioQueueRef.current = [];
    };
  }, []);
  
  const speakText = async (textToSpeak: string) => {
    if (isMuted || !textToSpeak) return;
    
    setIsPlaying(true);
    
    try {
      // Break text into sentences for more natural speech
      const sentences = textToSpeak.match(/[^.!?]+[.!?]+/g) || [textToSpeak];
      
      for (const sentence of sentences) {
        if (sentence.trim()) {
          try {
            const audio = await generateSpeechFromChunk(sentence);
            if (audio) {
              playAudio(audio);
              // Wait for this audio to complete before processing next sentence
              await new Promise<void>((resolve) => {
                audio.onended = () => resolve();
              });
            }
          } catch (error) {
            console.error("Error generating speech:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error processing text for speech:", error);
      toast.error("Could not generate speech");
    } finally {
      setIsPlaying(false);
      if (onPlaybackComplete) {
        onPlaybackComplete();
      }
    }
  };
  
  const playAudio = (audio: HTMLAudioElement) => {
    currentAudioRef.current = audio;
    
    audio.onended = () => {
      URL.revokeObjectURL(audio.src);
      currentAudioRef.current = null;
      
      // Play next audio in queue if any
      if (audioQueueRef.current.length > 0) {
        const nextAudio = audioQueueRef.current.shift();
        if (nextAudio) {
          playAudio(nextAudio);
        }
      }
    };
    
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error("Could not play audio");
    });
  };
  
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // Stop any playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Clear queue
      audioQueueRef.current = [];
      
      toast.info("Voice output muted");
    } else {
      toast.info("Voice output enabled");
    }
  };
  
  const manualSpeak = () => {
    if (text && !isPlaying) {
      speakText(text);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
        onClick={toggleMute}
        title={isMuted ? "Unmute voice" : "Mute voice"}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      
      {!autoPlay && !isMuted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={manualSpeak}
          disabled={isPlaying || !text}
          className="text-xs"
        >
          Play
        </Button>
      )}
    </div>
  );
};

export default VoiceOutput;
