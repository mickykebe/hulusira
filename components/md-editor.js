import React from "react";
import clsx from "clsx";
import SimpleMDE from "react-simplemde-editor";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
//import "easymde/dist/easymde.min.css";
import ***REMOVED*** Box, FormHelperText ***REMOVED*** from "@material-ui/core";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    display: "flex",
    flexDirection: "column",
    "& label": ***REMOVED***
      fontSize: "1rem",
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      opacity: 0.7
    ***REMOVED***,
    "& .CodeMirror .CodeMirror-scroll": ***REMOVED***
      minHeight: "150px !important"
    ***REMOVED***,
    "& .editor-toolbar.fullscreen": ***REMOVED***
      zIndex: theme.zIndex.drawer + 1
    ***REMOVED***,
    "& .CodeMirror-fullscreen": ***REMOVED***
      zIndex: theme.zIndex.drawer + 1
    ***REMOVED***,
    "& .editor-preview-side": ***REMOVED***
      zIndex: theme.zIndex.drawer + 1
    ***REMOVED***
  ***REMOVED***,
  errorRoot: ***REMOVED***
    "& .CodeMirror": ***REMOVED***
      border: `1px solid $***REMOVED***theme.palette.error.main***REMOVED***`
    ***REMOVED***,
    "& .editor-toolbar": ***REMOVED***
      borderTop: `1px solid $***REMOVED***theme.palette.error.main***REMOVED***`,
      borderLeft: `1px solid $***REMOVED***theme.palette.error.main***REMOVED***`,
      borderRight: `1px solid $***REMOVED***theme.palette.error.main***REMOVED***`
    ***REMOVED***
  ***REMOVED***,
  helperText: ***REMOVED***
    margin: `$***REMOVED***-theme.spacing(1)***REMOVED***px $***REMOVED***theme.spacing(1.3)***REMOVED***px $***REMOVED***theme.spacing(
      1
    )***REMOVED***px`
  ***REMOVED***
***REMOVED***));

export default function MDEditor(***REMOVED***
  id,
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  options
***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** error ***REMOVED***);
  return (
    <Box mt=***REMOVED***2***REMOVED***>
      <SimpleMDE
        id=***REMOVED***id***REMOVED***
        className=***REMOVED***clsx(***REMOVED*** [classes.root]: true, [classes.errorRoot]: error ***REMOVED***)***REMOVED***
        label=***REMOVED***label***REMOVED***
        value=***REMOVED***value***REMOVED***
        onChange=***REMOVED***onChange***REMOVED***
        options=***REMOVED******REMOVED***
          spellChecker: true
        ***REMOVED******REMOVED***
      />
      ***REMOVED***helperText && (
        <FormHelperText error=***REMOVED***error***REMOVED*** className=***REMOVED***classes.helperText***REMOVED***>
          ***REMOVED***helperText***REMOVED***
        </FormHelperText>
      )***REMOVED***
    </Box>
  );
***REMOVED***
