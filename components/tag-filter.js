import { Paper, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import HSPaper from "./hs-paper";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: `0px 3px 3px rgba(0, 105, 255, 0.3)`
  },
  tagChip: {
    border: `1px solid ${theme.palette.grey[700]}`,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
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
          onDelete={() => onTagRemove(tag.id)}></Chip>
      ))}
    </HSPaper>
  );
}
