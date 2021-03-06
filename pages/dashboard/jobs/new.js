import DashboardLayout from "../../../components/dashboard-layout";
import { Container, makeStyles } from "@material-ui/core";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import Router from "next/router";
import { cleanTags } from "../../../utils";
import JobForm from "../../../components/job-form";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  jobSetting: {
    marginBottom: theme.spacing(3)
  },
  companyPanel: {
    marginBottom: theme.spacing(3)
  },
  orText: {
    marginBottom: theme.spacing(1)
  },
  postButton: {
    marginTop: theme.spacing(1)
  },
  saveButtonIcon: {
    marginRight: theme.spacing(1)
  },
  jobPreview: {
    marginTop: theme.spacing(3)
  }
}));

export default function DashboardNewJob({ user, companies, primaryTags }) {
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const handleSubmit = async function(values) {
    const tags = cleanTags(values.tags);
    const primaryTag = values.primaryTag !== "" ? values.primaryTag : null;
    await api.createJob({
      ...values,
      tags,
      primaryTag
    });
    setDisableSaveButton(true);
    Router.push("/dashboard/jobs");
  };
  const classes = useStyles();
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md" className={classes.root}>
        <JobForm
          companies={companies}
          primaryTags={primaryTags}
          onSubmit={handleSubmit}
          disableSaveButton={disableSaveButton}
          user={user}
        />
      </Container>
    </DashboardLayout>
  );
}

DashboardNewJob.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/new");
  }

  const [companies, primaryTags] = await Promise.all([
    api.getCompanies(ctx),
    api.getPrimaryTags(ctx)
  ]);
  return { companies, primaryTags };
};
