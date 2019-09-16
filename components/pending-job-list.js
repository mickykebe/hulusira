import { Fragment } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  makeStyles,
  Divider,
  ListItemText
} from "@material-ui/core";
import CompanyLogo from "./company-logo";

const useStyles = makeStyles(theme => ({
  list: {
    width: "100%",
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: 300
    }
  }
}));

export default function PendingJobList({ jobs }) {
  const classes = useStyles();
  return (
    <Box display="flex" height="100%" overflow="none">
      <List className={classes.list}>
        {jobs.map(({ job, company }, index) => (
          <Fragment key={job.id}>
            <ListItem button>
              {!!company && (
                <ListItemAvatar>
                  <CompanyLogo company={company} size="small" />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={job.position}
                primaryTypographyProps={{ variant: "subtitle2" }}
                secondary={!!company ? company.name : job.jobType}
              />
            </ListItem>
            {index + 1 !== jobs.length && <Divider />}
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
