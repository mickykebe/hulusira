import ***REMOVED***
  Drawer,
  Paper,
  makeStyles,
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon
***REMOVED*** from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import Layout from "../components/layout";

const drawerWidth = 240;

const useStyles = makeStyles(theme => (***REMOVED***
  drawer: ***REMOVED***
    width: drawerWidth,
    flexShrink: 0
  ***REMOVED***,
  drawerPaper: ***REMOVED***
    width: drawerWidth
  ***REMOVED***,
  drawerContent: ***REMOVED******REMOVED***,
  drawerHeader: ***REMOVED***
    fontWeight: 800
  ***REMOVED***,
  toolbar: theme.mixins.toolbar
***REMOVED***));

export default function DashboardLayout(***REMOVED*** user, children, selectedItem ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Drawer
        className=***REMOVED***classes.drawer***REMOVED***
        classes=***REMOVED******REMOVED*** paper: classes.drawerPaper ***REMOVED******REMOVED***
        variant="permanent">
        <div className=***REMOVED***classes.toolbar***REMOVED*** />
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
      ***REMOVED***children***REMOVED***
    </Layout>
  );
***REMOVED***
