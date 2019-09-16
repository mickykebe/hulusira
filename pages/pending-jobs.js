import nextCookie from "next-cookies";
import api from "../api";
import redirect from "../utils/redirect";
import Layout from "../components/layout";
import PendingJobList from "../components/pending-job-list";

function PendingJobs({ user, jobs }) {
  return (
    <Layout>
      <PendingJobList jobs={jobs} />
    </Layout>
  );
}

PendingJobs.getInitialProps = async function(ctx) {
  if (ctx.req) {
    const { qid: sessionId } = nextCookie(ctx);
    if (!sessionId) {
      redirect(ctx, "/");
      return {};
    }
  }

  let user;

  try {
    user = await api.activeUser(ctx);
    if (user.role !== "admin") {
      throw new Error("Not permitted");
    }
  } catch (err) {
    redirect(ctx, "/");
    return {};
  }

  const jobs = await api.getPendingJobs(ctx);

  return { user, jobs };
};

export default PendingJobs;
