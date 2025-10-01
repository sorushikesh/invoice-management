import * as React from "react";
import MUITabs from "@mui/material/Tabs";
import MUITab from "@mui/material/Tab";

type TabsContextValue = { value: string; setValue: (v: string) => void };
const TabsCtx = React.createContext<TabsContextValue | null>(null);

type TabsProps = React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode };
export function Tabs({ defaultValue, value: valueProp, onValueChange, children, className, ...rest }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue || "");
  const value = valueProp !== undefined ? valueProp : internal;
  const setValue = (v: string) => { onValueChange?.(v); if (valueProp === undefined) setInternal(v); };
  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <div className={className} {...rest}>{children}</div>
    </TabsCtx.Provider>
  );
}

type TabsListProps = React.ComponentProps<typeof MUITabs>;
export function TabsList(props: TabsListProps) {
  const ctx = React.useContext(TabsCtx)!;
  return <MUITabs value={ctx.value} onChange={(_, v) => ctx.setValue(String(v))} {...props} />;
}

type TabsTriggerProps = Omit<React.ComponentProps<typeof MUITab>, "value" | "label"> & { value: string; children?: React.ReactNode };
export function TabsTrigger({ value, children, ...rest }: TabsTriggerProps) {
  return <MUITab value={value} label={children} {...rest} />;
}

type TabsContentProps = { value: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>;
export function TabsContent({ value, children, ...rest }: TabsContentProps) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div {...rest}>{children}</div>;
}
