
import { RecipeData } from "@/components/RecipeWizard";

interface RecipeTitleProps {
  title: string;
}

export const RecipeTitle = ({ title }: RecipeTitleProps) => {
  return (
    <div className="text-center mb-4">
      <h1 className="text-3xl font-bold recipe-title font-display">{title || "Memory Dumplings"}</h1>
    </div>
  );
};
