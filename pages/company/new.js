import DashboardLayout from "../../components/dashboard-layout";
import redirect from "../../utils/redirect";
import { Container, makeStyles } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import HSCard from "../../components/hs-card";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column"
  }
}));

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required")
});

export default function NewCompany({ user }) {
  const classes = useStyles();
  return (
    <DashboardLayout user={user} selectedItem="company">
      <Container maxWidth="md">
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name: "",
            email: ""
          }}>
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
                <HSCard title="Company"></HSCard>
              </form>
            );
          }}
        </Formik>
      </Container>
    </DashboardLayout>
  );
}

NewCompany.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  return {};
};
