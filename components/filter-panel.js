import ***REMOVED***
  ExpansionPanel,
  makeStyles,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Button,
  Badge,
  ExpansionPanelActions
***REMOVED*** from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => (***REMOVED***
  expansionPanel: ***REMOVED***
    boxShadow: "none",
    backgroundColor: "inherit"
  ***REMOVED***,
  expansionPanelExpanded: ***REMOVED******REMOVED***,
  expandIcon: ***REMOVED***
    fontSize: "1.2rem"
  ***REMOVED***,
  panelSummaryExpanded: ***REMOVED***
    padding: `0 1rem 0 1rem`
  ***REMOVED***,
  title: ***REMOVED***
    flex: 1
  ***REMOVED***,
  filterIcon: ***REMOVED***
    color: theme.palette.text.secondary
  ***REMOVED***
***REMOVED***));

export default function FilterPanel(***REMOVED***
  title,
  expanded,
  onExpandChange,
  children,
  filterCount = 0,
  onClear
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <ExpansionPanel
      expanded=***REMOVED***expanded***REMOVED***
      onChange=***REMOVED***onExpandChange***REMOVED***
      classes=***REMOVED******REMOVED***
        root: classes.expansionPanel,
        expanded: classes.expansionPanelExpanded
      ***REMOVED******REMOVED***
    >
      <ExpansionPanelSummary
        classes=***REMOVED******REMOVED***
          expanded: classes.panelSummaryExpanded
        ***REMOVED******REMOVED***
        expandIcon=***REMOVED***<ExpandMoreIcon className=***REMOVED***classes.expandIcon***REMOVED*** />***REMOVED***
      >
        <Typography className=***REMOVED***classes.title***REMOVED*** variant="subtitle2">
          ***REMOVED***title***REMOVED***
        </Typography>
        ***REMOVED***filterCount > 0 && (
          <Badge variant="dot" color="primary">
            <FilterListIcon fontSize="small" color="action" />
          </Badge>
        )***REMOVED***
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>***REMOVED***children***REMOVED***</ExpansionPanelDetails>
      ***REMOVED***filterCount > 0 && onClear && (
        <ExpansionPanelActions>
          <Button size="small" color="primary" onClick=***REMOVED***onClear***REMOVED***>
            Clear All
          </Button>
        </ExpansionPanelActions>
      )***REMOVED***
    </ExpansionPanel>
  );
***REMOVED***
