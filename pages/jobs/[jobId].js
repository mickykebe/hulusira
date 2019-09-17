import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";

function Job({ jobData }) {
  return (
    <Layout>
      <JobContent jobData={jobData} />
    </Layout>
  );
}

Job.getInitialProps = async ({ query }) => {
  const { jobId } = query;
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(jobId)
  ]);
  return { jobData, primaryTags };
};

export default Job;
