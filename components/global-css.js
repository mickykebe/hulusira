import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(***REMOVED***
  "@global": ***REMOVED***
    html: ***REMOVED***
      height: "100%"
    ***REMOVED***,
    body: ***REMOVED***
      height: "100%"
    ***REMOVED***,
    "#__next": ***REMOVED***
      height: "100%"
    ***REMOVED***
  ***REMOVED***
***REMOVED***);

export default function GlobalCss() ***REMOVED***
  useStyles();
  return null;
***REMOVED***
