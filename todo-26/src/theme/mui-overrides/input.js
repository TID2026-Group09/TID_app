export const inputTheme = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 0,
        backgroundColor: theme.palette.background.paper,

        // Border states
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.input.border.default,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.input.border.hover,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.input.border.focus,
        },

        // Input and placeholder text
        "& .MuiInputBase-input": {
          color: theme.palette.input.text.filled,
          "&::placeholder": {
            color: theme.palette.input.text.placeholder,
          },
        },
      }),
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        letterSpacing: theme.typography.label.letterSpacing,

        // Label in its resting position
        "&:not(.MuiInputLabel-shrink)": {
          color: theme.palette.input.text.placeholder,
        },

        // Floating/shrunk label
        "&.MuiInputLabel-shrink": {
          color: theme.palette.input.text.label,
        },
      }),
    },
  },
};
