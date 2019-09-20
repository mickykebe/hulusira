import { Paper, makeStyles, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "dodgerblue",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "white",
    marginTop: theme.spacing(2)
  },
  bannerText: {
    display: "flex",
    alignItems: "center"
  },
  infoIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function Banner({ message }) {
  const classes = useStyles();
  return (
    <Paper classes={{ root: classes.root }}>
      <Typography
        className={classes.bannerText}
        variant="subtitle1"
        color="inherit">
        <InfoIcon className={classes.infoIcon} /> {message}
      </Typography>
    </Paper>
  );
}
