import React, ***REMOVED*** useState ***REMOVED*** from "react";
import Link from "next/link";
import Router from "next/router";
import ***REMOVED***
  Box,
  AppBar,
  Toolbar,
  Link as MuiLink,
  Button,
  Menu,
  MenuItem
***REMOVED*** from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import api from "../api";

const useStyles = makeStyles(theme => (***REMOVED***
  appBar: ***REMOVED***
    backgroundColor: theme.palette.common.white,
    boxShadow: "none",
    borderBottom: "1px solid #dadce0",
    color: theme.palette.getContrastText(theme.palette.common.white),
    zIndex: theme.zIndex.drawer + 1
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
    fontWeight: 800,
    color: theme.palette.text.secondary,
    padding: theme.spacing(2)
  ***REMOVED***,
  menuIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***,
  accountButton: ***REMOVED***
    color: theme.palette.text.secondary
  ***REMOVED***,
  toolbar: theme.mixins.toolbar
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
      <MenuItem
        classes=***REMOVED******REMOVED*** root: classes.menuItem ***REMOVED******REMOVED***
        onClick=***REMOVED***() => ***REMOVED***
          console.log("dashboard menu click");
          Router.push("/dashboard/jobs");
        ***REMOVED******REMOVED***>
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
    <Box display="flex" flexDirection="column" height="100%">
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
            <Button
              className=***REMOVED***classes.accountButton***REMOVED***
              startIcon=***REMOVED***<AccountCircleIcon />***REMOVED***
              endIcon=***REMOVED***<ArrowDropDownIcon />***REMOVED***
              onClick=***REMOVED***handleProfileMenuOpen***REMOVED***>
              ***REMOVED***`$***REMOVED***user.firstName***REMOVED*** $***REMOVED***user.lastName***REMOVED***`***REMOVED***
            </Button>
          )***REMOVED***
          ***REMOVED***toolbarChildren***REMOVED***
        </Toolbar>
        ***REMOVED***renderMenu***REMOVED***
      </AppBar>
      <div className=***REMOVED***classes.toolbar***REMOVED*** />
      <Box pb=***REMOVED***2***REMOVED*** height="100%">
        ***REMOVED***children***REMOVED***
      </Box>
    </Box>
  );
***REMOVED***
