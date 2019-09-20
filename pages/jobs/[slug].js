import ***REMOVED*** useEffect, useState, useReducer ***REMOVED*** from "react";
import Router from "next/router";
import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";
import ***REMOVED*** getJobAdminToken ***REMOVED*** from "../../utils/localStorage";
import ***REMOVED***
  Toolbar,
  Button,
  Box,
  Container,
  Typography,
  Paper
***REMOVED*** from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import InfoIcon from "@material-ui/icons/Info";
import HSSnackbar from "../../components/hs-snackbar";

const useStyles = makeStyles(theme => (***REMOVED***
  toolbar: ***REMOVED***
    padding: 0
  ***REMOVED***,
  banner: ***REMOVED***
    backgroundColor: theme.palette.secondary.main,
    padding: `$***REMOVED***theme.spacing(1)***REMOVED***px $***REMOVED***theme.spacing(2)***REMOVED***px`,
    color: "white",
    marginTop: theme.spacing(2)
  ***REMOVED***,
  bannerText: ***REMOVED***
    display: "flex",
    alignItems: "center"
  ***REMOVED***,
  infoIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***,
  closeIcon: ***REMOVED***
    fontSize: 18,
    marginRight: theme.spacing(0.5)
  ***REMOVED***
***REMOVED***));

function jobCloseReducer(state, action) ***REMOVED***
  switch (action.type) ***REMOVED***
    case "CLOSING_JOB":
      return ***REMOVED*** ...state, isClosingJob: true, errorClosingJob: false ***REMOVED***;
    case "CLOSED_JOB":
      return ***REMOVED*** ...state, isClosingJob: false, errorClosingJob: false ***REMOVED***;
    case "ERROR_CLOSING_JOB":
      return ***REMOVED*** ...state, isClosingJob: false, errorClosingJob: true ***REMOVED***;
    case "CLEAR_ERROR":
      return ***REMOVED*** ...state, errorClosingJob: false ***REMOVED***;
    default:
      throw new Error("Unidentified action type");
  ***REMOVED***
***REMOVED***

function Job(***REMOVED*** jobData ***REMOVED***) ***REMOVED***
  const [***REMOVED*** isClosingJob, errorClosingJob ***REMOVED***, dispatch] = useReducer(
    jobCloseReducer,
    ***REMOVED*** isClosingJob: false, errorClosingJob: false ***REMOVED***
  );
  const classes = useStyles();
  const [adminToken, setAdminToken] = useState(null);
  useEffect(() => ***REMOVED***
    const verifyToken = async (id, adminToken) => ***REMOVED***
      try ***REMOVED***
        await api.verifyJobToken(id, adminToken);
        setAdminToken(adminToken);
      ***REMOVED*** catch (err) ***REMOVED***
        setAdminToken(null);
      ***REMOVED***
    ***REMOVED***;
    const ***REMOVED*** job ***REMOVED*** = jobData;
    const adminToken = getJobAdminToken(job.id);
    if (adminToken) ***REMOVED***
      verifyToken(job.id, adminToken);
    ***REMOVED***
  ***REMOVED***, [jobData, setAdminToken]);
  const handleCloseJob = async () => ***REMOVED***
    dispatch(***REMOVED*** type: "CLOSING_JOB" ***REMOVED***);
    try ***REMOVED***
      await api.closeJob(jobData.job.id, adminToken);
      Router.push("/");
      dispatch(***REMOVED*** type: "CLOSED_JOB" ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      dispatch(***REMOVED*** type: "ERROR_CLOSING_JOB" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  return (
    <Layout>
      <Container>
        ***REMOVED***jobData.job.approved === false && (
          <Paper className=***REMOVED***classes.banner***REMOVED***>
            <Typography
              className=***REMOVED***classes.bannerText***REMOVED***
              variant="subtitle1"
              color="inherit">
              <InfoIcon className=***REMOVED***classes.infoIcon***REMOVED*** /> This job is pending. It
              will be live once it gets admin approval.
            </Typography>
          </Paper>
        )***REMOVED***
        ***REMOVED***!!adminToken && !jobData.job.closed && (
          <Toolbar className=***REMOVED***classes.toolbar***REMOVED***>
            <Box flex=***REMOVED***1***REMOVED*** />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled=***REMOVED***isClosingJob***REMOVED***
              onClick=***REMOVED***handleCloseJob***REMOVED***>
              <CloseIcon className=***REMOVED***classes.closeIcon***REMOVED*** /> Close Job
            </Button>
          </Toolbar>
        )***REMOVED***
      </Container>
      <JobContent jobData=***REMOVED***jobData***REMOVED*** />
      <HSSnackbar
        open=***REMOVED***errorClosingJob***REMOVED***
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***() => dispatch("CLEAR_ERROR")***REMOVED***
      />
    </Layout>
  );
***REMOVED***

Job.getInitialProps = async (***REMOVED*** query ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** slug ***REMOVED*** = query;
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(slug)
  ]);
  return ***REMOVED*** jobData, primaryTags ***REMOVED***;
***REMOVED***;

export default Job;
