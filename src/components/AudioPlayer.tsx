
import { useRef, useEffect, useState } from "react";
import { generateSpeechFromChunk } from "@/services/chatService";
import { fallbackTextToSpeech } from "@/services/speechService";

interface AudioPlayerProps {
  text: string;
  onPlaybackComplete?: () => void;
  enabled: boolean;
}

const AudioPlayer = ({ text, onPlaybackComplete, enabled }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const previousTextRef = useRef<string>("");
  const pendingChunkRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef<boolean>(false);
  const fallbackModeRef = useRef<boolean>(false);
  const playbackCompleteCalledRef = useRef<boolean>(false);
  const playbackMonitorRef = useRef<NodeJS.Timeout | null>(null);
  
  // Process text chunks more efficiently
  const processTextChunks = async () => {
    if (!enabled || processingRef.current || !pendingChunkRef.current) return;
    
    processingRef.current = true;
    const chunk = pendingChunkRef.current;
    pendingChunkRef.current = "";
    
    try {
      // Generate speech for chunk
      console.log("Processing text chunk:", chunk.substring(0, 30) + "...");
      const audio = await generateSpeechFromChunk(chunk);
      
      // If audio is null but we're in fallback mode, speech was handled by the browser
      if (!audio && fallbackModeRef.current) {
        console.log("Fallback speech completed for chunk");
        processingRef.current = false;
        
        // Process any pending chunks
        if (pendingChunkRef.current) {
          setTimeout(() => processTextChunks(), 10);
        } else if (onPlaybackComplete && !playbackCompleteCalledRef.current) {
          playbackCompleteCalledRef.current = true;
          onPlaybackComplete();
        }
        return;
      }
      
      if (audio) {
        if (!isPlaying) {
          setIsPlaying(true);
          audioRef.current = audio;
          
          // Play the audio immediately
          console.log("Playing audio chunk directly");
          
          // Set up onended handler before playing
          audio.onended = () => {
            // If there are more audio elements in the queue, play the next one
            if (audioQueueRef.current.length > 0) {
              console.log("Playing next audio from queue, remaining:", audioQueueRef.current.length);
              const nextAudio = audioQueueRef.current.shift();
              if (nextAudio) {
                audioRef.current = nextAudio;
                nextAudio.play().catch(err => {
                  console.error("Error playing queued audio:", err);
                  processingRef.current = false;
                  handlePlaybackError();
                });
              }
            } else {
              // No more audio to play
              console.log("Audio playback complete");
              setIsPlaying(false);
              audioRef.current = null;
              
              // Process any pending chunks
              processingRef.current = false;
              if (pendingChunkRef.current) {
                setTimeout(() => processTextChunks(), 10);
              } else if (onPlaybackComplete && !playbackCompleteCalledRef.current) {
                playbackCompleteCalledRef.current = true;
                onPlaybackComplete();
              }
            }
          };
          
          // Setup playback monitoring to detect stalled audio
          if (playbackMonitorRef.current) {
            clearInterval(playbackMonitorRef.current);
          }
          
          playbackMonitorRef.current = setInterval(() => {
            if (audioRef.current && audioRef.current.paused && isPlaying) {
              console.log("Detected stalled audio playback");
              clearInterval(playbackMonitorRef.current!);
              
              // Force completion if audio is stalled
              setIsPlaying(false);
              audioRef.current = null;
              processingRef.current = false;
              
              if (onPlaybackComplete && !playbackCompleteCalledRef.current) {
                playbackCompleteCalledRef.current = true;
                onPlaybackComplete();
              }
            }
          }, 1000);
          
          // Now play the audio
          audio.play().catch(err => {
            console.error("Error playing audio:", err);
            processingRef.current = false;
            handlePlaybackError();
          });
        } else {
          // If already playing, queue this audio
          console.log("Adding audio to queue");
          audioQueueRef.current.push(audio);
          processingRef.current = false;
        }
      } else {
        processingRef.current = false;
        
        // No audio was generated, but we should still indicate completion
        if (!pendingChunkRef.current && onPlaybackComplete && !playbackCompleteCalledRef.current) {
          console.log("No audio was generated, marking playback complete");
          playbackCompleteCalledRef.current = true;
          onPlaybackComplete();
        }
      }
    } catch (error) {
      console.error("Error playing audio chunk:", error);
      handlePlaybackError();
    }
  };
  
  // Handle errors in audio playback
  const handlePlaybackError = () => {
    // Try fallback if playing fails
    fallbackModeRef.current = true;
    const chunk = pendingChunkRef.current || "I'm ready to assist you";
    pendingChunkRef.current = "";
    
    fallbackTextToSpeech(chunk).then(() => {
      if (pendingChunkRef.current) {
        setTimeout(() => processTextChunks(), 10);
      } else if (onPlaybackComplete && !playbackCompleteCalledRef.current) {
        playbackCompleteCalledRef.current = true;
        onPlaybackComplete();
      }
    }).catch(err => {
      console.error("Fallback speech failed:", err);
      // Even if fallback fails, ensure we call completion callback
      if (onPlaybackComplete && !playbackCompleteCalledRef.current) {
        playbackCompleteCalledRef.current = true;
        onPlaybackComplete();
      }
    });
  };
  
  // Process text in larger, more meaningful chunks for better speech
  const getOptimalChunks = (text: string): string[] => {
    if (!text.trim()) return [];
    
    // Split by sentence ending punctuation with a space after
    const sentenceRegex = /[.!?]+\s+/g;
    const sentences = text.split(sentenceRegex);
    const punctuation = text.match(sentenceRegex) || [];
    
    const result: string[] = [];
    sentences.forEach((sentence, i) => {
      if (sentence.trim()) {
        if (punctuation[i]) {
          result.push(sentence + punctuation[i]);
        } else if (i === sentences.length - 1) {
          result.push(sentence);
        }
      }
    });
    
    // If no proper sentences were found, return the whole text as one chunk
    if (result.length === 0 && text.trim()) {
      return [text.trim()];
    }
    
    return result;
  };
  
  useEffect(() => {
    if (!enabled) return;
    
    // Reset the completion flag when text changes
    if (text !== previousTextRef.current) {
      playbackCompleteCalledRef.current = false;
    }
    
    // Only process if text is different from what we've already processed
    if (text && text !== previousTextRef.current) {
      console.log(`New text to process: "${text.substring(0, 30)}..."`);
      
      const newText = text.substring(previousTextRef.current.length);
      previousTextRef.current = text;
      
      if (newText.trim()) {
        // Get optimal chunks for speech
        const chunks = getOptimalChunks(newText);
        console.log(`Split into ${chunks.length} chunks for processing`);
        
        if (chunks.length > 0) {
          // Join chunks for processing
          pendingChunkRef.current += chunks.join(" ");
          
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Start processing after a short delay to allow for text accumulation
          if (!processingRef.current) {
            timeoutRef.current = setTimeout(() => {
              processTextChunks();
              timeoutRef.current = null;
            }, 20);
          }
        }
      }
    } else if (text && !isPlaying && !processingRef.current && enabled && !playbackCompleteCalledRef.current) {
      // If we have text but nothing is playing or processing, ensure we call completion
      console.log("Text exists but nothing is playing or processing, ensuring completion");
      if (onPlaybackComplete) {
        playbackCompleteCalledRef.current = true;
        onPlaybackComplete();
      }
    }
  }, [text, enabled]);
  
  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      // Stop and clean up current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
      
      // Clean up any queued audio
      audioQueueRef.current = [];
      
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Clear playback monitor
      if (playbackMonitorRef.current) {
        clearInterval(playbackMonitorRef.current);
      }
      
      // Cancel any pending speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  return null; // This is a non-visual component
};

export default AudioPlayer;

