import DashboardLayout from "../../../components/dashboard-layout";
import ***REMOVED*** Container ***REMOVED*** from "@material-ui/core";
import redirect from "../../../utils/redirect";

export default function DashboardNewJob(***REMOVED*** user ***REMOVED***) ***REMOVED***
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md"></Container>
    </DashboardLayout>
  );
***REMOVED***

DashboardNewJob.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/new");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;
