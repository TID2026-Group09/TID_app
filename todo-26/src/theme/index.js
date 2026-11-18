import { createTheme } from "@mui/material/styles";
import { shape, spacingStep, palette, typography } from "./design-tokens.js";
import { components } from "./mui-overrides/index.js";

export const theme = createTheme({
  cssVariables: true, // Enable CSS variables for use in CSS (var(--mui-*))

  spacing: spacingStep,
  shape: {
    borderRadius: shape.borderRadius.default,
  },
  palette,
  typography,
  components,
});

export default theme;
