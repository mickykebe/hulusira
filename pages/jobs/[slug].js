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
  const { slug } = query;
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(slug)
  ]);
  return { jobData, primaryTags };
};

export default Job;
