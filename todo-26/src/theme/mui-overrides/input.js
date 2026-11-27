// Shared root styles for standard inputs (TextField, Select) and MUI X Pickers (DatePicker, TimePicker)
const sharedOutlinedInputRootStyles = ({ theme }) => ({
  backgroundColor: theme.palette.background.paper,

  // Input value & placeholder text
  "& .MuiInputBase-input": {
    color: theme.palette.input.text.filled,
    "&::placeholder": {
      color: theme.palette.input.text.placeholder,
      opacity: 1, // Override browser default placeholder opacity
    },
  },

  // Outlined border states (default, hover, focus)
  "& .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline":
    {
      borderColor: theme.palette.input.border.default,
    },
  "&:hover .MuiOutlinedInput-notchedOutline, &:hover .MuiPickersOutlinedInput-notchedOutline":
    {
      borderColor: theme.palette.input.border.hover,
    },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiPickersOutlinedInput-notchedOutline":
    {
      borderColor: theme.palette.input.border.focus,
    },
});

export const inputTheme = {
  // Standard outlined inputs (TextField, Select)
  MuiOutlinedInput: {
    styleOverrides: {
      root: sharedOutlinedInputRootStyles,
    },
  },

  // MUI X Pickers inputs (DatePicker, TimePicker)
  MuiPickersOutlinedInput: {
    styleOverrides: {
      root: sharedOutlinedInputRootStyles,
    },
  },

  // Floating & resting labels across all input components
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        letterSpacing: theme.typography.label.letterSpacing,
        color: theme.palette.input.text.placeholder, // Resting state

        "&.MuiInputLabel-shrink": {
          color: theme.palette.input.text.label, // Floating state
        },
      }),
    },
  },
};
