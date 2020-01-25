import ***REMOVED*** Container, Toolbar, Box, Button, makeStyles ***REMOVED*** from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ***REMOVED*** Fragment, useState, useReducer ***REMOVED*** from "react";
import isAfter from "date-fns/isAfter";
import endOfDay from "date-fns/endOfDay";
import Banner from "./banner";
import JobContent from "./job-content";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";
import HeaderAd from "./header-ad";
import jobCloseReducer from "../reducers/close-job";
import useCloseJob from "../hooks/use-close-job";

const useStyles = makeStyles(theme => (***REMOVED***
  header: ***REMOVED***
    paddingTop: theme.spacing(2)
  ***REMOVED***,
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
  onJobClose,
  isJobOwner,
  withAds = false
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const ***REMOVED*** approvalStatus, deadline ***REMOVED*** = jobData.job;
  const expired = deadline
    ? isAfter(new Date(), endOfDay(new Date(deadline)))
    : false;
  const [
    ***REMOVED*** closeStatus, closeDialogOpen ***REMOVED***,
    setCloseDialogOpen,
    clearError,
    handleCloseJob
  ] = useCloseJob(onJobClose);
  return (
    <Fragment>
      <Container className=***REMOVED***classes.header***REMOVED*** maxWidth="xl">
        ***REMOVED***withAds && <HeaderAd />***REMOVED***
        ***REMOVED***approvalStatus === "Closed" && (
          <Banner
            variant="error"
            message="This job has been closed by its owner."
          />
        )***REMOVED***
        ***REMOVED***approvalStatus === "Pending" && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )***REMOVED***
        ***REMOVED***approvalStatus === "Declined" && (
          <Banner
            variant="error"
            message="Administrator has declined to approve this post."
          />
        )***REMOVED***
        ***REMOVED***expired &&
          !(approvalStatus === "Declined" || approvalStatus === "Closed") && (
            <Banner
              variant="warning"
              message="The application deadline for this job has passed"
            />
          )***REMOVED***
        ***REMOVED***isJobOwner && approvalStatus === "Active" && (
          <Toolbar className=***REMOVED***classes.toolbar***REMOVED***>
            <Box flex=***REMOVED***1***REMOVED*** />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled=***REMOVED***closeStatus === "closing" || closeStatus === "closed"***REMOVED***
              onClick=***REMOVED***() => setCloseDialogOpen(true)***REMOVED***
            >
              <CloseIcon className=***REMOVED***classes.closeIcon***REMOVED*** /> Close Job
            </Button>
          </Toolbar>
        )***REMOVED***
      </Container>
      <JobContent withAds=***REMOVED***withAds***REMOVED*** jobData=***REMOVED***jobData***REMOVED*** />
      <JobCloseDialog
        open=***REMOVED***closeDialogOpen***REMOVED***
        onClose=***REMOVED***() => setCloseDialogOpen(false)***REMOVED***
        onConfirmation=***REMOVED***handleCloseJob***REMOVED***
      />
      <HSSnackBar
        open=***REMOVED***closeStatus === "errorClosing"***REMOVED***
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***clearError***REMOVED***
      />
    </Fragment>
  );
***REMOVED***
