import { borders } from "../design-tokens";
export const buttonTheme = {
  MuiButton: {
    defaultProps: {
      disableElevation: true, // Remove MUI's default backdrop shadow for contained buttons
    },
    styleOverrides: {
      root: ({ theme }) => ({
        // Base styles shared by all button variants
        minWidth: "max-content",
        height: 40,
        padding: `${theme.spacing(2)} ${theme.spacing(3)}`,

        // Disabled buttons
        "&.Mui-disabled.MuiButton-contained": {
          color: theme.palette.action.disabledLight,
          backgroundColor: theme.palette.action.disabledDark,
        },

        "&.Mui-disabled.MuiButton-outlined, &.Mui-disabled.MuiButton-soft": {
          color: theme.palette.action.disabledDark,
          backgroundColor: theme.palette.action.disabledLight,
          borderColor: theme.palette.action.disabledDark,
        },

        "&.Mui-disabled.MuiButton-text": {
          color: theme.palette.action.disabledDark,
        },
      }),

      // Small button sizing and typography
      sizeSmall: ({ theme }) => ({
        ...theme.typography.buttonSmall, // Override MUI's small button typography to prevent text from being too small
        height: "auto",
        width: "fit-content",
        padding: `0 ${theme.spacing(1)}`,
      }),

      // Default background for outlined buttons
      outlined: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
    },

    variants: [
      // Customized primary text button
      {
        props: { variant: "text", color: "primary" },
        style: ({ theme }) => ({
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
        }),
      },

      // Customized primary outlined button
      {
        props: { variant: "outlined", color: "primary" },
        style: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
        }),
      },

      // Custom danger outlined button
      {
        props: { variant: "outlined", color: "danger" },
        style: ({ theme }) => ({
          color: theme.palette.danger.main,
          borderColor: theme.palette.danger.main,
          "&:hover": {
            backgroundColor: theme.palette.danger.light,
          },
        }),
      },

      // Custom soft danger button
      {
        props: { variant: "soft", color: "danger" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.danger.light,
          color: theme.palette.danger.main,
          border: `${borders.width.default}px solid ${theme.palette.danger.main}`,
          "&:hover": {
            backgroundColor: theme.palette.danger.hoverSoft,
          },
        }),
      },
    ],
  },
};
