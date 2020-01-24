import {
  ExpansionPanel,
  makeStyles,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Button,
  Badge,
  ExpansionPanelActions
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  expansionPanel: {
    marginTop: "0.5rem",
    boxShadow: "none",
    backgroundColor: "inherit"
    /* "&::before": {
      display: "none"
    } */
  },
  expansionPanelExpanded: {},
  panelSummary: {
    padding: 0,
    transition: `padding 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
  },
  panelSummaryExpanded: {
    padding: `0 1rem 0 1rem`
  },
  title: {
    flex: 1
  },
  filterIcon: {
    color: theme.palette.text.secondary
  }
}));

export default function FilterPanel({
  title,
  expanded,
  onExpandChange,
  children,
  filterCount = 0,
  onClear
}) {
  const classes = useStyles();
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={onExpandChange}
      classes={{
        root: classes.expansionPanel,
        expanded: classes.expansionPanelExpanded
      }}
    >
      <ExpansionPanelSummary
        classes={{
          root: classes.panelSummary,
          expanded: classes.panelSummaryExpanded
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography className={classes.title} variant="subtitle2">
          {title}
        </Typography>
        {filterCount > 0 && (
          <Badge variant="dot" color="primary">
            <FilterListIcon fontSize="small" color="action" />
          </Badge>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      {filterCount > 0 && onClear && (
        <ExpansionPanelActions>
          <Button size="small" color="primary" onClick={onClear}>
            Clear All
          </Button>
        </ExpansionPanelActions>
      )}
    </ExpansionPanel>
  );
}
