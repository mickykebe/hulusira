import Router from "next/router";
import {
  Drawer,
  makeStyles,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box
} from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import Layout from "../components/layout";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
  drawerHeader: {
    fontWeight: 800
  },
  main: {
    overflowY: "auto"
  }
}));

export default function DashboardLayout({ user, children, selectedItem }) {
  const classes = useStyles();
  return (
    <Layout user={user}>
      <Box width="100%" height="100%" display="flex" overflow="hidden">
        <Drawer
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant="permanent">
          <div className={classes.drawerContent}>
            <List
              component="nav"
              subheader={
                <ListSubheader
                  classes={{ root: classes.drawerHeader }}
                  component="div">
                  Employer
                </ListSubheader>
              }>
              <ListItem
                selected={selectedItem === "jobs"}
                button
                onClick={() => Router.push("/dashboard/jobs")}>
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
                onClick={() => Router.push("/company")}>
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
            </List>
          </div>
        </Drawer>
        <Box className={classes.main} pt={2} width="100%">
          {children}
        </Box>
      </Box>
    </Layout>
  );
}
