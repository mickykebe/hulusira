import React from "react";
import Link from "next/link";
import { Box, AppBar, Toolbar, Link as MuiLink } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.common.white,
    boxShadow: `0 2px 4px rgba(0,0,0,.1)`,
    color: theme.palette.getContrastText(theme.palette.common.white)
  },
  logo: {
    width: 120
  }
}));

export default function Layout({ children, toolbarChildren = null }) {
  const classes = useStyles();
  return (
    <Box>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Link href="/" passHref>
            <MuiLink variant="h5" color="inherit" underline="none">
              HuluSira
            </MuiLink>
          </Link>
          {toolbarChildren}
        </Toolbar>
      </AppBar>
      <Box pt={9}>{children}</Box>
    </Box>
  );
}
