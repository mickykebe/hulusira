import ***REMOVED*** Fragment, useReducer ***REMOVED*** from "react";
import Router, ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import Link from "next/link";
import ***REMOVED***
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
  Toolbar,
  Button,
  makeStyles
***REMOVED*** from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import redirect from "../../utils/redirect";
import CompanyLogo from "../../components/company-logo";
import JobContent from "../../components/job-content";
import HSSnackbar from "../../components/hs-snackbar";
import DashboardLayout from "../../components/dashboard-layout";
import api from "../../api";
import NoData from "../../components/no-data";

const useStyles = makeStyles(theme => (***REMOVED***
  jobList: props => (***REMOVED***
    position: "fixed",
    top: 64,
    bottom: 0,
    display: props.activeJob ? "none" : "flex",
    flexDirection: "column",
    borderRight: `1px solid $***REMOVED***theme.palette.grey[200]***REMOVED***`,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: ***REMOVED***
      display: "flex",
      width: 300,
      flexShrink: 0
    ***REMOVED***
  ***REMOVED***),
  jobDisplay: props => (***REMOVED***
    marginLeft: props.jobs.length > 0 ? 300 : 0,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: ***REMOVED***
      display: "flex",
      margin: 0
    ***REMOVED***
  ***REMOVED***),
  actionButton: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

const jobReducer = (state, action) => ***REMOVED***
  switch (action.type) ***REMOVED***
    case "UPDATING_JOB": ***REMOVED***
      return ***REMOVED*** ...state, inProgress: true, error: false ***REMOVED***;
    ***REMOVED***
    case "UPDATED_JOB": ***REMOVED***
      return ***REMOVED***
        ...state,
        inProgress: false,
        error: false
      ***REMOVED***;
    ***REMOVED***
    case "ERROR_UPDATING_JOB": ***REMOVED***
      return ***REMOVED*** ...state, inProgress: false, error: true ***REMOVED***;
    ***REMOVED***
    case "CLEAR_ERROR": ***REMOVED***
      return ***REMOVED*** ...state, error: false ***REMOVED***;
    ***REMOVED***
    default:
      throw new Error("Unrecognized action type");
  ***REMOVED***
***REMOVED***;

export default function PendingJobs(***REMOVED*** user, jobs ***REMOVED***) ***REMOVED***
  const [jobUpdateState, dispatch] = useReducer(jobReducer, ***REMOVED***
    inProgress: false,
    error: false
  ***REMOVED***);
  let activeJobData;
  const router = useRouter();
  const ***REMOVED*** jobId ***REMOVED*** = router.query;
  const activeJobId = parseInt(jobId);
  if (!!activeJobId) ***REMOVED***
    activeJobData = jobs.find(jobData => jobData.job.id === activeJobId);
  ***REMOVED***
  const approveJob = async jobId => ***REMOVED***
    dispatch(***REMOVED*** type: "UPDATING_JOB" ***REMOVED***);
    try ***REMOVED***
      await api.approveJob(jobId);
      dispatch(***REMOVED*** type: "UPDATED_JOB" ***REMOVED***);
      Router.replace("/dashboard/pending-jobs");
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      dispatch(***REMOVED*** type: "ERROR_UPDATING_JOB" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  const declineJob = async jobId => ***REMOVED***
    dispatch(***REMOVED*** type: "UPDATING_JOB" ***REMOVED***);
    try ***REMOVED***
      await api.declineJob(jobId);
      dispatch(***REMOVED*** type: "UPDATED_JOB" ***REMOVED***);
      Router.replace("/dashboard/pending-jobs");
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      dispatch(***REMOVED*** type: "ERROR_UPDATING_JOB" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  const classes = useStyles(***REMOVED*** activeJob: !!activeJobData, jobs ***REMOVED***);
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="pendingJobs" pendingJobs=***REMOVED***jobs***REMOVED***>
      ***REMOVED***jobs.length > 0 && (
        <Box className=***REMOVED***classes.jobList***REMOVED***>
          <List className=***REMOVED***classes.list***REMOVED***>
            ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***, index) => (
              <Fragment key=***REMOVED***job.id***REMOVED***>
                <Link
                  href=***REMOVED***`/dashboard/pending-jobs?jobId=$***REMOVED***job.id***REMOVED***`***REMOVED***
                  as=***REMOVED***`/dashboard/pending-jobs/$***REMOVED***job.id***REMOVED***`***REMOVED***
                >
                  <ListItem button>
                    ***REMOVED***!!company && (
                      <ListItemAvatar>
                        <CompanyLogo company=***REMOVED***company***REMOVED*** size="small" />
                      </ListItemAvatar>
                    )***REMOVED***
                    <ListItemText
                      primary=***REMOVED***job.position***REMOVED***
                      primaryTypographyProps=***REMOVED******REMOVED*** variant: "subtitle2" ***REMOVED******REMOVED***
                      secondary=***REMOVED***!!company ? company.name : job.jobType***REMOVED***
                    />
                  </ListItem>
                </Link>
                ***REMOVED***index + 1 !== jobs.length && <Divider light />***REMOVED***
              </Fragment>
            ))***REMOVED***
          </List>
        </Box>
      )***REMOVED***
      ***REMOVED***jobs.length === 0 && <NoData message="There are no pending jobs" />***REMOVED***
      ***REMOVED***!!activeJobData && (
        <Box className=***REMOVED***classes.jobDisplay***REMOVED***>
          <Toolbar>
            <Box flexGrow=***REMOVED***1***REMOVED*** />
            <Button
              color="primary"
              variant="contained"
              className=***REMOVED***classes.actionButton***REMOVED***
              disabled=***REMOVED***jobUpdateState.inProgress***REMOVED***
              onClick=***REMOVED***() => approveJob(activeJobId)***REMOVED***
            >
              <DoneIcon /> Approve
            </Button>
            <Button
              color="secondary"
              variant="contained"
              className=***REMOVED***classes.actionButton***REMOVED***
              disabled=***REMOVED***jobUpdateState.inProgress***REMOVED***
              onClick=***REMOVED***() => declineJob(activeJobId)***REMOVED***
            >
              <ClearIcon /> Drop
            </Button>
          </Toolbar>
          <JobContent jobData=***REMOVED***activeJobData***REMOVED*** />
          <HSSnackbar
            variant="error"
            open=***REMOVED***jobUpdateState.error***REMOVED***
            message="Problem occurred updating job"
            autoHideDuration=***REMOVED***3000***REMOVED***
            onClose=***REMOVED***() => dispatch(***REMOVED*** type: "CLEAR_ERROR" ***REMOVED***)***REMOVED***
          />
        </Box>
      )***REMOVED***
    </DashboardLayout>
  );
***REMOVED***

PendingJobs.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user || user.role !== "admin") ***REMOVED***
    redirect(ctx, "/");
    return ***REMOVED******REMOVED***;
  ***REMOVED***

  let jobs = [];
  try ***REMOVED***
    jobs = await api.getPendingJobs(ctx);
  ***REMOVED*** catch (err) ***REMOVED***
    console.log(err);
  ***REMOVED***
  return ***REMOVED*** jobs ***REMOVED***;
***REMOVED***;