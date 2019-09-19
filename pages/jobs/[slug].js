import { useEffect, useState } from "react";
import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";
import { getJobAdminToken } from "../../utils/localStorage";
import {
  Toolbar,
  Button,
  Box,
  Container,
  Typography,
  Paper
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles(theme => ({
  toolbar: {
    padding: 0
  },
  banner: {
    backgroundColor: theme.palette.secondary.main,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "white",
    marginTop: theme.spacing(2)
  },
  bannerText: {
    display: "flex",
    alignItems: "center"
  },
  infoIcon: {
    marginRight: theme.spacing(1)
  },
  closeIcon: {
    fontSize: 18,
    marginRight: theme.spacing(0.5)
  }
}));

function Job({ jobData }) {
  const classes = useStyles();
  const [isJobAdmin, setIsJobAdmin] = useState(false);
  useEffect(() => {
    const verifyToken = async (id, adminToken) => {
      try {
        await api.verifyJobToken(id, adminToken);
        setIsJobAdmin(true);
      } catch (err) {
        setIsJobAdmin(false);
      }
    };
    const { job } = jobData;
    const adminToken = getJobAdminToken(job.id);
    if (adminToken) {
      verifyToken(job.id, adminToken);
    }
  }, [jobData, setIsJobAdmin]);
  return (
    <Layout>
      <Container>
        {jobData.job.approved === false && (
          <Paper className={classes.banner}>
            <Typography
              className={classes.bannerText}
              variant="subtitle1"
              color="inherit">
              <InfoIcon className={classes.infoIcon} /> This job is pending. It
              will be live once it gets admin approval.
            </Typography>
          </Paper>
        )}
        {isJobAdmin && (
          <Toolbar className={classes.toolbar}>
            <Box flex={1} />
            <Button variant="contained" color="secondary" size="small">
              <CloseIcon className={classes.closeIcon} /> Close Job
            </Button>
          </Toolbar>
        )}
      </Container>
      <JobContent jobData={jobData} />
    </Layout>
  );
}

Job.getInitialProps = async ({ query }) => {
  const { slug } = query;
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(slug)
  ]);
  return { jobData, primaryTags };
};

export default Job;
