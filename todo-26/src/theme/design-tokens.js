export const spacingStep = 4; // theme.spacing(1) = 4px

export const shape = {
  borderRadius: {
    default: 4,
    chip: 100,
  },
};

export const borders = {
  width: {
    default: 1,
    focus: 2,
  },
};

// Base semantic colors
const text = {
  primary: "#202B29",
  secondary: "#004C4C",
};

const primary = {
  light: "#D9EEEE",
  main: "#006666",
  dark: "#004C4C",
  contrastText: "#FFFFFF",
};

const secondary = {
  light: "#FFF4D6",
  main: "#F4B942",
  dark: "#805500",
  contrastText: text.primary,
};

const danger = {
  light: "#F7E9E8",
  main: "#B42318",
  dark: "#801B12",
  contrastText: "#FFFFFF",
  hoverSoft: "#EED0CE",
};

const error = {
  main: "#B42318",
};

// Composed palette
export const palette = {
  primary,
  secondary,
  danger,
  error,
  text,

  background: {
    default: "#F7F8F6",
    paper: "#FFFFFF",
  },

  action: {
    disabledDark: "#757575",
    disabledLight: "#FFFFFF",
  },

  input: {
    border: {
      default: "#757575",
      hover: primary.main,
      focus: primary.main,
      error: danger.main,
    },
    text: {
      filled: text.primary,
      placeholder: "#757575",
      label: text.secondary,
    },
  },

  chip: {
    neutral: { text: "#145B85", background: "#E7EFF3" },
    low: { text: "#176B45", background: "#E8F0EC" },
    medium: { text: secondary.dark, background: secondary.light },
    high: { text: danger.main, background: danger.light },
  },
};

export const typography = {
  fontFamily: "Roboto, sans-serif",

  allVariants: {
    lineHeight: 1.5,
    letterSpacing: "0.16px",
  },

  h1: {
    fontSize: 48,
    fontWeight: 500,
    fontVariant: "small-caps",
    color: text.secondary,
  },
  h2: {
    fontSize: 20,
    fontWeight: 500,
    fontVariant: "small-caps",
    color: text.secondary,
  },
  body1: {
    fontSize: 16,
  },

  // Button variants
  button: {
    fontSize: 16,
    fontWeight: 500,
    fontVariant: "small-caps",
    letterSpacing: "0.46px",
    textTransform: "none", // Remove MUI's default all-caps; keep capitalization as typed
  },
  buttonSmall: {
    fontSize: 16,
    fontWeight: 500,
    fontVariant: "small-caps",
    letterSpacing: "0.46px",
    textTransform: "none", // Remove MUI's default all-caps; keep capitalization as typed
  },

  // Custom variants
  chip: {
    fontSize: 16,
  },

  label: {
    fontSize: 16,
    color: text.label,
  },
};
