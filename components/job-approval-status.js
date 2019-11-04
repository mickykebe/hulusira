import ***REMOVED*** Typography, makeStyles ***REMOVED*** from "@material-ui/core";

const colors = ***REMOVED***
  Pending: "#fb8c00",
  Approved: "#43a047",
  Declined: "red"
***REMOVED***;

const useStyles = makeStyles(theme => (***REMOVED***
  root: (***REMOVED*** approvalStatus ***REMOVED***) => (***REMOVED***
    color: colors[approvalStatus]
  ***REMOVED***)
***REMOVED***));

export default function JobApprovalStatus(***REMOVED*** approvalStatus ***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** approvalStatus ***REMOVED***);
  return (
    <Typography variant="subtitle2" className=***REMOVED***classes.root***REMOVED***>
      ***REMOVED***approvalStatus***REMOVED***
    </Typography>
  );
***REMOVED***
