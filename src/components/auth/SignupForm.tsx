import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { signup, sendOtp, verifyOtp } from "@/services/auth";
import { OTPInput } from "input-otp";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);
  const timerRef = useRef<number | null>(null);
  const verifiedEmailRef = useRef<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = z
    .object({
      firstName: z.string().min(2, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email"),
      password: z.string().min(6, "Min 6 characters"),
      confirmPassword: z.string().min(6, "Confirm password"),
      agreeToTerms: z.boolean().refine((v) => v, { message: "Please agree to terms" }),
    })
    .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, getValues } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", agreeToTerms: false },
  });
  const agree = watch("agreeToTerms");
  const emailVal = watch("email");
  // If user changes email after verification, require a new OTP
  useEffect(() => {
    const current = String(emailVal || "").trim();
    if (otpVerified && verifiedEmailRef.current && current !== verifiedEmailRef.current) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtpValue("");
    }
  }, [emailVal]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      await signup({ name: fullName, email: data.email, password: data.password });
      toast({ title: "Account created!", description: "You're ready to create and send invoices." });
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
          <Input id="firstName" type="text" placeholder="Alex" disabled={isLoading} startIcon={<User className="h-4 w-4 text-muted-foreground" />} {...register("firstName")} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
          <Input id="lastName" type="text" placeholder="Johnson" disabled={isLoading} startIcon={<User className="h-4 w-4 text-muted-foreground" />} {...register("lastName")} />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
          {otpVerified ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-900">
                Verified
              </span>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => {
                  // Clear OTP/verification state and focus email
                  setOtpVerified(false);
                  setOtpSent(false);
                  setOtpValue("");
                  setResendLeft(0);
                  if (timerRef.current) {
                    window.clearInterval(timerRef.current);
                    timerRef.current = null;
                  }
                  const el = document.getElementById("signup-email") as HTMLInputElement | null;
                  el?.focus();
                }}
              >
                Edit email
              </button>
            </span>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="link"
              className="px-0"
              disabled={isLoading || otpLoading || !/^\S+@\S+\.\S+$/.test(String(emailVal || "").trim())}
              onClick={async () => {
                const email = String(emailVal || "").trim();
                try {
                  setOtpLoading(true);
                  await sendOtp(email);
                  setOtpSent(true);
                  setOtpVerified(false);
                  setOtpValue("");
                  toast({ title: "OTP sent", description: `We've sent a code to ${email}` });
                  // start cooldown
                  setResendLeft(30);
                  if (timerRef.current) window.clearInterval(timerRef.current);
                  timerRef.current = window.setInterval(() => {
                    setResendLeft((t) => {
                      if (t <= 1) {
                        if (timerRef.current) window.clearInterval(timerRef.current);
                        timerRef.current = null;
                        return 0;
                      }
                      return t - 1;
                    });
                  }, 1000) as unknown as number;
                } finally {
                  setOtpLoading(false);
                }
              }}
            >
              {otpLoading ? "Sending..." : "Send OTP"}
            </Button>
          )}
        </div>
        <Input id="signup-email" type="email" placeholder="billing@acme.com" disabled={isLoading || otpVerified} startIcon={<Mail className="h-4 w-4 text-muted-foreground" />} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        {otpSent && !otpVerified && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="signup-otp" className="text-sm font-medium">Enter OTP</Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={otpLoading || resendLeft > 0}
                onClick={async () => {
                  const email = String(emailVal || "").trim();
                  setOtpLoading(true);
                  try {
                    await sendOtp(email);
                    toast({ title: "OTP re-sent", description: `We've re-sent the code to ${email}` });
                    setResendLeft(30);
                    if (timerRef.current) window.clearInterval(timerRef.current);
                    timerRef.current = window.setInterval(() => {
                      setResendLeft((t) => {
                        if (t <= 1) {
                          if (timerRef.current) window.clearInterval(timerRef.current);
                          timerRef.current = null;
                          return 0;
                        }
                        return t - 1;
                      });
                    }, 1000) as unknown as number;
                  } finally {
                    setOtpLoading(false);
                  }
                }}
              >
                {resendLeft > 0 ? `Resend (${resendLeft}s)` : "Resend"}
              </Button>
            </div>
            <div className="flex justify-center">
              <OTPInput
                value={otpValue}
                onChange={setOtpValue}
                maxLength={6}
                pasteTransformer={(p) => (p || '').replace(/\D/g, '').slice(0, 6)}
                containerClassName="w-full justify-center"
                render={({ slots }) => (
                  <div className="flex items-center gap-2">
                    {slots.map((slot, i) => (
                      <div key={i} className={`w-10 h-12 rounded-md border flex items-center justify-center text-base font-medium ${slot.isActive ? 'border-primary' : 'border-border'} bg-card`}>
                        {slot.char ?? (slot.isActive ? '' : '•')}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={otpVerifying || !/^\d{4,6}$/.test(otpValue.trim())}
                onClick={async () => {
                  const email = String(emailVal || "").trim();
                  setOtpVerifying(true);
                  try {
                    const ok = await verifyOtp(email, otpValue.trim());
                    if (!ok.ok) {
                      toast({ title: "Invalid OTP", description: "Please check the code and try again.", variant: "destructive" });
                      return;
                    }
                    setOtpVerified(true);
                    verifiedEmailRef.current = email;
                    toast({ title: "OTP verified" });
                  } finally {
                    setOtpVerifying(false);
                  }
                }}
              >
                {otpVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
        <Input
          id="signup-password"
          type={showPwd ? "text" : "password"}
          placeholder="••••••••"
          disabled={isLoading}
          startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          endIcon={<button type="button" aria-label={showPwd ? "Hide password" : "Show password"} className="text-muted-foreground hover:text-foreground" onClick={() => setShowPwd(v => !v)} disabled={isLoading}>{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
        <Input
          id="confirm-password"
          type={showConfirm ? "text" : "password"}
          placeholder="••••••••"
          disabled={isLoading}
          startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          endIcon={<button type="button" aria-label={showConfirm ? "Hide password" : "Show password"} className="text-muted-foreground hover:text-foreground" onClick={() => setShowConfirm(v => !v)} disabled={isLoading}>{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex items-start gap-3 pt-2 mb-2">
        <Checkbox id="terms" checked={!!agree} onCheckedChange={(checked) => setValue("agreeToTerms", !!checked)} disabled={isLoading} className="mt-0.5" />
        <label
          htmlFor="terms"
          className={`text-sm ${agree ? 'text-foreground' : 'text-muted-foreground'} cursor-pointer select-none leading-relaxed`}
        >
          I agree to the <span className="text-primary hover:underline">Terms of Service</span> and <span className="text-primary hover:underline">Privacy Policy</span>
        </label>
      </div>
      {errors.agreeToTerms && <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>}

      <Button type="submit" className="w-full" disabled={isLoading || !otpVerified || !agree}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
};
