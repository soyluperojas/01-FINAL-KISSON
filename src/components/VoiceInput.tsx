
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, X, Volume2 } from "lucide-react";
import { RecipeData } from './RecipeWizard';
import { toast } from "@/components/ui/sonner";
import { transcribeSpeech } from '@/services/speechService';

// Define the interface for the voice input props
interface VoiceInputProps {
  recipeData: RecipeData;
  updateRecipeData: (data: Partial<RecipeData>) => void;
  compact?: boolean;
  onClose?: () => void;
  onTranscriptionComplete?: (transcription: string) => void; // New callback prop
  autoStart?: boolean; // New prop to automatically start listening
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  recipeData, 
  updateRecipeData, 
  compact = false, 
  onClose, 
  onTranscriptionComplete,
  autoStart = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrame = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_TIME = 30000; // 30 seconds max recording time

  // Auto-start recording if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startListening();
    }
    
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, [autoStart]);

  // Function to start audio visualization
  const startAudioVisualization = async (stream: MediaStream) => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      streamRef.current = stream;
      microphone.current = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      microphone.current.connect(analyser.current);
      
      const updateAudioLevel = () => {
        if (!analyser.current || !isListening) return;
        
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = Math.min(1, average / 128); // Normalize to 0-1 range
        
        setAudioLevel(normalizedLevel);
        
        // Auto-stop if silence detected for a period (optional, disabled for now)
        // if (normalizedLevel < 0.05) {
        //   silenceCounter.current++;
        // } else {
        //   silenceCounter.current = 0;
        // }
        
        // if (silenceCounter.current > 60) { // About 1 second of silence
        //   stopListening();
        //   return;
        // }
        
        animationFrame.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  // Function to stop audio visualization
  const stopAudioVisualization = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    if (microphone.current) {
      microphone.current.disconnect();
      microphone.current = null;
    }
    
    setAudioLevel(0);
  };

  // Function to start recording
  const startListening = async () => {
    try {
      setIsListening(true);
      setTranscript('');
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Start audio visualization
      startAudioVisualization(stream);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessingAudio(true);
        
        try {
          // Create blob from recorded chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log("Audio recorded, sending for transcription...", audioBlob.size, "bytes");
          
          // Use the OpenAI API to transcribe the speech
          const text = await transcribeSpeech(audioBlob);
          console.log("Transcription received:", text);
          
          if (text) {
            setTranscript(text);
            updateRecipeData({ writtenMemory: text });
            
            // Call the onTranscriptionComplete callback if provided
            if (onTranscriptionComplete) {
              onTranscriptionComplete(text);
            }
          } else {
            toast.error("Couldn't detect any speech. Please try again.");
          }
        } catch (error) {
          console.error("Error transcribing speech:", error);
          toast.error("Error transcribing speech. Please try again.");
        } finally {
          setIsProcessingAudio(false);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      toast.info("Listening...");

      // Set a timeout to automatically stop recording after MAX_RECORDING_TIME
      recordingTimeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening();
          toast.info("Recording stopped automatically (maximum time reached)");
        }
      }, MAX_RECORDING_TIME);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone");
      setIsListening(false);
    }
  };

  // Function to stop recording
  const stopListening = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    stopAudioVisualization();
    setIsListening(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopListening();
      stopAudioVisualization();
    };
  }, []);

  // Visual animation component for audio level
  const AudioLevelIndicator = () => {
    const rings = 3;
    
    return (
      <div className="relative flex items-center justify-center">
        {[...Array(rings)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500 opacity-50"
            style={{
              width: `${36 + (i * 16 * audioLevel)}px`,
              height: `${36 + (i * 16 * audioLevel)}px`,
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        <Mic className={`h-6 w-6 z-10 text-${isListening ? 'orange-500' : 'muted'}`} />
      </div>
    );
  };

  if (compact) {
    return (
      <div className="voice-input">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Voice Input</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          {isListening ? (
            <>
              <div className="flex justify-center my-2">
                <AudioLevelIndicator />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={stopListening}
              >
                Stop Recording
              </Button>
            </>
          ) : isProcessingAudio ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-pulse text-orange-500">Processing audio...</div>
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Button 
              variant="outline"
              size="sm"
              className="w-full"
              onClick={startListening}
            >
              Start Speaking
            </Button>
          )}
          
          {transcript && (
            <p className="text-sm mt-2 italic">"{transcript}"</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="voice-input">
      <h2>Voice Input</h2>
      
      <div className="flex flex-col space-y-4">
        {isListening ? (
          <>
            <div className="flex justify-center">
              <AudioLevelIndicator />
            </div>
            <Button 
              variant="destructive" 
              onClick={stopListening}
            >
              Stop Recording
            </Button>
          </>
        ) : isProcessingAudio ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-pulse text-orange-500">Processing audio...</div>
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Button onClick={startListening}>
            Start Speaking
          </Button>
        )}
        
        {transcript && (
          <div className="mt-4">
            <h3>Recorded Memory:</h3>
            <p className="italic">"{transcript}"</p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.5;
            }
            50% {
              transform: scale(1);
              opacity: 0.3;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VoiceInput;
