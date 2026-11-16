import { shape } from "../design-tokens.js";

export const chipTheme = {
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: "auto", // Fit content height
        borderRadius: shape.borderRadius.chip,
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        ...theme.typography.chip,
      }),
      label: {
        padding: 0, // Remove MUI's default horizontal padding, to let root padding control spacing
      },
    },
    variants: [
      {
        props: { color: "neutral" },
        style: ({ theme }) => ({
          color: theme.palette.chip.neutral.text,
          backgroundColor: theme.palette.chip.neutral.background,
        }),
      },

      {
        props: { color: "low" },
        style: ({ theme }) => ({
          color: theme.palette.chip.low.text,
          backgroundColor: theme.palette.chip.low.background,
        }),
      },

      {
        props: { color: "medium" },
        style: ({ theme }) => ({
          color: theme.palette.chip.medium.text,
          backgroundColor: theme.palette.chip.medium.background,
        }),
      },

      {
        props: { color: "high" },
        style: ({ theme }) => ({
          color: theme.palette.chip.high.text,
          backgroundColor: theme.palette.chip.high.background,
        }),
      },
    ],
  },
};
