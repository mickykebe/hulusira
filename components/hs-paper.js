import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  elevation1: {
    boxShadow: theme.boxShadows[0]
  }
}));

export default function HSPaper({ children, className = "" }) {
  const classes = useStyles();
  return (
    <Paper
      className={className}
      classes={{
        elevation1: classes.elevation1
      }}>
      {children}
    </Paper>
  );
}
