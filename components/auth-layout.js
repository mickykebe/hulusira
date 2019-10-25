import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import Link from "next/link";
import ***REMOVED*** Link as MuiLink ***REMOVED*** from "@material-ui/core";
import HSPaper from "./hs-paper";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 $***REMOVED***theme.spacing(2)***REMOVED***px`
  ***REMOVED***,
  signinCard: ***REMOVED***
    padding: theme.spacing(2),
    maxWidth: 400,
    margin: "auto"
  ***REMOVED***,
  logoLink: ***REMOVED***
    display: "block"
  ***REMOVED***
***REMOVED***));

export default function AuthLayout(***REMOVED*** children ***REMOVED***) ***REMOVED***
  const classes = useStyles();

  return (
    <div className=***REMOVED***classes.root***REMOVED***>
      <HSPaper className=***REMOVED***classes.signinCard***REMOVED***>
        <Link href="/" passHref>
          <MuiLink
            classes=***REMOVED******REMOVED*** root: classes.logoLink ***REMOVED******REMOVED***
            variant="h5"
            align="center"
            color="inherit"
            underline="none">
            HuluSira
          </MuiLink>
        </Link>
        ***REMOVED***children***REMOVED***
      </HSPaper>
    </div>
  );
***REMOVED***
