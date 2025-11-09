import { Link, useNavigate } from "react-router-dom";
import { Boxes, FileSpreadsheet, Handshake } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message: "Please accept the terms to continue.",
      }),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

const highlightFeatures = [
  {
    icon: FileSpreadsheet,
    title: "Vendor-ready invoicing",
    description: "Generate branded invoices, match them to POs, and schedule payables without spreadsheets.",
  },
  {
    icon: Handshake,
    title: "Custom vendor workflows",
    description: "Track terms, approvals, and vendor health in a shared audit trail.",
  },
  {
    icon: Boxes,
    title: "Inventory-aware decisions",
    description: "Real-time stock insights surface shortages before they block billing or fulfillment.",
  },
];

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const goToNextStep = () => {
    const hasCompletedProfile = window.localStorage.getItem("profileCompleted") === "true";
    navigate(hasCompletedProfile ? "/" : "/profile");
  };

  const handleSignIn = (values: SignInValues) => {
    toast({
      title: "Signed in",
      description: `Welcome back, ${values.email}!`,
    });
    goToNextStep();
  };

  const handleSignUp = (values: SignUpValues) => {
    toast({
      title: "Account created",
      description: "Check your inbox to verify your email and finish onboarding.",
    });
    window.localStorage.setItem("profileCompleted", "false");
    window.localStorage.removeItem("profilePreferences");
    signUpForm.reset({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-accent/40">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        <div className="relative hidden overflow-hidden bg-card lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-info/10 to-transparent" />
          <div className="relative z-10 flex flex-col gap-10 p-12">
            <div>
              <p className="text-sm font-semibold text-primary">InvoiceFlow Platform</p>
              <h2 className="mt-4 text-4xl font-bold text-foreground">Own every touchpoint in the invoice lifecycle.</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Generate compliant invoices, manage vendor billing, and keep inventory signals in sync with finance.
              </p>
            </div>
              <div className="space-y-8">
                <ul className="space-y-6">
                  {highlightFeatures.map((feature) => (
                    <li key={feature.title} className="flex gap-4">
                      <div className="mt-1 rounded-full bg-primary/10 p-3 text-primary">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-border bg-background/60 p-6 text-sm text-muted-foreground shadow-lg backdrop-blur">
                “Reconciling vendor bills against receipts now takes minutes, and inventory stays balanced automatically.”
                <span className="mt-3 block font-semibold text-foreground">— Riley Knight, Controller at Northwind Traders</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16 sm:px-12">
          <Card className="w-full max-w-md border-border/60 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <p className="text-sm font-semibold text-primary uppercase">Welcome back</p>
              <CardTitle className="text-3xl">Access your workspace</CardTitle>
              <CardDescription>Sign in to continue or create a new account in seconds.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <button
                                type="button"
                                className="text-sm font-semibold text-primary hover:underline"
                                onClick={() =>
                                  toast({
                                    title: "Password reset",
                                    description: "Use the support channel to reset your password.",
                                  })
                                }
                              >
                                Forgot?
                              </button>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Continue
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="signup">
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                      <FormField
                        control={signUpForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" autoComplete="name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="team@company.com" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a secure password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Re-enter your password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row space-x-3 space-y-0 rounded-lg border border-border/60 p-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                            </FormControl>
                            <div className="space-y-1 leading-tight text-sm">
                              <FormLabel className="font-medium">I agree to the terms</FormLabel>
                              <p className="text-muted-foreground">
                                Read our <Link to="/settings" className="font-semibold text-primary hover:underline">privacy &amp; data policy</Link>.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Create account
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
              <p>Questions about access? Reach out to your workspace admin or support@orderflow.app.</p>
              <Link to="/" className="font-semibold text-primary hover:underline">
                Back to dashboard
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
