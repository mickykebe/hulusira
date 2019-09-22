import ***REMOVED*** Paper, Chip ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import HSPaper from "./hs-paper";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: `0px 3px 3px rgba(0, 105, 255, 0.3)`
  ***REMOVED***,
  tagChip: ***REMOVED***
    border: `1px solid $***REMOVED***theme.palette.grey[700]***REMOVED***`,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 800,
    fontSize: 11,
    color: theme.palette.grey[700]
  ***REMOVED***
***REMOVED***));

export default function TagFilter(***REMOVED*** tags, onTagRemove ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <HSPaper className=***REMOVED***classes.root***REMOVED***>
      ***REMOVED***tags.map(tag => (
        <Chip
          key=***REMOVED***tag.name***REMOVED***
          label=***REMOVED***tag.name***REMOVED***
          variant="outlined"
          className=***REMOVED***classes.tagChip***REMOVED***
          onDelete=***REMOVED***() => onTagRemove(tag.id)***REMOVED***></Chip>
      ))***REMOVED***
    </HSPaper>
  );
***REMOVED***
