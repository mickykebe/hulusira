import ***REMOVED*** Box, Typography, Container, Grid, Button ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import api from "../../api";
import Layout from "../../components/layout";
import CompanyLogo from "../../components/company-logo";
import HSPaper from "../../components/hs-paper";
import Markdown from "../../components/markdown";

const useStyles = makeStyles(theme => (***REMOVED***
  jobInfo: ***REMOVED***
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  ***REMOVED***,
  jobMain: ***REMOVED***
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  ***REMOVED***,
  applyGrid: ***REMOVED***
    [theme.breakpoints.down("xs")]: ***REMOVED***
      maxWidth: "100%"
    ***REMOVED***
  ***REMOVED***,
  apply: ***REMOVED***
    padding: theme.spacing(2),
    overflowWrap: "break-word",
    wordWrap: "break-word",
    wordBreak: "break-all",
    wordBreak: "bread-word",
    hyphens: "auto"
  ***REMOVED***
***REMOVED***));

function Job(***REMOVED*** job: jobData ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const ***REMOVED*** job, company ***REMOVED*** = jobData;
  const renderJobInfoItem = (title, value) => ***REMOVED***
    return (
      <Box pr=***REMOVED***3***REMOVED***>
        <Typography variant="subtitle1">***REMOVED***title***REMOVED***</Typography>
        <Typography variant="body1">***REMOVED***value***REMOVED***</Typography>
      </Box>
    );
  ***REMOVED***;
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" pb=***REMOVED***2***REMOVED***>
          ***REMOVED***company && (
            <Box mr=***REMOVED***2***REMOVED***>
              <CompanyLogo company=***REMOVED***company***REMOVED*** abbrevFallback=***REMOVED***false***REMOVED*** size="large" />
            </Box>
          )***REMOVED***
          <Box>
            <Typography variant="h4">***REMOVED***job.position***REMOVED***</Typography>
            ***REMOVED***company && company.name && (
              <React.Fragment>
                <Typography variant="body1" component="span">
                  at&nbsp;
                </Typography>
                <Typography variant="subtitle2" component="span" gutterBottom>
                  ***REMOVED***company.name***REMOVED***
                </Typography>
              </React.Fragment>
            )***REMOVED***
          </Box>
        </Box>
        <Grid container spacing=***REMOVED***2***REMOVED***>
          <Grid item sm=***REMOVED***12***REMOVED*** lg=***REMOVED***9***REMOVED***>
            <HSPaper className=***REMOVED***classes.jobInfo***REMOVED***>
              ***REMOVED***job.location && renderJobInfoItem("Location", job.location)***REMOVED***
              ***REMOVED***job.jobType && renderJobInfoItem("Job Type", job.jobType)***REMOVED***
              ***REMOVED***job.monthlySalary &&
                renderJobInfoItem("Monthly Salary", job.monthlySalary)***REMOVED***
            </HSPaper>
            <HSPaper className=***REMOVED***classes.jobMain***REMOVED***>
              <Typography variant="h5">Description</Typography>
              <Markdown>***REMOVED***job.description***REMOVED***</Markdown>
              ***REMOVED***job.responsiblities && (
                <React.Fragment>
                  <Typography variant="h5">Responsiblities</Typography>
                  <Markdown>***REMOVED***job.responsiblities***REMOVED***</Markdown>
                </React.Fragment>
              )***REMOVED***
              ***REMOVED***job.requirements && (
                <React.Fragment>
                  <Typography variant="h5">Requirements</Typography>
                  <Markdown>***REMOVED***job.requirements***REMOVED***</Markdown>
                </React.Fragment>
              )***REMOVED***
            </HSPaper>
          </Grid>
          <Grid item sm=***REMOVED***12***REMOVED*** lg=***REMOVED***3***REMOVED*** className=***REMOVED***classes.applyGrid***REMOVED***>
            <HSPaper className=***REMOVED***classes.apply***REMOVED***>
              <Button
                variant="contained"
                color="primary"
                href=***REMOVED***job.applyUrl || `mailto:$***REMOVED***job.applyEmail***REMOVED***`***REMOVED***
                target="_blank"
                fullWidth>
                Apply Now
              </Button>
              ***REMOVED***job.howToApply && (
                <Box pt=***REMOVED***2***REMOVED***>
                  <Typography variant="subtitle1">
                    Are you interested in this job?
                  </Typography>
                  <Markdown>***REMOVED***job.howToApply***REMOVED***</Markdown>
                </Box>
              )***REMOVED***
            </HSPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
***REMOVED***

Job.getInitialProps = async (***REMOVED*** query ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** jobId ***REMOVED*** = query;
  const [primaryTags, job] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(jobId)
  ]);
  return ***REMOVED*** job, primaryTags ***REMOVED***;
***REMOVED***;

export default Job;
