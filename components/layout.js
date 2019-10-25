import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  Box,
  AppBar,
  Toolbar,
  Link as MuiLink,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { makeStyles } from "@material-ui/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import api from "../api";

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.common.white,
    boxShadow: `0 2px 4px rgba(0,0,0,.1)`,
    color: theme.palette.getContrastText(theme.palette.common.white)
  },
  logo: {
    width: 120
  },
  navLink: {
    color: theme.palette.text.secondary,
    fontWeight: 800,
    fontSize: "1rem",
    marginRight: theme.spacing(3)
  },
  menuItem: {
    fontWeight: 800,
    color: theme.palette.text.secondary
  },
  menuIcon: {
    marginRight: theme.spacing(1)
  },
  accountButton: {
    color: theme.palette.text.secondary
  }
}));

export default function Layout({
  user = null,
  children,
  toolbarChildren = null
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem classes={{ root: classes.menuItem }}>
        <DashboardIcon className={classes.menuIcon} />
        <span>Dashboard</span>
      </MenuItem>
      <MenuItem
        classes={{ root: classes.menuItem }}
        onClick={async () => {
          await api.logout();
          handleMenuClose();
          Router.push("/");
        }}>
        <ExitToAppIcon className={classes.menuIcon} />
        <span>Sign out</span>
      </MenuItem>
    </Menu>
  );
  return (
    <Box>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Link href="/" passHref>
            <MuiLink variant="h5" color="inherit" underline="none">
              HuluSira
            </MuiLink>
          </Link>
          <Box flex="1" />
          {!user && (
            <MuiLink className={classes.navLink} href="/login">
              Login
            </MuiLink>
          )}
          {!!user && (
            <Button
              className={classes.accountButton}
              startIcon={<AccountCircleIcon />}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleProfileMenuOpen}>
              {`${user.firstName} ${user.lastName}`}
            </Button>
          )}
          {toolbarChildren}
        </Toolbar>
        {renderMenu}
      </AppBar>
      <Box pt={[8, 9]} pb={2}>
        {children}
      </Box>
    </Box>
  );
}
