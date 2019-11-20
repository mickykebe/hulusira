import { Container, Toolbar, Box, Button, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Fragment, useState } from "react";
import Banner from "./banner";
import JobContent from "./job-content";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";
import HeaderAd from "./header-ad";

const useStyles = makeStyles(theme => ({
  header: {
    paddingTop: theme.spacing(2)
  },
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
  isJobOwner,
  withAds = false
}) {
  const classes = useStyles();
  const { approvalStatus } = jobData.job;
  return (
    <Fragment>
      <Container className={classes.header}>
        {withAds && <HeaderAd />}
        {
          approvalStatus === "Closed" && (
            <Banner
            variant="error"
            message="This job has been closed by its owner."
          />
          )
        }
        {approvalStatus === "Pending" && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )}
        {approvalStatus === "Declined" && (
          <Banner
            variant="error"
            message="Administrator has declined to approve this post."
          />
        )}
        {isJobOwner && approvalStatus === "Active" && (
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
      <JobContent withAds={withAds} jobData={jobData} />
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
