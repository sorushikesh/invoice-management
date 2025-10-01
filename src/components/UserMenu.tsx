import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const formatRole = (role?: string) => (role ? role.replace(/([a-z])([A-Z])/g, "$1 $2") : undefined);

export default function UserMenu() {
  const { user, logout, roles } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();
  const primaryRole = roles[0];
  const roleLabel = formatRole(primaryRole);

  const onLogout = () => {
    logout();
    toast({ title: "Signed out" });
    navigate("/auth", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-sm max-w-[160px] truncate">{user?.email || "Guest"}</span>
              {roleLabel && <span className="text-xs text-muted-foreground capitalize">{roleLabel}</span>}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate font-medium">{user?.name || user?.email || "Guest"}</div>
          {roleLabel && <div className="text-xs text-muted-foreground capitalize">{roleLabel}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate("/auth")}>Sign in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
