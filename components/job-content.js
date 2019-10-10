import { Box, Typography, Container, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CompanyLogo from "./company-logo";
import HSPaper from "./hs-paper";
import Markdown from "./markdown";
import format from "date-fns/format";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  jobGrid: {
    width: "100%"
  },
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
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%"
    },
    [theme.breakpoints.down("md")]: {
      marginTop: -1 * theme.spacing(2)
    }
  },
  apply: {
    padding: theme.spacing(2),
    overflowWrap: "break-word",
    wordWrap: "break-word",
    wordBreak: "break-all",
    wordBreak: "bread-word",
    hyphens: "auto"
  },
  jobInfoDeadline: {
    color: "red"
  }
}));

function JobInfoItem({ title, value, classes = {} }) {
  return (
    <Box pr={3}>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body1" className={classes.value}>
        {value}
      </Typography>
    </Box>
  );
}

export default function JobContent({ jobData }) {
  const classes = useStyles();
  const { job, company } = jobData;
  const renderApplyButton = job => {
    return (
      <Button
        variant="contained"
        color="primary"
        href={job.applyUrl || `mailto:${job.applyEmail}`}
        target="_blank"
        fullWidth>
        Apply Now
      </Button>
    );
  };
  return (
    <Container className={classes.root} maxWidth="lg">
      <Box display="flex" alignItems="center" pb={2}>
        {company && (
          <Box mr={2}>
            <CompanyLogo
              company={company}
              abbrevFallback={false}
              size="large"
            />
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
        <Grid className={classes.jobGrid} item sm={12} lg={9}>
          <HSPaper className={classes.jobInfo}>
            {job.location && (
              <JobInfoItem title="Location" value={job.location} />
            )}
            {job.jobType && (
              <JobInfoItem title="Job Type" value={job.jobType} />
            )}
            {job.salary && <JobInfoItem title="Salary" value={job.salary} />}
            {job.deadline && (
              <JobInfoItem
                title="Deadline"
                value={format(new Date(job.deadline), "MMM dd, yyyy")}
                classes={{ value: classes.jobInfoDeadline }}
              />
            )}
          </HSPaper>
          <HSPaper className={classes.jobMain}>
            <Typography variant="h5">Description</Typography>
            <Markdown>{job.description}</Markdown>
            {job.responsibilities && (
              <React.Fragment>
                <Typography variant="h5">Responsibilities</Typography>
                <Markdown>{job.responsibilities}</Markdown>
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
          {!job.howToApply && renderApplyButton(job)}
          {!!job.howToApply && (
            <HSPaper className={classes.apply}>
              {renderApplyButton(job)}
              {job.howToApply && (
                <Box pt={2}>
                  <Typography variant="subtitle1">
                    Are you interested in this job?
                  </Typography>
                  <Markdown>{job.howToApply}</Markdown>
                </Box>
              )}
            </HSPaper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
