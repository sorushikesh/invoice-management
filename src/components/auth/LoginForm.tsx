import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { login, type LoginRequest, verifyEmail, sendOtp, verifyOtp } from "@/services/auth";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setSession, setTenant } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phase, setPhase] = useState<"identify" | "password">("identify");
  const [welcomeName, setWelcomeName] = useState<string | undefined>(undefined);
  const { current } = useTenant();
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);
  const resendTimerRef = useRef<number | null>(null);
  const COOLDOWN_SEC = 30;

  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;

  const schema = z
    .object({
      email: z.string().email("Enter a valid email"),
      password: z.string().min(8, "At least 8 characters"),
      rememberMe: z.boolean().optional(),
    })
    .superRefine((val, ctx) => {
      const pass = val.password || "";
      const hasUpper = /[A-Z]/.test(pass);
      const hasNumber = /[0-9]/.test(pass);
      const isDummyAdmin = allowDummy && (val.email.toLowerCase() === "admin" || val.email.toLowerCase() === "admin@admin.com") && pass === "adminadmin";
      if (!isDummyAdmin) {
        if (!hasUpper) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["password"], message: "At least 1 uppercase letter" });
        if (!hasNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["password"], message: "At least 1 number" });
      }
    });

  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, getValues } = useForm<LoginRequest>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const rememberMe = watch("rememberMe");
  const emailVal = watch("email");

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      if (phase === "identify") {
        const res = await verifyEmail(data.email);
        if (!res.ok || !res.tenantId) {
          toast({ title: "Email not found", description: "Please check your email address.", variant: "destructive" });
          return;
        }
        setTenant(res.tenantId);
        setWelcomeName(res.name);
        setPhase("password");
        return;
      }
      const resp = await login(data);
      setSession({ ...resp });
      toast({ title: "Login successful!", description: "You're signed in to Invoice Manager." });
      // Always land on dashboard after login
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      if (msg.includes("lock") || msg.includes("suspend")) {
        setLockedOpen(true);
      } else {
        toast({ title: "Invalid credentials", description: "Please check your email and password.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // OTP is mandatory; only allow submit in password phase
    if (phase === "identify") return;
    // Password phase uses full form validation
    await handleSubmit(onSubmit)(e as any);
  };

  // Helpers to manage resend cooldown persistence
  const startCooldown = () => {
    setResendLeft(COOLDOWN_SEC);
    try {
      localStorage.setItem("auth:otp:sentAt", String(Date.now()));
      localStorage.setItem("auth:otp:email", String(emailVal || ""));
    } catch {}
    if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
    resendTimerRef.current = window.setInterval(() => {
      setResendLeft((t) => {
        if (t <= 1) {
          if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
          resendTimerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000) as unknown as number;
  };

  const clearCooldown = () => {
    if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
    resendTimerRef.current = null;
    setResendLeft(0);
    try {
      localStorage.removeItem("auth:otp:sentAt");
      localStorage.removeItem("auth:otp:email");
    } catch {}
  };

  // On mount, restore OTP state (email, cooldown)
  useEffect(() => {
    try {
      const sentAtRaw = localStorage.getItem("auth:otp:sentAt");
      const emailStored = localStorage.getItem("auth:otp:email");
      if (emailStored) setValue("email", emailStored);
      if (sentAtRaw) {
        const sentAt = parseInt(sentAtRaw, 10);
        if (!Number.isNaN(sentAt)) {
          const elapsed = Math.floor((Date.now() - sentAt) / 1000);
          const remain = Math.max(0, COOLDOWN_SEC - elapsed);
          if (emailStored) setOtpSent(true);
          if (remain > 0) {
            setResendLeft(remain);
            if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
            resendTimerRef.current = window.setInterval(() => {
              setResendLeft((t) => {
                if (t <= 1) {
                  if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
                  resendTimerRef.current = null;
                  return 0;
                }
                return t - 1;
              });
            }, 1000) as unknown as number;
          }
        }
      }
    } catch {}
    return () => {
      if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
    };
  }, []);

  return (
    <form onSubmit={onSubmitForm} className="space-y-5">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground leading-relaxed">
          {phase === "identify" ? (
            <>
              <span className="font-medium text-foreground">Welcome.</span> Enter your work email to locate your workspace and continue.
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">Welcome back{welcomeName ? `, ${welcomeName}` : ""}.</span> You're signing in to {current?.name ? `${current.name}` : "your"} workspace.
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          {phase === "identify" && (
            <Button
              type="button"
              size="sm"
              variant="link"
              className="px-0"
              disabled={isLoading || !/^\S+@\S+\.\S+$/.test(String(emailVal || "").trim())}
              onClick={async () => {
                const email = String(emailVal || "").trim();
                try {
                  setOtpLoading(true);
                  await sendOtp(email);
                  setOtpSent(true);
                  setOtpValue("");
                  toast({ title: "OTP sent", description: `We've sent a code to ${email}` });
                  startCooldown();
                } finally {
                  setOtpLoading(false);
                }
              }}
            >
              Send OTP
            </Button>
          )}
        </div>
        <Input id="email" type="email" placeholder="billing@acme.com" disabled={isLoading || phase === "password"} startIcon={<Mail className="h-4 w-4 text-muted-foreground" />} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        {phase === "identify" && otpSent && (
          <div className="mt-2 space-y-2">
          <Label htmlFor="otp" className="text-sm font-medium">Enter OTP</Label>
            <div className="flex justify-center">
              <OTPInput
                value={otpValue}
                onChange={setOtpValue}
                maxLength={6}
                pasteTransformer={(p) => (p || '').replace(/\D/g, '').slice(0, 6)}
                containerClassName="w-full justify-center"
                render={({ slots, isFocused }) => (
                  <div className="flex items-center gap-2">
                    {slots.map((slot, i) => (
                      <div
                        key={i}
                        className={`w-10 h-12 rounded-md border flex items-center justify-center text-base font-medium ${slot.isActive ? 'border-primary' : 'border-border'} bg-card`}
                      >
                        {slot.char ?? (slot.isActive ? '' : '•')}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" disabled={otpLoading || !/^\d{4,6}$/.test(otpValue.trim())} onClick={async () => {
                const email = String(emailVal || "").trim();
                setOtpLoading(true);
                try {
                  const ok = await verifyOtp(email, otpValue.trim());
                  if (!ok.ok) {
                    toast({ title: "Invalid OTP", description: "Please check the code and try again.", variant: "destructive" });
                    return;
                  }
                  const res = await verifyEmail(email);
                  if (!res.ok || !res.tenantId) {
                    toast({ title: "Email not found", description: "Please check your email address.", variant: "destructive" });
                    return;
                  }
                  setTenant(res.tenantId);
                  setWelcomeName(res.name);
                  setPhase("password");
                } finally {
                  setOtpLoading(false);
                }
              }}>Verify OTP</Button>
              <Button type="button" size="sm" variant="ghost" disabled={otpLoading || resendLeft > 0} onClick={async () => {
                const email = String(emailVal || "").trim();
                setOtpLoading(true);
                try {
                  await sendOtp(email);
                  toast({ title: "OTP re-sent", description: `We've re-sent the code to ${email}` });
                  startCooldown();
                } finally {
                  setOtpLoading(false);
                }
              }}>{resendLeft > 0 ? `Resend (${resendLeft}s)` : "Resend"}</Button>
            </div>
          </div>
        )}
      </div>

      {phase === "password" && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="text-xs text-muted-foreground mb-1">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                // Go back to email/OTP step
                setPhase("identify");
                setOtpSent(false);
                setOtpValue("");
                clearCooldown();
              }}
            >
              Change email
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={isLoading}
            startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
            endIcon={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
      )}

      {phase === "password" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={!!rememberMe} onCheckedChange={(checked) => setValue("rememberMe", !!checked)} disabled={isLoading} />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Remember me</label>
          </div>
          <Button type="button" variant="link" className="px-0 text-sm font-normal" disabled={isLoading} onClick={() => navigate("/forgot-password")}>Forgot password?</Button>
        </div>
      )}

      {phase === "password" && (
        <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : ("Sign in")}
        </Button>
      )}

      <AlertDialog open={lockedOpen} onOpenChange={setLockedOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your account is suspended</AlertDialogTitle>
            <AlertDialogDescription>
              Your account is currently locked. Please contact your Administrator for assistance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLockedOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
};
