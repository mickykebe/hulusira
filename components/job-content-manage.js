import {
  Container,
  Toolbar,
  Box,
  Button,
  makeStyles,
  Hidden,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Fragment, useState, useReducer } from "react";
import isAfter from "date-fns/isAfter";
import endOfDay from "date-fns/endOfDay";
import Banner from "./banner";
import JobContent from "./job-content";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";
import HeaderAd from "./header-ad";
import jobCloseReducer from "../reducers/close-job";
import useCloseJob from "../hooks/use-close-job";
import MobileHeaderAd from "./mobile-header-ad";

const useStyles = makeStyles((theme) => ({
  header: {
    paddingTop: theme.spacing(2),
  },
  toolbar: {
    padding: 0,
  },
  closeIcon: {
    fontSize: "1.125rem",
    marginRight: theme.spacing(0.5),
  },
}));

export default function JobContentManage({
  jobData,
  onJobClose,
  isJobOwner,
  withAds = false,
}) {
  const classes = useStyles();
  const { approvalStatus, deadline } = jobData.job;
  const expired = deadline
    ? isAfter(new Date(), endOfDay(new Date(deadline)))
    : false;
  const [
    { closeStatus, closeDialogOpen },
    setCloseDialogOpen,
    clearError,
    handleCloseJob,
  ] = useCloseJob(onJobClose);
  return (
    <Fragment>
      <Container className={classes.header} maxWidth="xl">
        {withAds && (
          <Box display="flex" justifyContent="center">
            <Hidden mdUp>
              <MobileHeaderAd />
            </Hidden>
            <Hidden smDown>
              <HeaderAd />
            </Hidden>
          </Box>
        )}
        {approvalStatus === "Closed" && (
          <Banner
            variant="error"
            message="This job has been closed by its owner."
          />
        )}
        {approvalStatus === "Pending" && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )}
        {approvalStatus === "Declined" && (
          <Banner
            variant="error"
            message="Administrator has declined to approve this post."
          />
        )}
        {expired &&
          !(approvalStatus === "Declined" || approvalStatus === "Closed") && (
            <Banner
              variant="warning"
              message="The application deadline for this job has passed"
            />
          )}
        {isJobOwner && approvalStatus === "Active" && (
          <Toolbar className={classes.toolbar}>
            <Box flex={1} />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={closeStatus === "closing" || closeStatus === "closed"}
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
        onConfirmation={handleCloseJob}
      />
      <HSSnackBar
        open={closeStatus === "errorClosing"}
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration={3000}
        onClose={clearError}
      />
    </Fragment>
  );
}
