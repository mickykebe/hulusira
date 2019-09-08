import ***REMOVED*** Paper ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(theme => (***REMOVED***
  elevation1: ***REMOVED***
    boxShadow: theme.boxShadows[0]
  ***REMOVED***
***REMOVED***));

export default function HSPaper(***REMOVED*** children, className = "" ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Paper
      className=***REMOVED***className***REMOVED***
      classes=***REMOVED******REMOVED***
        elevation1: classes.elevation1
      ***REMOVED******REMOVED***>
      ***REMOVED***children***REMOVED***
    </Paper>
  );
***REMOVED***
