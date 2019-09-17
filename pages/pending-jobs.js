import ***REMOVED*** Fragment ***REMOVED*** from "react";
import ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import Link from "next/link";
import ***REMOVED***
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
  Toolbar,
  Button
***REMOVED*** from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import nextCookie from "next-cookies";
import api from "../api";
import redirect from "../utils/redirect";
import Layout from "../components/layout";
import CompanyLogo from "../components/company-logo";
import JobContent from "../components/job-content";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";

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
  jobDisplay: props => ***REMOVED***
    return ***REMOVED***
      marginLeft: 300,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("sm")]: ***REMOVED***
        display: "flex",
        margin: 0
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***,
  actionButton: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

//add breakpoints
function PendingJobs(***REMOVED*** jobs ***REMOVED***) ***REMOVED***
  let activeJobData;
  const router = useRouter();
  const ***REMOVED*** jobId ***REMOVED*** = router.query;
  const activeJobId = parseInt(jobId);
  if (!!activeJobId) ***REMOVED***
    activeJobData = jobs.find(jobData => jobData.job.id === activeJobId);
  ***REMOVED***
  const classes = useStyles(***REMOVED*** activeJob: !!activeJobData ***REMOVED***);
  return (
    <Layout>
      <Box className=***REMOVED***classes.jobList***REMOVED***>
        <List className=***REMOVED***classes.list***REMOVED***>
          ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***, index) => (
            <Fragment key=***REMOVED***job.id***REMOVED***>
              <Link
                href=***REMOVED***`/pending-jobs?jobId=$***REMOVED***job.id***REMOVED***`***REMOVED***
                as=***REMOVED***`/pending-jobs/$***REMOVED***job.id***REMOVED***`***REMOVED***>
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
      ***REMOVED***!!activeJobData && (
        <Box className=***REMOVED***classes.jobDisplay***REMOVED***>
          <Toolbar>
            <Box flexGrow=***REMOVED***1***REMOVED*** />
            <Button
              color="primary"
              variant="contained"
              className=***REMOVED***classes.actionButton***REMOVED***>
              <DoneIcon /> Approve
            </Button>
            <Button
              color="secondary"
              variant="contained"
              className=***REMOVED***classes.actionButton***REMOVED***>
              <ClearIcon /> Drop
            </Button>
          </Toolbar>
          <JobContent jobData=***REMOVED***activeJobData***REMOVED*** />
        </Box>
      )***REMOVED***
    </Layout>
  );
***REMOVED***

PendingJobs.getInitialProps = async function(ctx) ***REMOVED***
  if (ctx.req) ***REMOVED***
    const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
    if (!sessionId) ***REMOVED***
      redirect(ctx, "/");
      return ***REMOVED******REMOVED***;
    ***REMOVED***
  ***REMOVED***

  let user;

  try ***REMOVED***
    user = await api.activeUser(ctx);
    if (user.role !== "admin") ***REMOVED***
      throw new Error("Not permitted");
    ***REMOVED***
  ***REMOVED*** catch (err) ***REMOVED***
    redirect(ctx, "/");
    return ***REMOVED******REMOVED***;
  ***REMOVED***

  const jobs = await api.getPendingJobs(ctx);

  return ***REMOVED*** user, jobs ***REMOVED***;
***REMOVED***;

export default PendingJobs;
