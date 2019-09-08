import clsx from "clsx";
import ***REMOVED*** Radio, Box, Typography ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

const useStyles = makeStyles(***REMOVED***
  root: props => (***REMOVED***
    ...(props.checked && ***REMOVED*** backgroundColor: "#fafafa" ***REMOVED***)
  ***REMOVED***)
***REMOVED***);

export default function RadioPanel(***REMOVED***
  name,
  value,
  checked,
  primaryLabel,
  secondaryLabel,
  className = ""
***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** checked ***REMOVED***);
  return (
    <Box
      className=***REMOVED***clsx(className, classes.root)***REMOVED***
      display="flex"
      borderColor="grey.200"
      border=***REMOVED***1***REMOVED***
      p=***REMOVED***2***REMOVED***>
      <Radio color="primary" value=***REMOVED***value***REMOVED*** name=***REMOVED***name***REMOVED*** checked=***REMOVED***checked***REMOVED*** />
      <Box>
        <Typography variant="subtitle2" pb=***REMOVED***1***REMOVED***>
          ***REMOVED***primaryLabel***REMOVED***
        </Typography>
        ***REMOVED***secondaryLabel && (
          <Typography variant="body2">***REMOVED***secondaryLabel***REMOVED***</Typography>
        )***REMOVED***
      </Box>
    </Box>
  );
***REMOVED***
