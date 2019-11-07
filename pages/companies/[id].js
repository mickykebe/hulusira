import api from "../../api";
import Layout from "../../components/layout";
import Router from "next/router";
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import HSPaper from "../../components/hs-paper";
import CompanyLogo from "../../components/company-logo";
import JobItem from "../../components/job-item";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  companyCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
    maxWidth: 200,
    margin: "0 auto"
  },
  companyName: {
    textAlign: "center",
    marginTop: theme.spacing(1)
  },
  jobItem: {
    marginBottom: theme.spacing(2)
  }
}));

export default function CompanyJobs({ user, company, jobs }) {
  const classes = useStyles();
  return (
    <Layout user={user}>
      <Container className={classes.root} maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
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
          </Grid>
          <Grid item xs={12} sm={9}>
            {jobs.map(({ job, company }) => {
              return (
                <JobItem
                  key={job.id}
                  className={classes.jobItem}
                  job={job}
                  tags={job.tags}
                  company={company}
                  onTagClick={tagId => Router.push(`/?tags=${tagId}`)}
                />
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

CompanyJobs.getInitialProps = async function(ctx) {
  const { id } = ctx.query;

  const [company, jobs] = await Promise.all([
    api.getCompany(ctx, id),
    api.getCompanyJobs(id, ctx)
  ]);

  return { company, jobs };
};
