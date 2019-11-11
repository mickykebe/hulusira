import api from "../../api";
import Layout from "../../components/layout";
import Router from "next/router";
import ***REMOVED***
  Container,
  Grid,
  Typography,
  makeStyles,
  Box
***REMOVED*** from "@material-ui/core";
import HSPaper from "../../components/hs-paper";
import CompanyLogo from "../../components/company-logo";
import JobItem from "../../components/job-item";
import HeaderAd from "../../components/header-ad";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingTop: theme.spacing(2)
  ***REMOVED***,
  companyCard: ***REMOVED***
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
    maxWidth: 200,
    margin: "0 auto"
  ***REMOVED***,
  companyName: ***REMOVED***
    textAlign: "center",
    marginTop: theme.spacing(1)
  ***REMOVED***,
  jobItem: ***REMOVED***
    marginBottom: theme.spacing(2)
  ***REMOVED***
***REMOVED***));

export default function CompanyJobs(***REMOVED*** user, company, jobs ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Container className=***REMOVED***classes.root***REMOVED*** maxWidth="lg">
        <HeaderAd />
        <Grid container spacing=***REMOVED***2***REMOVED***>
          <Grid item xs=***REMOVED***12***REMOVED*** sm=***REMOVED***3***REMOVED***>
            <HSPaper className=***REMOVED***classes.companyCard***REMOVED***>
              <CompanyLogo
                size="large"
                company=***REMOVED***company***REMOVED***
                abbrevFallback=***REMOVED***false***REMOVED***
              />
              <Typography variant="h6" className=***REMOVED***classes.companyName***REMOVED***>
                ***REMOVED***company.name***REMOVED***
              </Typography>
            </HSPaper>
          </Grid>
          <Grid item xs=***REMOVED***12***REMOVED*** sm=***REMOVED***9***REMOVED***>
            ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
              return (
                <JobItem
                  key=***REMOVED***job.id***REMOVED***
                  className=***REMOVED***classes.jobItem***REMOVED***
                  job=***REMOVED***job***REMOVED***
                  tags=***REMOVED***job.tags***REMOVED***
                  company=***REMOVED***company***REMOVED***
                  onTagClick=***REMOVED***tagId => Router.push(`/?tags=$***REMOVED***tagId***REMOVED***`)***REMOVED***
                />
              );
            ***REMOVED***)***REMOVED***
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
***REMOVED***

CompanyJobs.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** id ***REMOVED*** = ctx.query;

  const [company, jobs] = await Promise.all([
    api.getCompany(ctx, id),
    api.getCompanyJobs(id, ctx)
  ]);

  return ***REMOVED*** company, jobs ***REMOVED***;
***REMOVED***;
