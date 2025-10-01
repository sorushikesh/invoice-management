import AppLayout from "@/layouts/AppLayout";
import PageSection from "@/components/PageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Profile() {
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  const profileSchema = z.object({ name: z.string().min(2, "Name required"), email: z.string().email("Valid email") });
  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: perrs }, reset: resetProfile } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  useEffect(() => {
    resetProfile({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const pwdSchema = z
    .object({ current: z.string().min(1, "Current password required"), next: z.string().min(6, "Min 6 chars"), confirm: z.string().min(6) })
    .refine((d) => d.next === d.confirm, { path: ["confirm"], message: "Passwords do not match" });
  const { register: regPwd, handleSubmit: handlePwd, formState: { errors: perrPwd }, reset: resetPwd } = useForm<z.infer<typeof pwdSchema>>({
    resolver: zodResolver(pwdSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  if (!user) return <Navigate to="/auth" replace />;

  const onSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    setSaving(true);
    try {
      // TODO: await apiFetch('/users/me', { method: 'PUT', body: data })
      await new Promise((r) => setTimeout(r, 500));
      toast({ title: "Profile updated" });
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: z.infer<typeof pwdSchema>) => {
    setChanging(true);
    try {
      // TODO: await apiFetch('/users/change-password', { method: 'POST', body: { currentPassword: data.current, newPassword: data.next } })
      await new Promise((r) => setTimeout(r, 600));
      resetPwd();
      toast({ title: "Password changed" });
    } finally {
      setChanging(false);
    }
  };

  return (
    <AppLayout title="Profile">
      <div className="grid gap-6 md:grid-cols-2">
        <PageSection title="Account">
            <form onSubmit={handleProfile(onSaveProfile)} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" disabled={saving} {...regProfile("name")} />
                {perrs.name && <p className="text-xs text-destructive">{perrs.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" disabled={saving} {...regProfile("email")} />
                {perrs.email && <p className="text-xs text-destructive">{perrs.email.message}</p>}
              </div>
              <div>
                <Button type="submit" disabled={saving}>Save Profile</Button>
              </div>
            </form>
        </PageSection>

        <PageSection title="Change Password">
            <form onSubmit={handlePwd(onChangePassword)} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" disabled={changing} {...regPwd("current")} />
                {perrPwd.current && <p className="text-xs text-destructive">{perrPwd.current.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" disabled={changing} {...regPwd("next")} />
                {perrPwd.next && <p className="text-xs text-destructive">{perrPwd.next.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" disabled={changing} {...regPwd("confirm")} />
                {perrPwd.confirm && <p className="text-xs text-destructive">{perrPwd.confirm.message}</p>}
              </div>
              <div>
                <Button type="submit" disabled={changing}>Update Password</Button>
              </div>
            </form>
        </PageSection>
      </div>
    </AppLayout>
  );
}
