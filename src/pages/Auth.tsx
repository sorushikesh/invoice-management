import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Lock } from "lucide-react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJoc2woMjYyIDgzJSA1OCUgLyAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <Card className="w-full max-w-md relative shadow-xl backdrop-blur-sm bg-card/95 border-border/50">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === "login" 
                ? "Sign in to access your account" 
                : "Create your account to get started"}
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:shadow-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:shadow-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <LoginForm />
              <SocialLogin />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignupForm />
              <SocialLogin />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="text-primary hover:underline cursor-pointer">Terms</span>
              {" "}and{" "}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
