import {
  Drawer,
  Paper,
  makeStyles,
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import Layout from "../components/layout";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerContent: {},
  drawerHeader: {
    fontWeight: 800
  },
  toolbar: theme.mixins.toolbar
}));

export default function DashboardLayout({ user, children, selectedItem }) {
  const classes = useStyles();
  return (
    <Layout user={user}>
      <Drawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant="permanent">
        <div className={classes.toolbar} />
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
            <ListItem selected={selectedItem === "jobs"} button>
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
            <ListItem selected={selectedItem === "company"} button>
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
      {children}
    </Layout>
  );
}
