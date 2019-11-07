import ***REMOVED*** Container, Toolbar, Box, Button, makeStyles ***REMOVED*** from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ***REMOVED*** Fragment, useState ***REMOVED*** from "react";
import Banner from "./banner";
import JobContent from "./job-content";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";

const useStyles = makeStyles(theme => (***REMOVED***
  toolbar: ***REMOVED***
    padding: 0
  ***REMOVED***,
  closeIcon: ***REMOVED***
    fontSize: "1.125rem",
    marginRight: theme.spacing(0.5)
  ***REMOVED***
***REMOVED***));

export default function JobContentManage(***REMOVED***
  jobData,
  isClosingJob,
  errorClosingJob,
  clearCloseError,
  onJobClose,
  closeDialogOpen,
  setCloseDialogOpen,
  isJobOwner
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Fragment>
      <Container>
        ***REMOVED***jobData.job.closed && (
          <Banner
            variant="error"
            message="This job has been closed by its owner."
          />
        )***REMOVED***
        ***REMOVED***!jobData.job.closed && jobData.job.approvalStatus === "Pending" && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )***REMOVED***
        ***REMOVED***jobData.job.approvalStatus === "Declined" && (
          <Banner
            variant="error"
            message="Administrator has declined to approve this post."
          />
        )***REMOVED***
        ***REMOVED***isJobOwner && !jobData.job.closed && (
          <Toolbar className=***REMOVED***classes.toolbar***REMOVED***>
            <Box flex=***REMOVED***1***REMOVED*** />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled=***REMOVED***isClosingJob***REMOVED***
              onClick=***REMOVED***() => setCloseDialogOpen(true)***REMOVED***>
              <CloseIcon className=***REMOVED***classes.closeIcon***REMOVED*** /> Close Job
            </Button>
          </Toolbar>
        )***REMOVED***
      </Container>
      <JobContent jobData=***REMOVED***jobData***REMOVED*** />
      <JobCloseDialog
        open=***REMOVED***closeDialogOpen***REMOVED***
        onClose=***REMOVED***() => setCloseDialogOpen(false)***REMOVED***
        onConfirmation=***REMOVED***onJobClose***REMOVED***
      />
      <HSSnackBar
        open=***REMOVED***errorClosingJob***REMOVED***
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***clearCloseError***REMOVED***
      />
    </Fragment>
  );
***REMOVED***
