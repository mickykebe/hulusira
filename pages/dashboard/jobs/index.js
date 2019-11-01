import DashboardLayout from "../../../components/dashboard-layout";
import Router from "next/router";
import ***REMOVED*** Container, Button, Box ***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import JobItem from "../../../components/job-item";

export default function DashboardJobs(***REMOVED*** user, jobs ***REMOVED***) ***REMOVED***
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="jobs">
      <Container maxWidth="md">
        <Box display="flex" py=***REMOVED***2***REMOVED***>
          <Box flex="1" />
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon=***REMOVED***<AddIcon />***REMOVED***
            onClick=***REMOVED***() => Router.push("/dashboard/jobs/new")***REMOVED***>
            Post Job
          </Button>
        </Box>
        ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
          return (
            <Box mb=***REMOVED***2***REMOVED*** key=***REMOVED***job.id***REMOVED***>
              <JobItem job=***REMOVED***job***REMOVED*** tags=***REMOVED***job.tags***REMOVED*** company=***REMOVED***company***REMOVED*** />
            </Box>
          );
        ***REMOVED***)***REMOVED***
      </Container>
    </DashboardLayout>
  );
***REMOVED***

DashboardJobs.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  const jobs = await api.getMyJobs(ctx);

  return ***REMOVED*** jobs ***REMOVED***;
***REMOVED***;
