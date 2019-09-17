import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";

function Job(***REMOVED*** jobData ***REMOVED***) ***REMOVED***
  return (
    <Layout>
      <JobContent jobData=***REMOVED***jobData***REMOVED*** />
    </Layout>
  );
***REMOVED***

Job.getInitialProps = async (***REMOVED*** query ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** jobId ***REMOVED*** = query;
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(jobId)
  ]);
  return ***REMOVED*** jobData, primaryTags ***REMOVED***;
***REMOVED***;

export default Job;
