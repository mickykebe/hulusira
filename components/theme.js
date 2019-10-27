import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0069ff"
    },
    secondary: {
      main: "#172b4d"
    },
    background: {
      default: "#FBFBFD"
    }
  },
  typography: {
    fontFamily: [
      "Nunito",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ],
    h6: {
      fontWeight: 800
    },
    h5: {
      fontWeight: 800
    },
    h4: {
      fontWeight: 800
    },
    h3: {
      fontWeight: 800
    },
    subtitle1: {
      fontWeight: 800
    },
    subtitle2: {
      fontWeight: 800
    },
    button: {
      fontWeight: 800
    },
    overline: {
      fontWeight: 800
    }
  },
  boxShadows: ["0 1px 3px 0 rgba(0, 0, 0, 0.04)"]
});

export default theme;
