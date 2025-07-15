import { Button } from "@/components/ui/button";
import { RefreshCcw, Share2, Copy, FileText, Receipt } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import WhiteTransition from "./WhiteTransition"; // asegúrate que la ruta es correcta

interface ActionButtonsProps {
  shareableUrl: string;
  recipeTitle: string;
  onFinish: () => void;
  onPrintThermal?: () => void;
  onPrintA4?: () => void;
}

export const ActionButtons = ({
  shareableUrl,
  recipeTitle,
  onFinish,
  onPrintThermal,
  onPrintA4,
}: ActionButtonsProps) => {
  const [showTransition, setShowTransition] = useState(false);

  const handleShare = async () => {
    if (!shareableUrl) {
      toast.error("Recipe not ready for sharing yet");
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipeTitle || "Memory Recipe",
          text: "Check out this memory recipe I created!",
          url: shareableUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareableUrl);
        toast.success("Recipe link copied to clipboard!");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        toast.success("Recipe link copied to clipboard!");
      } catch {
        toast.error("Failed to share recipe");
      }
    }
  };

  // 🔒 Ya no se usa, pero se conserva por si se reactiva
  const handleCopyLink = async () => {
    if (!shareableUrl) {
      toast.error("Recipe not ready for sharing yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast.success("Recipe link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleFinish = () => {
    setShowTransition(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mt-6 no-print">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPrintThermal}
            className="flex items-center gap-2"
            disabled={!onPrintThermal}
          >
            <Receipt className="h-4 w-4" /> Print Label
          </Button>

          {/* 
          <Button
            variant="outline"
            onClick={onPrintA4}
            className="flex items-center gap-2"
            disabled={!onPrintA4}
          >
            <FileText className="h-4 w-4" /> Print Cookbook
          </Button>
          */}

          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
            disabled={!shareableUrl}
          >
            <Share2 className="h-4 w-4" /> Share Recipe
          </Button>

          {/* 
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
            disabled={!shareableUrl}
          >
            <Copy className="h-4 w-4" /> Copy Link
          </Button>
          */}
        </div>

        <Button
          variant="orange"
          onClick={handleFinish}
          className="flex items-center gap-2"
        >
          Finish <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {showTransition && (
        <WhiteTransition onEnd={() => {
          window.location.href = "/";
        }} />
      )}
    </>
  );
};
