import Router from "next/router";
import ***REMOVED***
  Drawer,
  makeStyles,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box
***REMOVED*** from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import Layout from "../components/layout";

const drawerWidth = 240;

const useStyles = makeStyles(theme => (***REMOVED***
  drawer: ***REMOVED***
    height: "100%",
    width: drawerWidth,
    flexShrink: 0
  ***REMOVED***,
  drawerPaper: ***REMOVED***
    position: "static",
    width: drawerWidth,
    overflowY: "auto"
  ***REMOVED***,
  drawerHeader: ***REMOVED***
    fontWeight: 800
  ***REMOVED***,
  main: ***REMOVED***
    overflowY: "auto"
  ***REMOVED***
***REMOVED***));

export default function DashboardLayout(***REMOVED*** user, children, selectedItem ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Box width="100%" height="100%" display="flex" overflow="hidden">
        <Drawer
          className=***REMOVED***classes.drawer***REMOVED***
          classes=***REMOVED******REMOVED*** paper: classes.drawerPaper ***REMOVED******REMOVED***
          variant="permanent">
          <div className=***REMOVED***classes.drawerContent***REMOVED***>
            <List
              component="nav"
              subheader=***REMOVED***
                <ListSubheader
                  classes=***REMOVED******REMOVED*** root: classes.drawerHeader ***REMOVED******REMOVED***
                  component="div">
                  Employer
                </ListSubheader>
              ***REMOVED***>
              <ListItem
                selected=***REMOVED***selectedItem === "jobs"***REMOVED***
                button
                onClick=***REMOVED***() => Router.push("/dashboard/jobs")***REMOVED***>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps=***REMOVED******REMOVED***
                    variant: "subtitle1",
                    color: "textSecondary"
                  ***REMOVED******REMOVED***
                  primary="Jobs"
                />
              </ListItem>
              <ListItem
                selected=***REMOVED***selectedItem === "company"***REMOVED***
                button
                onClick=***REMOVED***() => Router.push("/company")***REMOVED***>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps=***REMOVED******REMOVED***
                    variant: "subtitle1",
                    color: "textSecondary"
                  ***REMOVED******REMOVED***
                  primary="Company"
                />
              </ListItem>
            </List>
          </div>
        </Drawer>
        <Box className=***REMOVED***classes.main***REMOVED*** pt=***REMOVED***2***REMOVED*** width="100%">
          ***REMOVED***children***REMOVED***
        </Box>
      </Box>
    </Layout>
  );
***REMOVED***
