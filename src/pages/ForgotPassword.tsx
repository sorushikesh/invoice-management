import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/services/auth";
import { toast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const schema = z.object({ email: z.string().email("Enter a valid email") });
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast({ title: "We've sent reset instructions to your email." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Forgot Password" breadcrumbs={[{ label: "Auth", to: "/auth" }, { label: "Forgot Password" }]}>
      <div className="mx-auto max-w-md">
        <PageSection title="Reset your password">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" disabled={loading} {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Button type="submit" disabled={loading || !isValid}>Send reset link</Button>
              </div>
            </form>
        </PageSection>
      </div>
    </AppLayout>
  );
}

