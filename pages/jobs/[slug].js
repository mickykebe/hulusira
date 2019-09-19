import ***REMOVED*** useEffect, useState ***REMOVED*** from "react";
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

function Job(***REMOVED*** jobData ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [isJobAdmin, setIsJobAdmin] = useState(false);
  useEffect(() => ***REMOVED***
    const verifyToken = async (id, adminToken) => ***REMOVED***
      try ***REMOVED***
        await api.verifyJobToken(id, adminToken);
        setIsJobAdmin(true);
      ***REMOVED*** catch (err) ***REMOVED***
        setIsJobAdmin(false);
      ***REMOVED***
    ***REMOVED***;
    const ***REMOVED*** job ***REMOVED*** = jobData;
    const adminToken = getJobAdminToken(job.id);
    if (adminToken) ***REMOVED***
      verifyToken(job.id, adminToken);
    ***REMOVED***
  ***REMOVED***, [jobData, setIsJobAdmin]);
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
        ***REMOVED***isJobAdmin && (
          <Toolbar className=***REMOVED***classes.toolbar***REMOVED***>
            <Box flex=***REMOVED***1***REMOVED*** />
            <Button variant="contained" color="secondary" size="small">
              <CloseIcon className=***REMOVED***classes.closeIcon***REMOVED*** /> Close Job
            </Button>
          </Toolbar>
        )***REMOVED***
      </Container>
      <JobContent jobData=***REMOVED***jobData***REMOVED*** />
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
