import DashboardLayout from "../../../components/dashboard-layout";
import ***REMOVED*** Container, makeStyles ***REMOVED*** from "@material-ui/core";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import Router from "next/router";
import ***REMOVED*** cleanTags ***REMOVED*** from "../../../utils";
import JobForm from "../../../components/job-form";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingBottom: theme.spacing(2)
  ***REMOVED***,
  form: ***REMOVED***
    display: "flex",
    flexDirection: "column"
  ***REMOVED***,
  jobSetting: ***REMOVED***
    marginBottom: theme.spacing(3)
  ***REMOVED***,
  companyPanel: ***REMOVED***
    marginBottom: theme.spacing(3)
  ***REMOVED***,
  orText: ***REMOVED***
    marginBottom: theme.spacing(1)
  ***REMOVED***,
  postButton: ***REMOVED***
    marginTop: theme.spacing(1)
  ***REMOVED***,
  saveButtonIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***,
  jobPreview: ***REMOVED***
    marginTop: theme.spacing(3)
  ***REMOVED***
***REMOVED***));

export default function DashboardNewJob(***REMOVED*** user, companies, primaryTags ***REMOVED***) ***REMOVED***
  const handleSubmit = async function(values) ***REMOVED***
    const tags = cleanTags(values.tags);
    const primaryTagId =
      values.primaryTagId !== "" ? values.primaryTagId : null;
    await api.createJob(***REMOVED***
      ...values,
      tags,
      primaryTagId
    ***REMOVED***);
    Router.push("/dashboard/jobs");
  ***REMOVED***;
  const classes = useStyles();
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md" className=***REMOVED***classes.root***REMOVED***>
        <JobForm
          companies=***REMOVED***companies***REMOVED***
          primaryTags=***REMOVED***primaryTags***REMOVED***
          onSubmit=***REMOVED***handleSubmit***REMOVED***
        />
      </Container>
    </DashboardLayout>
  );
***REMOVED***

DashboardNewJob.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/new");
  ***REMOVED***

  const [companies, primaryTags] = await Promise.all([
    api.getCompanies(ctx),
    api.getPrimaryTags(ctx)
  ]);
  return ***REMOVED*** companies, primaryTags ***REMOVED***;
***REMOVED***;
