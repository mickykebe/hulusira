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
import ***REMOVED*** Fragment ***REMOVED*** from "react";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingTop: theme.spacing(2)
  ***REMOVED***,
  containerGrid: ***REMOVED***
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gridGap: "1.5rem",
    alignItems: "start",
    [theme.breakpoints.down("sm")]: ***REMOVED***
      gridTemplateColumns: "1fr"
    ***REMOVED***
  ***REMOVED***,
  headerAd: ***REMOVED***
    marginBottom: theme.spacing(2)
  ***REMOVED***,
  companyCard: ***REMOVED***
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3)
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
      <Container className=***REMOVED***classes.root***REMOVED*** maxWidth="xl">
        <HeaderAd className=***REMOVED***classes.headerAd***REMOVED*** />
        <Box className=***REMOVED***classes.containerGrid***REMOVED***>
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
          <Box>
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
          </Box>
        </Box>
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
