import { List, ListSubheader, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  subheader: {
    fontWeight: 800
  }
}));

export default function DrawerList({ headerTitle, children }) {
  const classes = useStyles();
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader classes={{ root: classes.subheader }} component="div">
          {headerTitle}
        </ListSubheader>
      }
    >
      {children}
    </List>
  );
}
