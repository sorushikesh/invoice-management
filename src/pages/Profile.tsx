import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const numberFormatOptions = [
  { value: "en-US", label: "1,234.56 (US / UK)" },
  { value: "de-DE", label: "1.234,56 (EU)" },
  { value: "hi-IN", label: "1,23,456.78 (India)" },
];

const dateFormatOptions = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const languageOptions = [
  { value: "en-US", label: "English (United States)" },
  { value: "es-ES", label: "Español (España)" },
  { value: "fr-FR", label: "Français (France)" },
];

const timeZoneOptions = [
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  { value: "America/New_York", label: "Eastern Time (UTC-05:00)" },
  { value: "Europe/Berlin", label: "Central Europe (UTC+01:00)" },
  { value: "Asia/Kolkata", label: "India Standard Time (UTC+05:30)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (UTC+09:00)" },
];

const hourFormatOptions = [
  { value: "12h", label: "12-hour (AM / PM)" },
  { value: "24h", label: "24-hour" },
];

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  companyName: z.string().min(2, "Provide your company or vendor name."),
  role: z.string().min(2, "Let us know your role or department."),
  contactEmail: z.string().email("Enter a valid work email."),
  numberFormat: z.string().min(1, "Select a number format."),
  dateFormat: z.string().min(1, "Select a date format."),
  language: z.string().min(1, "Choose a language."),
  timeZone: z.string().min(1, "Pick a time zone."),
  hourFormat: z.enum(["12h", "24h"], { errorMap: () => ({ message: "Choose an hour format." }) }),
});

type ProfileValues = z.infer<typeof profileSchema>;

const defaultPreferences: ProfileValues = {
  fullName: "",
  companyName: "",
  role: "",
  contactEmail: "",
  numberFormat: "",
  dateFormat: "",
  language: "",
  timeZone: "",
  hourFormat: "12h",
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [initialValues] = React.useState<ProfileValues>(() => {
    if (typeof window === "undefined") {
      return defaultPreferences;
    }

    const stored = window.localStorage.getItem("profilePreferences");
    if (!stored) {
      return defaultPreferences;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ProfileValues>;
      return { ...defaultPreferences, ...parsed };
    } catch {
      return defaultPreferences;
    }
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: ProfileValues) => {
    window.localStorage.setItem("profilePreferences", JSON.stringify(values));
    window.localStorage.setItem("profileCompleted", "true");

    toast({
      title: "Preferences saved",
      description: "Your workspace is now tailored to how you review invoices.",
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-accent/40 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Card className="shadow-xl">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Profile &amp; Preferences</Badge>
              <p className="text-sm text-muted-foreground">Finish this one-time setup to enter the workspace.</p>
            </div>
            <CardTitle className="text-3xl">Tell us how you work with invoices</CardTitle>
            <CardDescription>
              We use these preferences for every invoice, vendor bill, and inventory snapshot you see inside InvoiceFlow.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4 rounded-xl border border-border/60 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Profile details</p>
                    <p className="text-sm text-muted-foreground">
                      These details appear on invoices, approvals, and internal mentions.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="Alex Rivera" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / vendor</FormLabel>
                          <FormControl>
                            <Input placeholder="Northwind Traders" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Finance Operations" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="alex@northwind.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="numberFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number format</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose how amounts should look" />
                          </SelectTrigger>
                          <SelectContent>
                            {numberFormatOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date format</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select how dates should display" />
                          </SelectTrigger>
                          <SelectContent>
                            {dateFormatOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick your UI language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time zone</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Where should we anchor due dates?" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZoneOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hour format</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="12-hour or 24-hour clock?" />
                          </SelectTrigger>
                          <SelectContent>
                            {hourFormatOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2 rounded-md bg-muted/30 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Why we ask for this</p>
                  <p>
                    We format every invoice amount, due date, and reminder using these choices so your finance and vendor teams stay in sync
                    across regions.
                  </p>
                </div>

                <Button className="w-full" size="lg" type="submit">
                  Save preferences &amp; continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
