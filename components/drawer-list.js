import ***REMOVED*** List, ListSubheader, makeStyles ***REMOVED*** from "@material-ui/core";

const useStyles = makeStyles(theme => (***REMOVED***
  subheader: ***REMOVED***
    fontWeight: 800
  ***REMOVED***
***REMOVED***));

export default function DrawerList(***REMOVED*** headerTitle, children ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <List
      component="nav"
      subheader=***REMOVED***
        <ListSubheader classes=***REMOVED******REMOVED*** root: classes.subheader ***REMOVED******REMOVED*** component="div">
          ***REMOVED***headerTitle***REMOVED***
        </ListSubheader>
      ***REMOVED***
    >
      ***REMOVED***children***REMOVED***
    </List>
  );
***REMOVED***
