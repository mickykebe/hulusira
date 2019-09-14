import React from "react";
import clsx from "clsx";
import SimpleMDE from "react-simplemde-editor";
import { makeStyles } from "@material-ui/styles";
//import "easymde/dist/easymde.min.css";
import { Box, FormHelperText } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    "& label": {
      fontSize: "1rem",
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      opacity: 0.7
    },
    "& .CodeMirror .CodeMirror-scroll": {
      minHeight: "150px !important"
    },
    "& .editor-toolbar.fullscreen": {
      zIndex: theme.zIndex.drawer + 1
    },
    "& .CodeMirror-fullscreen": {
      zIndex: theme.zIndex.drawer + 1
    },
    "& .editor-preview-side": {
      zIndex: theme.zIndex.drawer + 1
    }
  },
  errorRoot: {
    "& .CodeMirror": {
      border: `1px solid ${theme.palette.error.main}`
    },
    "& .editor-toolbar": {
      borderTop: `1px solid ${theme.palette.error.main}`,
      borderLeft: `1px solid ${theme.palette.error.main}`,
      borderRight: `1px solid ${theme.palette.error.main}`
    }
  },
  helperText: {
    margin: `${-theme.spacing(1)}px ${theme.spacing(1.3)}px ${theme.spacing(
      1
    )}px`
  }
}));

export default function MDEditor({
  id,
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  options
}) {
  const classes = useStyles({ error });
  return (
    <Box mt={2}>
      <SimpleMDE
        id={id}
        className={clsx({ [classes.root]: true, [classes.errorRoot]: error })}
        label={label}
        value={value}
        onChange={onChange}
        options={{
          spellChecker: true
        }}
      />
      {helperText && (
        <FormHelperText error={error} className={classes.helperText}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
