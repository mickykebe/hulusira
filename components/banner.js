import ***REMOVED*** Paper, makeStyles, Typography ***REMOVED*** from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    backgroundColor: "dodgerblue",
    padding: `$***REMOVED***theme.spacing(1)***REMOVED***px $***REMOVED***theme.spacing(2)***REMOVED***px`,
    color: "white",
    marginTop: theme.spacing(2)
  ***REMOVED***,
  bannerText: ***REMOVED***
    display: "flex",
    alignItems: "center"
  ***REMOVED***,
  infoIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

export default function Banner(***REMOVED*** message ***REMOVED***) ***REMOVED***
  const classes = useStyles();
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
