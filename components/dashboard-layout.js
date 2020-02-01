import Router from "next/router";
import {
  Drawer,
  makeStyles,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  useMediaQuery,
  IconButton
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import Layout from "../components/layout";
import { useTheme } from "@material-ui/styles";
import { useState, Fragment } from "react";
import DrawerList from "./drawer-list";
import AdminDashboardMenuList from "./admin-dashboard-menu-list";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  drawer: {
    height: "100%",
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    position: "static",
    width: drawerWidth,
    overflowY: "auto"
  },
  main: {
    overflowY: "auto"
  }
}));

export default function DashboardLayout({
  user,
  children,
  selectedItem,
  pendingJobs
}) {
  const classes = useStyles();
  const theme = useTheme();
  const sizeSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  return (
    <Layout
      user={user}
      toolbarChildrenStart={
        sizeSm ? (
          <IconButton
            color="inherit"
            className={classes.menuButton}
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          >
            <MenuIcon />
          </IconButton>
        ) : null
      }
    >
      <Box width="100%" height="100%" display="flex" overflow="hidden">
        <Drawer
          open={sizeSm ? mobileDrawerOpen : false}
          onClose={() => setMobileDrawerOpen(false)}
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant={sizeSm ? "temporary" : "permanent"}
        >
          <div className={classes.drawerContent}>
            <Fragment>
              <AdminDashboardMenuList
                user={user}
                selectedItem={selectedItem}
                pendingJobs={pendingJobs}
              />
              <DrawerList headerTitle="Employer">
                <ListItem
                  selected={selectedItem === "jobs"}
                  button
                  onClick={() => Router.push("/dashboard/jobs")}
                >
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "subtitle1",
                      color: "textSecondary"
                    }}
                    primary="Jobs"
                  />
                </ListItem>
                <ListItem
                  selected={selectedItem === "company"}
                  button
                  onClick={() => Router.push("/dashboard/companies")}
                >
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "subtitle1",
                      color: "textSecondary"
                    }}
                    primary="Company"
                  />
                </ListItem>
              </DrawerList>
            </Fragment>
          </div>
        </Drawer>
        <Box className={classes.main} pt={2} width="100%">
          {children}
        </Box>
      </Box>
    </Layout>
  );
}
