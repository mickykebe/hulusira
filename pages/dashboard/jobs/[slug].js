import api from "../../../api";
import DashboardLayout from "../../../components/dashboard-layout";
import JobContentManage from "../../../components/job-content-manage";
import redirect from "../../../utils/redirect";
import jobCloseReducer from "../../../reducers/close-job";
import ***REMOVED*** useState, useReducer ***REMOVED*** from "react";
import Router from "next/router";

export default function DashboardJob(***REMOVED*** user, jobData ***REMOVED***) ***REMOVED***
  const [***REMOVED*** isClosingJob, errorClosingJob ***REMOVED***, dispatch] = useReducer(
    jobCloseReducer,
    ***REMOVED*** isClosingJob: false, errorClosingJob: false ***REMOVED***
  );
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const handleCloseJob = async () => ***REMOVED***
    dispatch(***REMOVED*** type: "CLOSING_JOB" ***REMOVED***);
    try ***REMOVED***
      await api.closeJob(jobData.job.id);
      Router.push("/dashboard/jobs");
      dispatch(***REMOVED*** type: "CLOSED_JOB" ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      dispatch(***REMOVED*** type: "ERROR_CLOSING_JOB" ***REMOVED***);
    ***REMOVED***
    setCloseDialogOpen(false);
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <JobContentManage
        isJobOwner=***REMOVED***true***REMOVED***
        jobData=***REMOVED***jobData***REMOVED***
        onJobClose=***REMOVED***handleCloseJob***REMOVED***
        isClosingJob=***REMOVED***isClosingJob***REMOVED***
        errorClosingJob=***REMOVED***errorClosingJob***REMOVED***
        clearCloseError=***REMOVED***() => dispatch(***REMOVED*** type: "CLEAR_ERROR" ***REMOVED***)***REMOVED***
        closeDialogOpen=***REMOVED***closeDialogOpen***REMOVED***
        setCloseDialogOpen=***REMOVED***setCloseDialogOpen***REMOVED***
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
