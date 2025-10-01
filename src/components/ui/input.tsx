import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export type InputProps = Omit<TextFieldProps, "variant"> & {
  variant?: TextFieldProps["variant"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ type = "text", variant = "outlined", startIcon, endIcon, InputProps: muiInputProps, className, sx, ...rest }, ref) => {
  // Heuristic: if legacy Tailwind padding class like 'pl-10' is provided on className,
  // mirror it to the inner input so adornment/absolute icons don't overlap the text.
  let extraPad: number | undefined;
  if (className) {
    const m = className.match(/pl-(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      const scale: Record<number, number> = { 8: 32, 9: 36, 10: 40, 11: 44, 12: 48 };
      extraPad = scale[n];
    }
  }
  const composedInputProps = {
    ...muiInputProps,
    startAdornment: startIcon ? (
      <InputAdornment position="start">{startIcon}</InputAdornment>
    ) : muiInputProps?.startAdornment,
    endAdornment: endIcon ? (
      <InputAdornment position="end">{endIcon}</InputAdornment>
    ) : muiInputProps?.endAdornment,
  } as TextFieldProps["InputProps"];
  return (
    <TextField
      inputRef={ref}
      type={type}
      variant={variant}
      size="small"
      fullWidth
      InputProps={composedInputProps}
      className={className}
      sx={{ ...(sx as any), ...(extraPad ? { "& .MuiInputBase-input": { paddingLeft: extraPad } } : {}) }}
      {...rest}
    />
  );
});
Input.displayName = "Input";

export { Input };
