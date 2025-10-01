import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function TenantSwitcher() {
  const navigate = useNavigate();
  const { tenantId, setTenant } = useAuth();
  const { tenants, applyBranding } = useTenant();
  const current = tenants.find((x) => x.id === tenantId) ?? null;

  const onChange = (id: string | null) => {
    if (!id) return;
    setTenant(id);
    const tenant = tenants.find((x) => x.id === id);
    if (tenant) applyBranding(tenant);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Autocomplete
        size="small"
        options={tenants}
        value={current}
        onChange={(_, value) => onChange(value?.id ?? null)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ flexGrow: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tenant"
            placeholder="Search tenants"
          />
        )}
      />
      <Button variant="outlined" size="small" onClick={() => navigate("/tenants")}>Manage</Button>
    </Box>
  );
}
