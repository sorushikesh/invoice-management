import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-glow to-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Authentication Portal
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Secure, beautiful, and feature-rich login experience
          </p>
        </div>
        
        <Button 
          onClick={() => navigate("/auth")} 
          size="lg"
          className="group animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
        >
          Open Login Window
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
