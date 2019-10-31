import ***REMOVED*** Formik ***REMOVED*** from "formik";
import DashboardLayout from "../../../components/dashboard-layout";
import ***REMOVED*** Container, makeStyles ***REMOVED*** from "@material-ui/core";
import redirect from "../../../utils/redirect";
import HSCard from "../../../components/hs-card";
import JobFormFields from "../../../components/job-form-fields";
import api from "../../../api";

const useStyles = makeStyles(theme => (***REMOVED***
  form: ***REMOVED***
    display: "flex",
    flexDirection: "column"
  ***REMOVED***
***REMOVED***));

export default function DashboardNewJob(***REMOVED*** user, primaryTags ***REMOVED***) ***REMOVED***
  const handleSubmit = () => ***REMOVED******REMOVED***;
  const classes = useStyles();
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md">
        <Formik
          initialValues=***REMOVED******REMOVED***
            position: "",
            jobType: "",
            hasCompany: true,
            location: "Addis Ababa",
            primaryTagId: "",
            tags: [],
            salary: "",
            description: "",
            requirements: "",
            responsibilites: "",
            howToApply: "",
            applyUrl: "",
            applyEmail: "",
            deadline: null,
            companyId: null
          ***REMOVED******REMOVED***
          onSubmit=***REMOVED***handleSubmit***REMOVED***>
          ***REMOVED***(***REMOVED***
            values,
            isSubmitting,
            handleChange,
            errors,
            touched,
            setFieldValue,
            handleSubmit
          ***REMOVED***) => ***REMOVED***
            return (
              <form className=***REMOVED***classes.form***REMOVED*** onSubmit=***REMOVED***handleSubmit***REMOVED***>
                <HSCard title="Job">
                  <JobFormFields
                    values=***REMOVED***values***REMOVED***
                    errors=***REMOVED***errors***REMOVED***
                    touched=***REMOVED***touched***REMOVED***
                    handleChange=***REMOVED***handleChange***REMOVED***
                    setFieldValue=***REMOVED***setFieldValue***REMOVED***
                    primaryTags=***REMOVED***primaryTags***REMOVED***
                  />
                </HSCard>
              </form>
            );
          ***REMOVED******REMOVED***
        </Formik>
      </Container>
    </DashboardLayout>
  );
***REMOVED***

DashboardNewJob.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/new");
  ***REMOVED***

  const primaryTags = await api.getPrimaryTags(ctx);
  return ***REMOVED*** primaryTags ***REMOVED***;

  return ***REMOVED******REMOVED***;
***REMOVED***;
