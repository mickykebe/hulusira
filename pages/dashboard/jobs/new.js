import { Formik } from "formik";
import DashboardLayout from "../../../components/dashboard-layout";
import { Container, makeStyles } from "@material-ui/core";
import redirect from "../../../utils/redirect";
import HSCard from "../../../components/hs-card";
import JobFormFields from "../../../components/job-form-fields";
import api from "../../../api";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column"
  }
}));

export default function DashboardNewJob({ user, primaryTags }) {
  const handleSubmit = () => {};
  const classes = useStyles();
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <Formik
          initialValues={{
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
          }}
          onSubmit={handleSubmit}>
          {({
            values,
            isSubmitting,
            handleChange,
            errors,
            touched,
            setFieldValue,
            handleSubmit
          }) => {
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <HSCard title="Job">
                  <JobFormFields
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    primaryTags={primaryTags}
                  />
                </HSCard>
              </form>
            );
          }}
        </Formik>
      </Container>
    </DashboardLayout>
  );
}

DashboardNewJob.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/new");
  }

  const primaryTags = await api.getPrimaryTags(ctx);
  return { primaryTags };

  return {};
};
