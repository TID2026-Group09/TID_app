import { borders } from "../design-tokens";
export const buttonTheme = {
  MuiButton: {
    defaultProps: {
      disableElevation: true, // Remove MUI's default backdrop shadow for contained buttons
    },
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: "max-content",
        height: 40,
        padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
      }),

      sizeSmall: ({ theme }) => ({
        ...theme.typography.buttonSmall, // Override MUI's small button typography to prevent text from being too small
        height: "auto",
        width: "fit-content",
        padding: `0 ${theme.spacing(1)}`,
      }),

      outlined: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
    },

    variants: [
      {
        props: { variant: "text", color: "primary" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
        }),
      },

      {
        props: { variant: "outlined", color: "primary" },
        style: ({ theme }) => ({
          borderColor: theme.palette.primary.dark,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
        }),
      },

      {
        props: { variant: "soft", color: "danger" },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.danger.light,
          color: theme.palette.danger.main,
          border: `${borders.width.default}px solid ${theme.palette.danger.main}`,
          "&:hover": {
            backgroundColor: theme.palette.danger.hoverSoft,
          },
          "&.Mui-disabled": {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.action.disabled,
          },
        }),
      },

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
    ],
  },
};
