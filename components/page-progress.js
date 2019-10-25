import { LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1350
  }
}));

export default function PageProgress() {
  const classes = useStyles();
  return <LinearProgress classes={{ root: classes.root }} color="primary" />;
}
