import ***REMOVED*** Card, CardContent, CardHeader ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    boxShadow: theme.boxShadows[0]
  ***REMOVED***,
  cardContent: ***REMOVED***
    paddingTop: 0
  ***REMOVED***,
  cardHeaderTitle: ***REMOVED***
    fontSize: "1.2rem",
    fontWeight: 800
  ***REMOVED***
***REMOVED***));

export default function HSCard(***REMOVED*** className, children, title ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Card
      className=***REMOVED***className***REMOVED***
      classes=***REMOVED******REMOVED***
        root: classes.root
      ***REMOVED******REMOVED***>
      ***REMOVED***title && (
        <CardHeader
          title=***REMOVED***title***REMOVED***
          classes=***REMOVED******REMOVED***
            title: classes.cardHeaderTitle
          ***REMOVED******REMOVED***
        />
      )***REMOVED***
      <CardContent
        classes=***REMOVED******REMOVED***
          root: classes.cardContent
        ***REMOVED******REMOVED***>
        ***REMOVED***children***REMOVED***
      </CardContent>
    </Card>
  );
***REMOVED***
