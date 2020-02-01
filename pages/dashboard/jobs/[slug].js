import api from "../../../api";
import DashboardLayout from "../../../components/dashboard-layout";
import JobContentManage from "../../../components/job-content-manage";
import redirect from "../../../utils/redirect";
import Router from "next/router";

export default function DashboardJob({ user, jobData }) {
  const closeJob = async () => {
    await api.closeJob(jobData.job.id);
    Router.push("/dashboard/jobs");
  };
  return (
    <DashboardLayout user={user}>
      <JobContentManage
        isJobOwner={true}
        jobData={jobData}
        onJobClose={closeJob}
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
