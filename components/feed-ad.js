import GoogleAd from "./google-ad";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: 150,
  },
}));

export default function FeedAd() {
  const classes = useStyles();
  return <GoogleAd dataAdLayouKey="-ha-6+1u-6q+8y" dataAdSlot="8888209775" className={classes.root} />;
}
