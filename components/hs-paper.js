import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "4px 4px 24px hsl(0deg 0% 62% / 25%)",
  },
}));

export default function HSPaper({ className = "", ...props }) {
  const classes = useStyles();
  return (
    <Paper
      className={className}
      classes={{
        root: classes.root,
      }}
      {...props}
    />
  );
}
