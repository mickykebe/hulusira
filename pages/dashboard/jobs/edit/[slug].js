import DashboardLayout from "../../../../components/dashboard-layout";
import { Container } from "@material-ui/core";
import JobForm from "../../../../components/job-form";
import redirect from "../../../../utils/redirect";
import api from "../../../../api";

export default function EditJob({ user, jobData, companies, primaryTags }) {
  const handleSubmit = () => {};
  const tags = jobData.job.tags;
  const primaryTag = tags.find(tag => tag.isPrimary === true);
  const initialValues = {
    ...jobData.job,
    primaryTagId: primaryTag ? primaryTag.id : "",
    tags: tags.filter(tag => !tag.isPrimary).map(tag => tag.name),
    hasCompany: !!jobData.job.companyId
  };
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <JobForm
          initialValues={initialValues}
          companies={companies}
          primaryTags={primaryTags}
          onSubmit={handleSubmit}
        />
      </Container>
    </DashboardLayout>
  );
}

EditJob.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  const { slug } = ctx.query;
  const [jobData, companies, primaryTags] = await Promise.all([
    api.getJob(ctx, slug),
    api.getCompanies(ctx),
    api.getPrimaryTags(ctx)
  ]);

  return { jobData, companies, primaryTags };
};
