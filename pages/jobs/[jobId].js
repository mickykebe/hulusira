import { Box, Typography, Container, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import api from "../../api";
import Layout from "../../components/layout";
import CompanyLogo from "../../components/company-logo";
import HSPaper from "../../components/hs-paper";
import Markdown from "../../components/markdown";

const useStyles = makeStyles(theme => ({
  jobInfo: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  jobMain: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  applyGrid: {
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%"
    }
  },
  apply: {
    padding: theme.spacing(2),
    overflowWrap: "break-word",
    wordWrap: "break-word",
    wordBreak: "break-all",
    wordBreak: "bread-word",
    hyphens: "auto"
  }
}));

function Job({ job: jobData }) {
  const classes = useStyles();
  const { job, company } = jobData;
  const renderJobInfoItem = (title, value) => {
    return (
      <Box pr={3}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    );
  };
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" pb={2}>
          {company && (
            <Box mr={2}>
              <CompanyLogo company={company} abbrevFallback={false} size="large" />
            </Box>
          )}
          <Box>
            <Typography variant="h4">{job.position}</Typography>
            {company && company.name && (
              <React.Fragment>
                <Typography variant="body1" component="span">
                  at&nbsp;
                </Typography>
                <Typography variant="subtitle2" component="span" gutterBottom>
                  {company.name}
                </Typography>
              </React.Fragment>
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={12} lg={9}>
            <HSPaper className={classes.jobInfo}>
              {job.location && renderJobInfoItem("Location", job.location)}
              {job.jobType && renderJobInfoItem("Job Type", job.jobType)}
              {job.monthlySalary &&
                renderJobInfoItem("Monthly Salary", job.monthlySalary)}
            </HSPaper>
            <HSPaper className={classes.jobMain}>
              <Typography variant="h5">Description</Typography>
              <Markdown>{job.description}</Markdown>
              {job.responsiblities && (
                <React.Fragment>
                  <Typography variant="h5">Responsiblities</Typography>
                  <Markdown>{job.responsiblities}</Markdown>
                </React.Fragment>
              )}
              {job.requirements && (
                <React.Fragment>
                  <Typography variant="h5">Requirements</Typography>
                  <Markdown>{job.requirements}</Markdown>
                </React.Fragment>
              )}
            </HSPaper>
          </Grid>
          <Grid item sm={12} lg={3} className={classes.applyGrid}>
            <HSPaper className={classes.apply}>
              <Button
                variant="contained"
                color="primary"
                href={job.applyUrl || `mailto:${job.applyEmail}`}
                target="_blank"
                fullWidth>
                Apply Now
              </Button>
              {job.howToApply && (
                <Box pt={2}>
                  <Typography variant="subtitle1">
                    Are you interested in this job?
                  </Typography>
                  <Markdown>{job.howToApply}</Markdown>
                </Box>
              )}
            </HSPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

Job.getInitialProps = async ({ query }) => {
  const { jobId } = query;
  const [primaryTags, job] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(jobId)
  ]);
  return { job, primaryTags };
};

export default Job;
