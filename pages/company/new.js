import DashboardLayout from "../../components/dashboard-layout";
import redirect from "../../utils/redirect";
import ***REMOVED*** Container, makeStyles ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import HSCard from "../../components/hs-card";

const useStyles = makeStyles(theme => (***REMOVED***
  form: ***REMOVED***
    display: "flex",
    flexDirection: "column"
  ***REMOVED***
***REMOVED***));

const validationSchema = Yup.object().shape(***REMOVED***
  name: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required")
***REMOVED***);

export default function NewCompany(***REMOVED*** user ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="company">
      <Container maxWidth="md">
        <Formik
          validationSchema=***REMOVED***validationSchema***REMOVED***
          initialValues=***REMOVED******REMOVED***
            name: "",
            email: ""
          ***REMOVED******REMOVED***>
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
                <HSCard title="Company"></HSCard>
              </form>
            );
          ***REMOVED******REMOVED***
        </Formik>
      </Container>
    </DashboardLayout>
  );
***REMOVED***

NewCompany.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;
