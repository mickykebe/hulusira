import ***REMOVED*** Box, Typography, Container, Grid, Button ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import CompanyLogo from "./company-logo";
import HSPaper from "./hs-paper";
import Markdown from "./markdown";
import format from "date-fns/format";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingTop: theme.spacing(2)
  ***REMOVED***,
  jobGrid: ***REMOVED***
    width: "100%"
  ***REMOVED***,
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
    width: "100%",
    [theme.breakpoints.down("xs")]: ***REMOVED***
      maxWidth: "100%"
    ***REMOVED***,
    [theme.breakpoints.down("md")]: ***REMOVED***
      marginTop: -1 * theme.spacing(2)
    ***REMOVED***
  ***REMOVED***,
  apply: ***REMOVED***
    padding: theme.spacing(2),
    overflowWrap: "break-word",
    wordWrap: "break-word",
    wordBreak: "break-all",
    wordBreak: "bread-word",
    hyphens: "auto"
  ***REMOVED***,
  jobInfoDeadline: ***REMOVED***
    color: "red"
  ***REMOVED***
***REMOVED***));

function JobInfoItem(***REMOVED*** title, value, classes = ***REMOVED******REMOVED*** ***REMOVED***) ***REMOVED***
  return (
    <Box pr=***REMOVED***3***REMOVED***>
      <Typography variant="subtitle1">***REMOVED***title***REMOVED***</Typography>
      <Typography variant="body1" className=***REMOVED***classes.value***REMOVED***>
        ***REMOVED***value***REMOVED***
      </Typography>
    </Box>
  );
***REMOVED***

function ApplyButton(***REMOVED*** job ***REMOVED***) ***REMOVED***
  return (
    <Button
      variant="contained"
      color="primary"
      href=***REMOVED***job.applyUrl || `mailto:$***REMOVED***job.applyEmail***REMOVED***`***REMOVED***
      target="_blank"
      fullWidth>
      Apply Now
    </Button>
  );
***REMOVED***

export default function JobContent(***REMOVED*** jobData ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const ***REMOVED*** job, company ***REMOVED*** = jobData;
  const hasApplyButton = !!job.applyUrl || !!job.applyEmail;
  const hasApplySection = !!job.howToApply || hasApplyButton;
  return (
    <Container className=***REMOVED***classes.root***REMOVED*** maxWidth="lg">
      <Box display="flex" alignItems="center" pb=***REMOVED***2***REMOVED***>
        ***REMOVED***company && (
          <Box mr=***REMOVED***2***REMOVED***>
            <CompanyLogo
              company=***REMOVED***company***REMOVED***
              abbrevFallback=***REMOVED***false***REMOVED***
              size="large"
            />
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
        <Grid
          className=***REMOVED***classes.jobGrid***REMOVED***
          item
          sm=***REMOVED***12***REMOVED***
          lg=***REMOVED***hasApplySection ? 9 : 12***REMOVED***>
          <HSPaper className=***REMOVED***classes.jobInfo***REMOVED***>
            ***REMOVED***job.location && (
              <JobInfoItem title="Location" value=***REMOVED***job.location***REMOVED*** />
            )***REMOVED***
            ***REMOVED***job.jobType && (
              <JobInfoItem title="Job Type" value=***REMOVED***job.jobType***REMOVED*** />
            )***REMOVED***
            ***REMOVED***job.salary && <JobInfoItem title="Salary" value=***REMOVED***job.salary***REMOVED*** />***REMOVED***
            ***REMOVED***job.deadline && (
              <JobInfoItem
                title="Deadline"
                value=***REMOVED***format(new Date(job.deadline), "MMM dd, yyyy")***REMOVED***
                classes=***REMOVED******REMOVED*** value: classes.jobInfoDeadline ***REMOVED******REMOVED***
              />
            )***REMOVED***
          </HSPaper>
          <HSPaper className=***REMOVED***classes.jobMain***REMOVED***>
            <Typography variant="h5">Description</Typography>
            <Markdown>***REMOVED***job.description***REMOVED***</Markdown>
            ***REMOVED***job.responsibilities && (
              <React.Fragment>
                <Typography variant="h5">Responsibilities</Typography>
                <Markdown>***REMOVED***job.responsibilities***REMOVED***</Markdown>
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
        ***REMOVED***hasApplySection && (
          <Grid item sm=***REMOVED***12***REMOVED*** lg=***REMOVED***3***REMOVED*** className=***REMOVED***classes.applyGrid***REMOVED***>
            ***REMOVED***!job.howToApply && hasApplyButton && <ApplyButton job=***REMOVED***job***REMOVED*** />***REMOVED***
            ***REMOVED***!!job.howToApply && (
              <HSPaper className=***REMOVED***classes.apply***REMOVED***>
                ***REMOVED***(job.applyUrl || job.applyEmail) && <ApplyButton job=***REMOVED***job***REMOVED*** />***REMOVED***
                ***REMOVED***job.howToApply && (
                  <Box pt=***REMOVED***hasApplyButton ? 2 : 0***REMOVED***>
                    <Typography variant="subtitle1">
                      Are you interested in this job?
                    </Typography>
                    <Markdown>***REMOVED***job.howToApply***REMOVED***</Markdown>
                  </Box>
                )***REMOVED***
              </HSPaper>
            )***REMOVED***
          </Grid>
        )***REMOVED***
      </Grid>
    </Container>
  );
***REMOVED***
