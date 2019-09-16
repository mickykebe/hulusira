import nextCookie from "next-cookies";
import api from "../api";
import redirect from "../utils/redirect";
import Layout from "../components/layout";
import PendingJobList from "../components/pending-job-list";

function PendingJobs(***REMOVED*** user, jobs ***REMOVED***) ***REMOVED***
  return (
    <Layout>
      <PendingJobList jobs=***REMOVED***jobs***REMOVED*** />
    </Layout>
  );
***REMOVED***

PendingJobs.getInitialProps = async function(ctx) ***REMOVED***
  if (ctx.req) ***REMOVED***
    const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
    if (!sessionId) ***REMOVED***
      redirect(ctx, "/");
      return ***REMOVED******REMOVED***;
    ***REMOVED***
  ***REMOVED***

  let user;

  try ***REMOVED***
    user = await api.activeUser(ctx);
    if (user.role !== "admin") ***REMOVED***
      throw new Error("Not permitted");
    ***REMOVED***
  ***REMOVED*** catch (err) ***REMOVED***
    redirect(ctx, "/");
    return ***REMOVED******REMOVED***;
  ***REMOVED***

  const jobs = await api.getPendingJobs(ctx);

  return ***REMOVED*** user, jobs ***REMOVED***;
***REMOVED***;

export default PendingJobs;
