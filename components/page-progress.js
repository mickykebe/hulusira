import ***REMOVED*** LinearProgress ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(() => (***REMOVED***
  root: ***REMOVED***
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1350
  ***REMOVED***
***REMOVED***));

export default function PageProgress() ***REMOVED***
  const classes = useStyles();
  return <LinearProgress classes=***REMOVED******REMOVED*** root: classes.root ***REMOVED******REMOVED*** color="primary" />;
***REMOVED***
