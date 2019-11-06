import ***REMOVED*** Box, makeStyles ***REMOVED*** from "@material-ui/core";

const useStyles = makeStyles(theme => (***REMOVED***
  previewThumb: ***REMOVED***
    width: 150,
    height: 150,
    position: "relative",
    backgroundColor: "#fafbfc",
    margin: `$***REMOVED***theme.spacing(2)***REMOVED***px 0`,
    border: `1px solid #eee`
  ***REMOVED***,
  previewThumbImg: ***REMOVED***
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  ***REMOVED***
***REMOVED***));

export default function FormImagePreview(***REMOVED*** src, alt = "" ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Box className=***REMOVED***classes.previewThumb***REMOVED***>
      <img className=***REMOVED***classes.previewThumbImg***REMOVED*** src=***REMOVED***src***REMOVED*** alt=***REMOVED***alt***REMOVED*** />
    </Box>
  );
***REMOVED***
