import React, ***REMOVED*** useState ***REMOVED*** from "react";
import Link from "next/link";
import Router from "next/router";
import ***REMOVED***
  Box,
  AppBar,
  Toolbar,
  Link as MuiLink,
  Button,
  IconButton,
  Menu,
  MenuItem
***REMOVED*** from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import api from "../api";

const useStyles = makeStyles(theme => (***REMOVED***
  appBar: ***REMOVED***
    backgroundColor: theme.palette.common.white,
    boxShadow: `0 2px 4px rgba(0,0,0,.1)`,
    color: theme.palette.getContrastText(theme.palette.common.white)
  ***REMOVED***,
  logo: ***REMOVED***
    width: 120
  ***REMOVED***,
  navLink: ***REMOVED***
    color: theme.palette.text.secondary,
    fontWeight: 800,
    fontSize: "1rem",
    marginRight: theme.spacing(3)
  ***REMOVED***,
  menuItem: ***REMOVED***
    color: theme.palette.text.secondary
  ***REMOVED***,
  menuIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

export default function Layout(***REMOVED***
  user = null,
  children,
  toolbarChildren = null
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = event => ***REMOVED***
    setAnchorEl(event.currentTarget);
  ***REMOVED***;
  const handleMenuClose = () => ***REMOVED***
    setAnchorEl(null);
  ***REMOVED***;
  const renderMenu = (
    <Menu
      anchorEl=***REMOVED***anchorEl***REMOVED***
      anchorOrigin=***REMOVED******REMOVED*** vertical: "top", horizontal: "right" ***REMOVED******REMOVED***
      keepMounted
      transformOrigin=***REMOVED******REMOVED*** vertical: "top", horizontal: "right" ***REMOVED******REMOVED***
      open=***REMOVED***isMenuOpen***REMOVED***
      onClose=***REMOVED***handleMenuClose***REMOVED***>
      <MenuItem classes=***REMOVED******REMOVED*** root: classes.menuItem ***REMOVED******REMOVED***>
        <DashboardIcon className=***REMOVED***classes.menuIcon***REMOVED*** />
        <span>Dashboard</span>
      </MenuItem>
      <MenuItem
        classes=***REMOVED******REMOVED*** root: classes.menuItem ***REMOVED******REMOVED***
        onClick=***REMOVED***async () => ***REMOVED***
          await api.logout();
          handleMenuClose();
          Router.push("/");
        ***REMOVED******REMOVED***>
        <ExitToAppIcon className=***REMOVED***classes.menuIcon***REMOVED*** />
        <span>Sign out</span>
      </MenuItem>
    </Menu>
  );
  return (
    <Box>
      <AppBar className=***REMOVED***classes.appBar***REMOVED***>
        <Toolbar>
          <Link href="/" passHref>
            <MuiLink variant="h5" color="inherit" underline="none">
              HuluSira
            </MuiLink>
          </Link>
          <Box flex="1" />
          ***REMOVED***!user && (
            <MuiLink className=***REMOVED***classes.navLink***REMOVED*** href="/login">
              Login
            </MuiLink>
          )***REMOVED***
          ***REMOVED***!!user && (
            <IconButton
              className=***REMOVED***classes.linkButton***REMOVED***
              onClick=***REMOVED***handleProfileMenuOpen***REMOVED***>
              <AccountCircleIcon />
            </IconButton>
          )***REMOVED***
          ***REMOVED***toolbarChildren***REMOVED***
        </Toolbar>
        ***REMOVED***renderMenu***REMOVED***
      </AppBar>
      <Box pt=***REMOVED***[8, 9]***REMOVED*** pb=***REMOVED***2***REMOVED***>
        ***REMOVED***children***REMOVED***
      </Box>
    </Box>
  );
***REMOVED***
