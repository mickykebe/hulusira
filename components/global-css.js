import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  "@global": {
    /* html: {
      height: "100%"
    },
    body: {
      height: "100%"
    },
    "#__next": {
      height: "100%"
    } */
    html: {
      [theme.breakpoints.down("xs")]: {
        fontSize: "75%"
      }
    }
  }
}));

export default function GlobalCss() {
  useStyles();
  return null;
}
