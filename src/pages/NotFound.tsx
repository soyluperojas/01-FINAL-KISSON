
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-black/50 backdrop-blur-md rounded-xl max-w-md border border-white/20">
        <h1 className="text-6xl font-display font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-white/80 mb-6 font-display">Oops! Page not found</p>
        <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
          <a href="/" className="text-white">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
