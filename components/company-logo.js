import ***REMOVED*** Box, Typography ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const logoSizes = ***REMOVED***
  small: ***REMOVED***
    width: 48,
    height: 48
  ***REMOVED***,
  medium: ***REMOVED***
    width: 72,
    height: 72
  ***REMOVED***,
  large: ***REMOVED***
    width: 96,
    height: 96
  ***REMOVED***
***REMOVED***;

const useStyles = makeStyles(theme => (***REMOVED***
  logoContainer: props => (***REMOVED***
    position: "relative",
    backgroundColor: theme.palette.background.default,
    border: `1px solid #eee`,
    cursor: props.isLink ? "pointer" : "auto",
    borderRadius: "50%",
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...logoSizes[props.size]
  ***REMOVED***),
  logo: ***REMOVED***
    maxWidth: "100%",
    maxHeight: "100%",
    padding: theme.spacing(0.5)
  ***REMOVED***,
  abbrev: props => (***REMOVED***
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: props.isLink ? "pointer" : "auto",
    ...logoSizes[props.size]
  ***REMOVED***)
***REMOVED***));

function abbrev(name) ***REMOVED***
  const [word1, word2, ..._rest] = name.split(" ");
  return `$***REMOVED***word1[0] ? word1[0].toUpperCase() : ""***REMOVED***$***REMOVED***word2 ? word2[0] : ""***REMOVED***`;
***REMOVED***

export default function CompanyLogo(***REMOVED***
  company,
  abbrevFallback = true,
  size = "medium",
  onClick
***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** size, isLink: !!onClick ***REMOVED***);
  if (company.logo) ***REMOVED***
    return (
      <Box className=***REMOVED***classes.logoContainer***REMOVED*** onClick=***REMOVED***onClick***REMOVED***>
        <img
          className=***REMOVED***classes.logo***REMOVED***
          src=***REMOVED***company.logo***REMOVED***
          alt="Company logo"
          loading="lazy"
        />
      </Box>
    );
  ***REMOVED***
  if (abbrevFallback) ***REMOVED***
    return (
      <Box className=***REMOVED***classes.logoContainer***REMOVED*** onClick=***REMOVED***onClick***REMOVED***>
        <Typography
          variant=***REMOVED***size === "small" ? "h5" : "h4"***REMOVED***
          color="textSecondary"
          align="center"
          className=***REMOVED***classes.abbrev***REMOVED***
          onClick=***REMOVED***onClick***REMOVED***
        >
          ***REMOVED***abbrev(company.name)***REMOVED***
        </Typography>
      </Box>
    );
  ***REMOVED***
  return null;
***REMOVED***
