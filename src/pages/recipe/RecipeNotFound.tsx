
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

interface RecipeNotFoundProps {
  error?: string;
}

export const RecipeNotFound = ({ error }: RecipeNotFoundProps) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Recipe Not Found</h1>
        <p className="text-white/80 mb-6">{error || "The recipe you're looking for doesn't exist."}</p>
        <Link to="/">
          <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
            <Home className="h-4 w-4" /> Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
