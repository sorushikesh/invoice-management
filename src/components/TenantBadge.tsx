import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTenant } from "@/contexts/TenantContext";

export default function TenantBadge() {
  const { current } = useTenant();
  if (!current) return null;
  const initials = current.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar src={current.logoUrl} sx={{ width: 24, height: 24, fontSize: 12 }}>{initials}</Avatar>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{current.name}</Typography>
    </Box>
  );
}

