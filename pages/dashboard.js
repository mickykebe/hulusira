import { Drawer, Paper, makeStyles, Typography } from "@material-ui/core";
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
  drawerContent: {
    padding: theme.spacing(2)
  },
  toolbar: theme.mixins.toolbar
}));

export default function Dashboard({ user }) {
  const classes = useStyles();
  return (
    <Layout user={user}>
      <Drawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant="permanent">
        <div className={classes.toolbar} />
        <div className={classes.drawerContent}>
          <Typography variant="overline" color="textSecondary">
            Employer
          </Typography>
        </div>
      </Drawer>
    </Layout>
  );
}
