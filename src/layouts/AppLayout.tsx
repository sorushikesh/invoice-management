import { ReactNode } from "react";
import MUIAppLayout from "@/material/MUIAppLayout";
import { GestureNavigation } from "@/components/GestureNavigation";
import "@/components/styles/GestureNavigation.css";

type Props = {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  actions?: ReactNode;
};

export default function AppLayout({ children, title, breadcrumbs, actions }: Props) {
  return (
    <>
      <MUIAppLayout title={title} breadcrumbs={breadcrumbs} actions={actions}>
        {children}
      </MUIAppLayout>
      <GestureNavigation />
    </>
  );
}
