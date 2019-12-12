import ***REMOVED*** makeStyles, Box, Typography ***REMOVED*** from "@material-ui/core";

const useStyles = makeStyles(theme => (***REMOVED***
  image: ***REMOVED***
    width: "20rem",
    height: "20rem"
  ***REMOVED***
***REMOVED***));

export default function NoData(***REMOVED*** message ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img className=***REMOVED***classes.image***REMOVED*** src="/static/empty.svg" alt="No Data" />
      <Typography variant="h6">***REMOVED***message***REMOVED***</Typography>
    </Box>
  );
***REMOVED***
