import { makeStyles, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  image: {
    width: "20rem",
    height: "20rem"
  }
}));

export default function NoData({ message }) {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img className={classes.image} src="/static/empty.svg" alt="No Data" />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
}
