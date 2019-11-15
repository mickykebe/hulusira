import api from "../../../api";
import DashboardLayout from "../../../components/dashboard-layout";
import JobContentManage from "../../../components/job-content-manage";
import redirect from "../../../utils/redirect";
import jobCloseReducer from "../../../reducers/close-job";
import { useState, useReducer } from "react";
import Router from "next/router";

export default function DashboardJob({ user, jobData }) {
  const [{ isClosingJob, errorClosingJob }, dispatch] = useReducer(
    jobCloseReducer,
    { isClosingJob: false, errorClosingJob: false }
  );
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const handleCloseJob = async () => {
    setCloseDialogOpen(false);
    dispatch({ type: "CLOSING_JOB" });
    try {
      await api.closeJob(jobData.job.id);
      Router.push("/dashboard/jobs");
      dispatch({ type: "CLOSED_JOB" });
    } catch (err) {
      dispatch({ type: "ERROR_CLOSING_JOB" });
    }
  };
  return (
    <DashboardLayout user={user}>
      <JobContentManage
        isJobOwner={true}
        jobData={jobData}
        onJobClose={handleCloseJob}
        isClosingJob={isClosingJob}
        errorClosingJob={errorClosingJob}
        clearCloseError={() => dispatch({ type: "CLEAR_ERROR" })}
        closeDialogOpen={closeDialogOpen}
        setCloseDialogOpen={setCloseDialogOpen}
      />
    </DashboardLayout>
  );
}

DashboardJob.getInitialProps = async ctx => {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  const { slug } = ctx.query;
  const jobData = await api.getJob(ctx, slug);

  if (jobData.job.owner !== user.id) {
    redirect(ctx, "/dashboard/jobs");
  }

  return { jobData };
};
