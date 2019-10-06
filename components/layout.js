import React from "react";
import Link from "next/link";
import ***REMOVED*** Box, AppBar, Toolbar, Link as MuiLink ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(theme => (***REMOVED***
  appBar: ***REMOVED***
    backgroundColor: theme.palette.common.white,
    boxShadow: `0 2px 4px rgba(0,0,0,.1)`,
    color: theme.palette.getContrastText(theme.palette.common.white)
  ***REMOVED***,
  logo: ***REMOVED***
    width: 120
  ***REMOVED***
***REMOVED***));

export default function Layout(***REMOVED*** children, toolbarChildren = null ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Box>
      <AppBar className=***REMOVED***classes.appBar***REMOVED***>
        <Toolbar>
          <Link href="/" passHref>
            <MuiLink variant="h5" color="inherit" underline="none">
              HuluSira
            </MuiLink>
          </Link>
          ***REMOVED***toolbarChildren***REMOVED***
        </Toolbar>
      </AppBar>
      <Box pt=***REMOVED***9***REMOVED*** pb=***REMOVED***2***REMOVED***>
        ***REMOVED***children***REMOVED***
      </Box>
    </Box>
  );
***REMOVED***
