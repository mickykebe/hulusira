import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    border: `1px solid #EAEDF3`
  },
  elevation1: {
    boxShadow: theme.boxShadows[0]
  }
}));

export default function HSPaper({ className = "", ...props }) {
  const classes = useStyles();
  return (
    <Paper
      className={className}
      classes={{
        root: classes.root,
        elevation1: classes.elevation1
      }}
      {...props}
    />
  );
}
