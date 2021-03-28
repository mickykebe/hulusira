import {
  ExpansionPanel,
  makeStyles,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Button,
  Badge,
  ExpansionPanelActions,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  expansionPanel: {
    boxShadow: "none",
    backgroundColor: "inherit",
  },
  expansionPanelExpanded: {},
  expandIcon: {
    fontSize: "1.2rem",
  },
  title: {
    flex: 1,
  },
  filterIcon: {
    color: theme.palette.text.secondary,
  },
}));

export default function FilterPanel({
  title,
  expanded,
  onExpandChange,
  children,
  filterCount = 0,
  onClear,
}) {
  const classes = useStyles();
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={onExpandChange}
      classes={{
        root: classes.expansionPanel,
        expanded: classes.expansionPanelExpanded,
      }}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}>
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
