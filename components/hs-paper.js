import ***REMOVED*** Paper ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    border: `1px solid #EAEDF3`
  ***REMOVED***,
  elevation1: ***REMOVED***
    boxShadow: theme.boxShadows[0]
  ***REMOVED***
***REMOVED***));

export default function HSPaper(props) ***REMOVED***
  const classes = useStyles();
  return (
    <Paper
      classes=***REMOVED******REMOVED***
        root: classes.root,
        elevation1: classes.elevation1
      ***REMOVED******REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  );
***REMOVED***
