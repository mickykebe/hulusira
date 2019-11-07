import { Container, Toolbar, Box, Button, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Fragment, useState } from "react";
import Banner from "./banner";
import JobContent from "./job-content";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";

const useStyles = makeStyles(theme => ({
  toolbar: {
    padding: 0
  },
  closeIcon: {
    fontSize: "1.125rem",
    marginRight: theme.spacing(0.5)
  }
}));

export default function JobContentManage({
  jobData,
  isClosingJob,
  errorClosingJob,
  clearCloseError,
  onJobClose,
  closeDialogOpen,
  setCloseDialogOpen,
  isJobOwner
}) {
  const classes = useStyles();
  return (
    <Fragment>
      <Container>
        {jobData.job.closed && (
          <Banner
            variant="error"
            message="This job has been closed by its owner."
          />
        )}
        {!jobData.job.closed && jobData.job.approvalStatus === "Pending" && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )}
        {jobData.job.approvalStatus === "Declined" && (
          <Banner
            variant="error"
            message="Administrator has declined to approve this post."
          />
        )}
        {isJobOwner && !jobData.job.closed && (
          <Toolbar className={classes.toolbar}>
            <Box flex={1} />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={isClosingJob}
              onClick={() => setCloseDialogOpen(true)}>
              <CloseIcon className={classes.closeIcon} /> Close Job
            </Button>
          </Toolbar>
        )}
      </Container>
      <JobContent jobData={jobData} />
      <JobCloseDialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        onConfirmation={onJobClose}
      />
      <HSSnackBar
        open={errorClosingJob}
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration={3000}
        onClose={clearCloseError}
      />
    </Fragment>
  );
}
