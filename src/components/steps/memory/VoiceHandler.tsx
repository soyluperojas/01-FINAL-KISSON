
import { useEffect, useState } from "react";
import VoiceOutput from "../../VoiceOutput";

interface VoiceHandlerProps {
  voiceResponses: string[];
  isVoiceMode: boolean;
  isVoiceSpeaking: boolean;
  onPlaybackComplete: () => void;
}

const VoiceHandler = ({ 
  voiceResponses,
  isVoiceMode,
  isVoiceSpeaking,
  onPlaybackComplete
}: VoiceHandlerProps) => {
  return (
    <div className="hidden">
      <VoiceOutput 
        text={voiceResponses[0] || ""} 
        autoPlay={false} // Changed from isVoiceMode && isVoiceSpeaking to false
        playImmediately={false} // Changed from isVoiceMode && isVoiceSpeaking to false
        onPlaybackComplete={onPlaybackComplete}
      />
    </div>
  );
};

export default VoiceHandler;
