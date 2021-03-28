import Link from "next/link";
import Router from "next/router";
import {
  Box,
  Typography,
  Grid,
  Button,
  Link as MuiLink,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CompanyLogo from "./company-logo";
import HSPaper from "./hs-paper";
import Markdown from "./markdown";
import format from "date-fns/format";
import { Fragment } from "react";
import InArticleAd from "./in-article-ad";
import * as gtag from "../lib/gtag";
import { careerLevelLabel } from "../utils/index";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    "@media (min-width: 960px)": {
      maxWidth: 960,
      marginLeft: "auto",
      marginRight: "auto",
    },
    "@media (min-width: 1280px)": {
      maxWidth: 1280,
    },
  },
  jobGrid: {
    width: "100%",
  },
  jobInfo: {
    display: "grid",
    gridGap: theme.spacing(2),
    gridTemplateColumns: "1fr",
    "@media (min-width: 600px)": {
      gridAutoFlow: "column",
      gridAutoColumns: "1fr",
    },
    /* display: "flex",
    flexWrap: "wrap", */
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  jobMain: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  applyGrid: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
    [theme.breakpoints.down("md")]: {
      marginTop: -1 * theme.spacing(2),
    },
  },
  apply: {
    padding: theme.spacing(3),
    overflowWrap: "break-word",
    wordWrap: "break-word",
    wordBreak: "break-all",
    wordBreak: "bread-word",
    hyphens: "auto",
  },
  jobInfoDeadline: {
    color: "red",
  },
}));

function JobInfoItem({ title, value }) {
  return (
    <Box>
      <Typography variant="subtitle1" align="center">
        {title}
      </Typography>
      <Typography variant="body1" align="center">
        {value}
      </Typography>
    </Box>
  );
}

function ApplyButton({ job }) {
  return (
    <Button
      size="large"
      variant="contained"
      color="primary"
      href={job.applyUrl || `mailto:${job.applyEmail}`}
      target="_blank"
      fullWidth
      onClick={() => {
        gtag.event({
          action: "Click Apply Now",
          category: "Job",
          label: job.slug,
        });
      }}>
      Apply Now
    </Button>
  );
}

export default function JobContent({ jobData, withAds = false }) {
  const classes = useStyles();
  const { job, company } = jobData;
  const hasApplyButton = !!job.applyUrl || !!job.applyEmail;
  const hasApplySection =
    job.approvalStatus !== "Closed" && (!!job.howToApply || hasApplyButton);
  return (
    <Box p={3} className={classes.root}>
      <Box display="flex" alignItems="center" pb={2}>
        {company && company.logo && (
          <Box mr={1}>
            <CompanyLogo
              company={company}
              abbrevFallback={false}
              size="medium"
              onClick={() => Router.push(`/companies/${company.id}`)}
            />
          </Box>
        )}
        <Box ml={1}>
          <Typography variant="h5">{job.position}</Typography>
          {company && company.name && (
            <Fragment>
              <Typography variant="body1" component="span">
                at&nbsp;
              </Typography>
              <Link
                href="/companies/[id]"
                as={`/companies/${company.id}`}
                passHref>
                <MuiLink variant="subtitle2" color="inherit" gutterBottom>
                  {company.name}
                </MuiLink>
              </Link>
            </Fragment>
          )}
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid
          className={classes.jobGrid}
          item
          xs={12}
          lg={hasApplySection ? 8 : 12}>
          <HSPaper className={classes.jobInfo}>
            {job.location && (
              <JobInfoItem title="📍 Location" value={job.location} />
            )}
            {job.jobType && (
              <JobInfoItem title="🕔 Job Type" value={job.jobType} />
            )}
            {job.careerLevel && (
              <JobInfoItem
                title="📈 Career Level"
                value={careerLevelLabel(job.careerLevel)}
              />
            )}
            {job.salary && <JobInfoItem title="💰 Salary" value={job.salary} />}
            {job.deadline && (
              <JobInfoItem
                title="⏳ Deadline"
                value={format(new Date(job.deadline), "MMM dd, yyyy")}
              />
            )}
          </HSPaper>
          <HSPaper className={classes.jobMain}>
            <Typography variant="h5">Description</Typography>
            <Markdown>{job.description}</Markdown>
            {process.env.NODE_ENV === "production" && withAds && (
              <InArticleAd />
            )}
            {job.responsibilities && (
              <Fragment>
                <Typography variant="h5">Responsibilities</Typography>
                <Markdown>{job.responsibilities}</Markdown>
              </Fragment>
            )}
            {job.requirements && (
              <Fragment>
                <Typography variant="h5">Requirements</Typography>
                <Markdown>{job.requirements}</Markdown>
              </Fragment>
            )}
          </HSPaper>
        </Grid>
        {hasApplySection && (
          <Grid item xs={12} lg={4} className={classes.applyGrid}>
            {!job.howToApply && hasApplyButton && <ApplyButton job={job} />}
            {!!job.howToApply && (
              <HSPaper className={classes.apply}>
                {(job.applyUrl || job.applyEmail) && <ApplyButton job={job} />}
                {job.howToApply && (
                  <Box>
                    {!hasApplyButton && (
                      <Typography variant="subtitle1">
                        Are you interested in this job?
                      </Typography>
                    )}
                    <Markdown>{job.howToApply}</Markdown>
                  </Box>
                )}
              </HSPaper>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
