import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Bell } from "lucide-react";

type Notice = { id: string; title: string; ts: string };

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [readAll, setReadAll] = useState(false);

  const notices = useMemo<Notice[]>(
    () => [
      { id: "n1", title: "Payment received for INV-1002", ts: "2025-10-01 10:31" },
      { id: "n2", title: "Invoice INV-1003 is overdue", ts: "2025-10-01 09:10" },
      { id: "n3", title: "Recurring invoice generated (Acme Hosting)", ts: "2025-09-30 08:00" },
    ],
    [],
  );
  const unread = readAll ? 0 : notices.length;

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Notifications" className="relative">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
            {unread}
          </span>
        )}
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-2">
            <div className="flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={() => setReadAll(true)}>Mark all as read</Button>
            </div>
            <div className="divide-y rounded border">
              {notices.map((n) => (
                <div key={n.id} className="p-3 text-sm">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.ts}</div>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

