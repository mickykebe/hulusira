import ***REMOVED*** Drawer, Paper, makeStyles, Typography ***REMOVED*** from "@material-ui/core";
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
  drawerContent: ***REMOVED***
    padding: theme.spacing(2)
  ***REMOVED***,
  toolbar: theme.mixins.toolbar
***REMOVED***));

export default function Dashboard(***REMOVED*** user ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Drawer
        className=***REMOVED***classes.drawer***REMOVED***
        classes=***REMOVED******REMOVED*** paper: classes.drawerPaper ***REMOVED******REMOVED***
        variant="permanent">
        <div className=***REMOVED***classes.toolbar***REMOVED*** />
        <div className=***REMOVED***classes.drawerContent***REMOVED***>
          <Typography variant="overline" color="textSecondary">
            Employer
          </Typography>
        </div>
      </Drawer>
    </Layout>
  );
***REMOVED***
