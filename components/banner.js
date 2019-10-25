import ***REMOVED*** Paper, makeStyles, Typography ***REMOVED*** from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import ***REMOVED*** amber, green ***REMOVED*** from "@material-ui/core/colors";

const variantColor = (variant, infoColor, errorColor) => ***REMOVED***
  switch (variant) ***REMOVED***
    case "success":
      return green[700];
    case "error":
      return errorColor;
    case "warning":
      return amber[700];
    default:
      return infoColor;
  ***REMOVED***
***REMOVED***;

const useStyles = makeStyles(theme => (***REMOVED***
  root: props => (***REMOVED***
    backgroundColor: variantColor(
      props.variant,
      "dodgerblue",
      theme.palette.error.dark
    ),
    padding: `$***REMOVED***theme.spacing(1)***REMOVED***px $***REMOVED***theme.spacing(2)***REMOVED***px`,
    color: "white",
    marginTop: theme.spacing(2)
  ***REMOVED***),
  bannerText: ***REMOVED***
    display: "flex",
    alignItems: "center"
  ***REMOVED***,
  infoIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

export default function Banner(***REMOVED*** message, variant = "info" ***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** variant ***REMOVED***);
  return (
    <Paper classes=***REMOVED******REMOVED*** root: classes.root ***REMOVED******REMOVED***>
      <Typography
        className=***REMOVED***classes.bannerText***REMOVED***
        variant="subtitle1"
        color="inherit">
        <InfoIcon className=***REMOVED***classes.infoIcon***REMOVED*** /> ***REMOVED***message***REMOVED***
      </Typography>
    </Paper>
  );
***REMOVED***
