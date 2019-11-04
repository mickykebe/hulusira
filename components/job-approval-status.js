import { Typography, makeStyles } from "@material-ui/core";

const colors = {
  Pending: "#fb8c00",
  Approved: "#43a047",
  Declined: "red"
};

const useStyles = makeStyles(theme => ({
  root: ({ approvalStatus }) => ({
    color: colors[approvalStatus]
  })
}));

export default function JobApprovalStatus({ approvalStatus }) {
  const classes = useStyles({ approvalStatus });
  return (
    <Typography variant="subtitle2" className={classes.root}>
      {approvalStatus}
    </Typography>
  );
}
