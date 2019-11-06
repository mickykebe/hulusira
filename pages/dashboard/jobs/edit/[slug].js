import DashboardLayout from "../../../../components/dashboard-layout";
import ***REMOVED*** Container ***REMOVED*** from "@material-ui/core";
import JobForm from "../../../../components/job-form";
import redirect from "../../../../utils/redirect";
import api from "../../../../api";
import ***REMOVED*** cleanTags ***REMOVED*** from "../../../../utils";
import ***REMOVED*** useState ***REMOVED*** from "react";
import HSSnackBar from "../../../../components/hs-snackbar";

export default function EditJob(***REMOVED*** user, jobData, companies, primaryTags ***REMOVED***) ***REMOVED***
  const tags = jobData.job.tags;
  const primaryTag = tags.find(tag => tag.isPrimary === true);
  const initialValues = ***REMOVED***
    ...jobData.job,
    primaryTagId: primaryTag ? primaryTag.id : "",
    tags: tags.filter(tag => !tag.isPrimary).map(tag => tag.name),
    hasCompany: !!jobData.job.companyId
  ***REMOVED***;
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const handleSubmit = async function(values) ***REMOVED***
    const tags = cleanTags(values.tags);
    const primaryTagId =
      values.primaryTagId !== "" ? values.primaryTagId : null;
    await api.updateJob(jobData.job.id, ***REMOVED***
      ...values,
      tags,
      primaryTagId
    ***REMOVED***);
    setShowSuccessSnackbar(true);
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md">
        <JobForm
          initialValues=***REMOVED***initialValues***REMOVED***
          companies=***REMOVED***companies***REMOVED***
          primaryTags=***REMOVED***primaryTags***REMOVED***
          onSubmit=***REMOVED***handleSubmit***REMOVED***
          reactivateAfterSubmit=***REMOVED***true***REMOVED***
        />
        <HSSnackBar
          open=***REMOVED***showSuccessSnackbar***REMOVED***
          variant="success"
          autoHideDuration=***REMOVED***3000***REMOVED***
          message="Job successfully updated"
          onClose=***REMOVED***() => ***REMOVED***
            setShowSuccessSnackbar(false);
          ***REMOVED******REMOVED***
        />
      </Container>
    </DashboardLayout>
  );
***REMOVED***

EditJob.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  const ***REMOVED*** slug ***REMOVED*** = ctx.query;
  const [jobData, companies, primaryTags] = await Promise.all([
    api.getJob(ctx, slug),
    api.getCompanies(ctx),
    api.getPrimaryTags(ctx)
  ]);

  return ***REMOVED*** jobData, companies, primaryTags ***REMOVED***;
***REMOVED***;
