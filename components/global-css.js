import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    html: {
      [theme.breakpoints.down("xs")]: {
        //fontSize: "90%",
      },
    },
  },
}));

export default function GlobalCss() {
  useStyles();
  return null;
}
