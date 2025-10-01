import * as React from "react";
import MUIAlert, { AlertProps as MUIAlertProps } from "@mui/material/Alert";
import MUIAlertTitle from "@mui/material/AlertTitle";

export const Alert = React.forwardRef<HTMLDivElement, MUIAlertProps>((props, ref) => (
  <MUIAlert ref={ref} variant="outlined" severity={props.severity ?? (props.color === 'error' ? 'error' : 'info')} {...props} />
));
Alert.displayName = "Alert";

export const AlertTitle = MUIAlertTitle;
export const AlertDescription = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
