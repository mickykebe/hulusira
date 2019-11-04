import DashboardLayout from "../../../components/dashboard-layout";
import Router from "next/router";
import {
  Container,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  makeStyles,
  Link as MuiLink,
  Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import redirect from "../../../utils/redirect";
import HSPaper from "../../../components/hs-paper";
import CompanyLogo from "../../../components/company-logo";
import Link from "next/link";
import api from "../../../api";
import EmptyList from "../../../components/empty-list";

const useStyles = makeStyles(theme => ({
  tableHead: {
    fontWeight: 800
  },
  noJobsImage: {
    width: "20rem",
    height: "20rem"
  }
}));

export default function DashboardJobs({ user, jobs }) {
  const classes = useStyles();
  return (
    <DashboardLayout user={user} selectedItem="jobs">
      <Container maxWidth="md">
        <Box display="flex" py={2}>
          <Box flex="1" />
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => Router.push("/dashboard/jobs/new")}>
            Post Job
          </Button>
        </Box>
        {jobs.length === 0 && <EmptyList message="No Jobs Available" />}
        {jobs.length > 0 && (
          <HSPaper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Position
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Company
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map(({ job, company }) => {
                  return (
                    <TableRow key={job.id}>
                      <TableCell
                        variant="head"
                        classes={{ head: classes.tableHead }}>
                        <Link
                          href="/jobs/[slug]"
                          as={`/jobs/${job.slug}`}
                          passHref>
                          <MuiLink color="inherit">{job.position}</MuiLink>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {company ? (
                          <Box display="flex" alignItems="center">
                            {company.logo && (
                              <Box pr={1}>
                                <CompanyLogo
                                  company={company}
                                  abbrevFallback={false}
                                  size="small"
                                />
                              </Box>
                            )}
                            {company.name}
                          </Box>
                        ) : (
                          "None"
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() =>
                            Router.push(`/dashboard/jobs/edit/${job.slug}`)
                          }>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </HSPaper>
        )}
      </Container>
    </DashboardLayout>
  );
}

DashboardJobs.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  const jobs = await api.getMyJobs(ctx);

  return { jobs };
};
