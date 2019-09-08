import ***REMOVED*** Box ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(***REMOVED***
  logoContainer: props => (***REMOVED***
    position: "relative",
    backgroundColor: `#fafbfc`,
    border: `1px solid #eee`,
    ...(props.size === "small" && ***REMOVED***
      width: 24,
      height: 24
    ***REMOVED***),
    ...(props.size === "medium" && ***REMOVED***
      width: 48,
      height: 48
    ***REMOVED***),
    ...(props.size === "large" && ***REMOVED***
      width: 64,
      height: 64
    ***REMOVED***)
  ***REMOVED***),
  logo: ***REMOVED***
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  ***REMOVED***
***REMOVED***);

export default function CompanyLogo(***REMOVED*** size = "medium", src ***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** size ***REMOVED***);
  return (
    <Box className=***REMOVED***classes.logoContainer***REMOVED***>
      <img
        className=***REMOVED***classes.logo***REMOVED***
        src=***REMOVED***src***REMOVED***
        alt="Company logo"
        loading="lazy"
      />
    </Box>
  );
***REMOVED***
