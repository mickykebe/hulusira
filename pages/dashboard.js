import DashboardLayout from "../components/dashboard-layout";
import redirect from "../utils/redirect";

function Dashboard(***REMOVED*** user ***REMOVED***) ***REMOVED***
  return <DashboardLayout user=***REMOVED***user***REMOVED*** />;
***REMOVED***

Dashboard.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;

export default Dashboard;
