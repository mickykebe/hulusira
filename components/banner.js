import { Paper, makeStyles, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { amber, green } from "@material-ui/core/colors";

const variantColor = (variant, infoColor, errorColor) => {
  switch (variant) {
    case "success":
      return green[700];
    case "error":
      return errorColor;
    case "warning":
      return amber[700];
    default:
      return infoColor;
  }
};

const useStyles = makeStyles(theme => ({
  root: props => ({
    backgroundColor: variantColor(
      props.variant,
      "dodgerblue",
      theme.palette.error.dark
    ),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "white",
    marginTop: theme.spacing(2)
  }),
  bannerText: {
    display: "flex",
    alignItems: "center"
  },
  infoIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function Banner({ className = "", message, variant = "info" }) {
  const classes = useStyles({ variant });
  return (
    <Paper className={className} classes={{ root: classes.root }}>
      <Typography
        className={classes.bannerText}
        variant="subtitle1"
        color="inherit">
        <InfoIcon className={classes.infoIcon} /> {message}
      </Typography>
    </Paper>
  );
}
