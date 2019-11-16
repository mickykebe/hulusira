import { Paper, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import HSPaper from "./hs-paper";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: `0px 3px 3px rgba(200, 200, 200, 0.4)`
  },
  tagChip: {
    border: `1px solid ${theme.palette.grey[700]}`,
    marginRight: theme.spacing(2),
    fontWeight: 800,
    fontSize: 11,
    color: theme.palette.grey[700]
  }
}));

export default function TagFilter({ tags, onTagRemove }) {
  const classes = useStyles();
  return (
    <HSPaper className={classes.root}>
      {tags.map(tag => (
        <Chip
          key={tag.name}
          label={tag.name}
          variant="outlined"
          className={classes.tagChip}
          onDelete={() => onTagRemove(tag.name)}></Chip>
      ))}
    </HSPaper>
  );
}
