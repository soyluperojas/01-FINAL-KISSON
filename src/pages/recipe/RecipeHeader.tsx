
import { Button } from "@/components/ui/button";
import { Printer, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const RecipeHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8 no-print">
      <Link to="/">
        <Button variant="outline" className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10">
          <Home className="h-4 w-4" /> Back to Home
        </Button>
      </Link>
      <h1 className="text-2xl font-bold font-display text-white">Shared Recipe</h1>
      <Button 
        variant="outline" 
        onClick={() => window.print()} 
        className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
      >
        <Printer className="h-4 w-4" /> Print Recipe
      </Button>
    </div>
  );
};
