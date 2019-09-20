import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0069ff"
    },
    secondary: {
      main: "#008b8b"
    },
    background: {
      default: "#f4f6f8"
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
    }
  },
  boxShadows: ["0 8px 30px rgba(0,29,54,.1)"]
});

export default theme;
