import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Users, CircleDollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-6">
      <div className="space-y-10 w-full max-w-5xl">
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-glow to-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Invoice Management
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Create, send, and track invoices. Manage clients and payments in one place.
          </p>
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="group animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
            >
              Sign in to continue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <FileText className="h-4 w-4 text-primary" /> Invoices
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">128</CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-75">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Users className="h-4 w-4 text-primary" /> Clients
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">42</CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <CircleDollarSign className="h-4 w-4 text-primary" /> Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">$12,450</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
