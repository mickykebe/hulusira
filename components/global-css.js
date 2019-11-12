import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(theme => (***REMOVED***
  "@global": ***REMOVED***
    html: ***REMOVED***
      [theme.breakpoints.down("xs")]: ***REMOVED***
        fontSize: "75%"
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***));

export default function GlobalCss() ***REMOVED***
  useStyles();
  return null;
***REMOVED***
