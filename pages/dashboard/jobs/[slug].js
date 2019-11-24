import api from "../../../api";
import DashboardLayout from "../../../components/dashboard-layout";
import JobContentManage from "../../../components/job-content-manage";
import redirect from "../../../utils/redirect";
import Router from "next/router";

export default function DashboardJob(***REMOVED*** user, jobData ***REMOVED***) ***REMOVED***
  const closeJob = async () => ***REMOVED***
    await api.closeJob(jobData.job.id);
    Router.push("/dashboard/jobs");
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <JobContentManage
        isJobOwner=***REMOVED***true***REMOVED***
        jobData=***REMOVED***jobData***REMOVED***
        onJobClose=***REMOVED***closeJob***REMOVED***
      />
    </DashboardLayout>
  );
***REMOVED***

DashboardJob.getInitialProps = async ctx => ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  const ***REMOVED*** slug ***REMOVED*** = ctx.query;
  const jobData = await api.getJob(ctx, slug);

  if (jobData.job.owner !== user.id) ***REMOVED***
    redirect(ctx, "/dashboard/jobs");
  ***REMOVED***

  return ***REMOVED*** jobData ***REMOVED***;
***REMOVED***;
