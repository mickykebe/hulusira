import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  "@global": {
    html: {
      height: "100%",
      [theme.breakpoints.down("xs")]: {
        fontSize: "75%"
      }
    },
    body: {
      height: "100%"
    },
    "#__next": {
      height: "100%"
    }
  }
}));

export default function GlobalCss() {
  useStyles();
  return null;
}
