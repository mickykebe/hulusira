import ***REMOVED*** Fragment ***REMOVED*** from "react";
import ***REMOVED***
  Box,
  List,
  ListItem,
  ListItemAvatar,
  makeStyles,
  Divider,
  ListItemText
***REMOVED*** from "@material-ui/core";
import CompanyLogo from "./company-logo";

const useStyles = makeStyles(theme => (***REMOVED***
  list: ***REMOVED***
    width: "100%",
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: ***REMOVED***
      width: 300
    ***REMOVED***
  ***REMOVED***
***REMOVED***));

export default function PendingJobList(***REMOVED*** jobs ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Box display="flex" height="100%" overflow="none">
      <List className=***REMOVED***classes.list***REMOVED***>
        ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***, index) => (
          <Fragment key=***REMOVED***job.id***REMOVED***>
            <ListItem button>
              ***REMOVED***!!company && (
                <ListItemAvatar>
                  <CompanyLogo company=***REMOVED***company***REMOVED*** size="small" />
                </ListItemAvatar>
              )***REMOVED***
              <ListItemText
                primary=***REMOVED***job.position***REMOVED***
                primaryTypographyProps=***REMOVED******REMOVED*** variant: "subtitle2" ***REMOVED******REMOVED***
                secondary=***REMOVED***!!company ? company.name : job.jobType***REMOVED***
              />
            </ListItem>
            ***REMOVED***index + 1 !== jobs.length && <Divider />***REMOVED***
          </Fragment>
        ))***REMOVED***
      </List>
    </Box>
  );
***REMOVED***
