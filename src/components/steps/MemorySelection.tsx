import { useState } from "react";
import { RecipeData } from "../RecipeWizard";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MemoryCard from "./memory/MemoryCard";
import WrittenMemoryInput from "./memory/WrittenMemoryInput";
import VoiceHandler from "./memory/VoiceHandler";
import { useVoiceState } from "./memory/useVoiceState";
import { memories, introText } from "./memory/memoryData";

interface MemorySelectionProps {
  updateData: (data: Partial<RecipeData>) => void;
  data: RecipeData;
}

const MemorySelection = ({
  updateData,
  data
}: MemorySelectionProps) => {
  const [selected, setSelected] = useState<string>(data.memoryType || "");
  const [isWrittenMemory, setIsWrittenMemory] = useState<boolean>(data.memoryType === "written");
  const [writtenMemory, setWrittenMemory] = useState<string>(data.writtenMemory || "");

  const {
    isVoiceMode,
    voiceResponseQueue,
    isVoiceSpeaking,
    addVoiceResponse,
    enableVoiceMode,
    handleVoicePlaybackComplete
  } = useVoiceState(introText);

  const handleSelect = (memoryType: string) => {
    setSelected(memoryType);
    setIsWrittenMemory(false);
    updateData({ memoryType });

    const memory = memories.find(m => m.id === memoryType);
    const responseText = `You've selected ${memory?.title.toLowerCase()}. Would you like to describe this memory in your own words?`;
    if (isVoiceMode) {
      addVoiceResponse(responseText);
    }
  };

  const handleWrittenMemorySelect = () => {
    setSelected("written");
    setIsWrittenMemory(true);
    updateData({ memoryType: "written", writtenMemory });

    const responseText = "Please describe your memory in your own words.";
    if (isVoiceMode) {
      addVoiceResponse(responseText);
    }
  };

  const handleMemoryTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setWrittenMemory(text);
    if (isWrittenMemory) {
      updateData({ writtenMemory: text });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      <div>
        {/* Pregunta principal: 25pt Montserrat Bold centrada */}
        <h3 className="text-[25pt] font-montserrat font-bold text-center text-white mb-4">
          What kind of memory are you ready to transform into a recipe?
        </h3>

        {/* Opciones de memoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map(memory => (
            <MemoryCard
              key={memory.id}
              id={memory.id}
              title={memory.title}
              description={memory.description}
              isSelected={selected === memory.id}
              onClick={() => handleSelect(memory.id)}
            />
          ))}
        </div>

        {/* Opción de escribir tu propia memoria */}
        <div className="mt-4">
          <Card
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md card-gradient w-full bg-black/50 backdrop-blur-sm border-white/20 text-white",
              selected === "written" ? "border-white/50 ring-2 ring-white/50" : "hover:border-white/30"
            )}
            onClick={handleWrittenMemorySelect}
          >
            <div className="flex-1">
              {/* Título de respuesta: 15pt Bold */}
              <h4 className="text-[15pt] font-montserrat font-bold text-white">
                Write your own memory
              </h4>
              <p className="text-sm opacity-75 mb-2 text-white">
                Express your memory in your own words
              </p>

              {isWrittenMemory && (
                <WrittenMemoryInput
                  writtenMemory={writtenMemory}
                  onMemoryChange={handleMemoryTextChange}
                  recipeData={data}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Componente de voz */}
      <VoiceHandler
        voiceResponses={voiceResponseQueue}
        isVoiceMode={isVoiceMode}
        isVoiceSpeaking={isVoiceSpeaking}
        onPlaybackComplete={handleVoicePlaybackComplete}
      />
    </div>
  );
};

export default MemorySelection;
