import DashboardLayout from "../../../../components/dashboard-layout";
import { Container } from "@material-ui/core";
import JobForm from "../../../../components/job-form";
import redirect from "../../../../utils/redirect";
import api from "../../../../api";
import { cleanTags } from "../../../../utils";
import { useState } from "react";
import HSSnackBar from "../../../../components/hs-snackbar";

export default function EditJob({ user, jobData, companies, primaryTags }) {
  const tags = jobData.job.tags;
  const primaryTag = tags.find(tag => tag.isPrimary === true);
  const initialValues = {
    ...jobData.job,
    primaryTag: primaryTag ? primaryTag.name : "",
    tags: tags.filter(tag => !tag.isPrimary).map(tag => tag.name),
    hasCompany: !!jobData.job.companyId
  };
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const handleSubmit = async function(values) {
    const tags = cleanTags(values.tags);
    const primaryTag =
      values.primaryTag !== "" ? values.primaryTag : null;
    await api.updateJob(jobData.job.id, {
      ...values,
      tags,
      primaryTag
    });
    setShowSuccessSnackbar(true);
  };
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <JobForm
          initialValues={initialValues}
          companies={companies}
          primaryTags={primaryTags}
          onSubmit={handleSubmit}
          reactivateAfterSubmit={true}
        />
        <HSSnackBar
          open={showSuccessSnackbar}
          variant="success"
          autoHideDuration={3000}
          message="Job successfully updated"
          onClose={() => {
            setShowSuccessSnackbar(false);
          }}
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

  if (jobData.job.owner !== user.id) {
    redirect(ctx, "/dashboard/jobs");
  }

  return { jobData, companies, primaryTags };
};
