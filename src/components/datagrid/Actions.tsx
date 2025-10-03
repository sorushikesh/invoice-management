import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MoreVert from "@mui/icons-material/MoreVert";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import Edit from "@mui/icons-material/EditOutlined";
import Delete from "@mui/icons-material/DeleteOutline";
import type { GridColDef } from "./AppDataGrid";

export type ActionsHandlers<T = any> = {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export function actionsColumn<T = any>(handlers: ActionsHandlers<T>, width: number = 120): GridColDef<T> {
  return {
    field: "_actions",
    headerName: "Actions",
    width,
    sortable: false,
    filterable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (p) => {
      const row = p.row as T;
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
      const [confirmOpen, setConfirmOpen] = React.useState(false);
      const open = Boolean(anchorEl);
      const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
      const handleClose = (e?: any) => { e?.stopPropagation?.(); setAnchorEl(null); };
      const onDelete = (e?: any) => { e?.stopPropagation?.(); handleClose(); setConfirmOpen(true); };
      const confirmDelete = () => { setConfirmOpen(false); handlers.onDelete?.(row); };
      return (
        <div>
          <IconButton size="small" onClick={handleOpen}>
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={(e) => e.stopPropagation()}>
            {handlers.onView && (
              <MenuItem onClick={(e) => { e.stopPropagation(); handleClose(); handlers.onView?.(row); }}>
                <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
                <ListItemText>View</ListItemText>
              </MenuItem>
            )}
            {handlers.onEdit && (
              <MenuItem onClick={(e) => { e.stopPropagation(); handleClose(); handlers.onEdit?.(row); }}>
                <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            )}
            {handlers.onDelete && (
              <MenuItem onClick={onDelete}>
                <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </Menu>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onClick={(e) => e.stopPropagation()}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete this item?</DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    },
  } as GridColDef<T>;
}
