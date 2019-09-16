import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  "@global": {
    html: {
      height: "100%"
    },
    body: {
      height: "100%"
    },
    "#__next": {
      height: "100%"
    }
  }
});

export default function GlobalCss() {
  useStyles();
  return null;
}
