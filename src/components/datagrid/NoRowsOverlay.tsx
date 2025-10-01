import * as React from "react";
import { Box, Button } from "@mui/material";
import { Inbox, SearchX } from "lucide-react";

type Props = {
  message?: string;
  kind?: 'empty' | 'noResults';
  onResetFilters?: () => void;
};

export default function NoRowsOverlay({ message, kind = 'empty', onResetFilters }: Props) {
  const Icon = kind === 'noResults' ? SearchX : Inbox;
  const defaultMsg = kind === 'noResults' ? 'No results match the filters' : 'No data to display';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1.5,
        py: 6,
        color: 'text.secondary',
      }}
    >
      <Icon size={28} color="currentColor" />
      <div>{message || defaultMsg}</div>
      {onResetFilters && (
        <Button size="small" variant="outlined" onClick={onResetFilters} sx={{ mt: 1 }}>
          Reset filters
        </Button>
      )}
    </Box>
  );
}

