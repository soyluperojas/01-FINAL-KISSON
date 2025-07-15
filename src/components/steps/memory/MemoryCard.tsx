import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const MemoryCard = ({
  id,
  title,
  description,
  isSelected,
  onClick
}: MemoryCardProps) => {
  return (
    <Card 
      key={id} 
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 border-2 border-white relative overflow-hidden backdrop-blur-sm",
        isSelected
          ? "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
          : "bg-black hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] active:bg-gray-600"
      )} 
      onClick={onClick}
    >
      <div>
        <h4 className="text-[15pt] font-montserrat font-bold">{title}</h4>
        <p className="text-[15pt] font-montserrat font-bold opacity-70">{description}</p>
      </div>
    </Card>
  );
};

export default MemoryCard;
