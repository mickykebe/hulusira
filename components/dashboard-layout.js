import ***REMOVED***
  Drawer,
  Paper,
  makeStyles,
  Typography,
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
    width: drawerWidth
  ***REMOVED***,
  drawerContent: ***REMOVED******REMOVED***,
  drawerHeader: ***REMOVED***
    fontWeight: 800
  ***REMOVED***
***REMOVED***));

export default function DashboardLayout(***REMOVED*** user, children, selectedItem ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Box width="100%" height="100%" display="flex">
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
              <ListItem selected=***REMOVED***selectedItem === "jobs"***REMOVED*** button>
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
              <ListItem selected=***REMOVED***selectedItem === "company"***REMOVED*** button>
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
        <Box pt=***REMOVED***2***REMOVED*** width="100%">
          ***REMOVED***children***REMOVED***
        </Box>
      </Box>
    </Layout>
  );
***REMOVED***
