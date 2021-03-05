import api from "../../api";
import Layout from "../../components/layout";
import Router from "next/router";
import {
  Container,
  Typography,
  makeStyles,
  Box,
  Hidden,
} from "@material-ui/core";
import HSPaper from "../../components/hs-paper";
import CompanyLogo from "../../components/company-logo";
import JobItem from "../../components/job-item";
import HeaderAd from "../../components/header-ad";
import MobileHeaderAd from "../../components/mobile-header-ad";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  containerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gridGap: "1.5rem",
    alignItems: "start",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  companyCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
  },
  companyName: {
    textAlign: "center",
    marginTop: theme.spacing(1),
  },
  jobItem: {
    marginBottom: theme.spacing(2),
  },
}));

export default function CompanyJobs({ user, company, jobs }) {
  const classes = useStyles();
  return (
    <Layout user={user}>
      <Container className={classes.root} maxWidth="xl">
        <Box pb={2}>
          <Hidden mdUp>
            <MobileHeaderAd />
          </Hidden>
          <Hidden smDown>
            <HeaderAd />
          </Hidden>
        </Box>
        <Box className={classes.containerGrid}>
          <HSPaper className={classes.companyCard}>
            <CompanyLogo
              size="large"
              company={company}
              abbrevFallback={false}
            />
            <Typography variant="h6" className={classes.companyName}>
              {company.name}
            </Typography>
          </HSPaper>
          <Box>
            {jobs.map(({ job, company }) => {
              return (
                <JobItem
                  key={job.id}
                  className={classes.jobItem}
                  job={job}
                  tags={job.tags}
                  company={company}
                  onTagClick={(tagId) => Router.push(`/?tags=${tagId}`)}
                />
              );
            })}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

CompanyJobs.getInitialProps = async function(ctx) {
  const { id } = ctx.query;

  const [company, jobs] = await Promise.all([
    api.getCompany(ctx, id),
    api.getCompanyJobs(id, ctx),
  ]);

  return { company, jobs };
};
