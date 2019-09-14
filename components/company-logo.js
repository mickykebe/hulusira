import ***REMOVED*** Box, Typography ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const logoSizes = ***REMOVED***
  small: ***REMOVED***
    width: 24,
    height: 24,
  ***REMOVED***,
  medium: ***REMOVED***
    width: 48,
    height: 48,
  ***REMOVED***,
  large: ***REMOVED***
    width: 64,
    height: 64,
  ***REMOVED***,
***REMOVED***

const useStyles = makeStyles(***REMOVED***
  logoContainer: props => (***REMOVED***
    position: "relative",
    backgroundColor: `#fafbfc`,
    border: `1px solid #eee`,
    ...(logoSizes[props.size]),
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
  ***REMOVED***,
  abbrev: props => (***REMOVED***
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...(logoSizes[props.size]),
  ***REMOVED***),
***REMOVED***);

function abbrev(name) ***REMOVED***
  const [word1, word2, ..._rest] = name.split(" ");
  return `$***REMOVED***word1[0] ? word1[0].toUpperCase() : ""***REMOVED***$***REMOVED***word2 ? word2[0] : ""***REMOVED***`;
***REMOVED***

export default function CompanyLogo(***REMOVED*** company, abbrevFallback = true, size = "medium" ***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** size ***REMOVED***);
  if(company.logo) ***REMOVED***
    return (
      <Box className=***REMOVED***classes.logoContainer***REMOVED***>
        <img
          className=***REMOVED***classes.logo***REMOVED***
          src=***REMOVED***company.logo***REMOVED***
          alt="Company logo"
          loading="lazy"
        />
      </Box>
    );
  ***REMOVED***
  if(abbrevFallback) ***REMOVED***
    return (
      <Typography
        variant="h4"
        color="textSecondary"
        align="center"
        className=***REMOVED***classes.abbrev***REMOVED***>
          ***REMOVED***abbrev(company.name)***REMOVED***
        </Typography>
    );
  ***REMOVED***
  return null;
***REMOVED***
