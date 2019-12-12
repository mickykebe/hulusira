import Router from "next/router";
import ***REMOVED***
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  CircularProgress,
  Badge,
  ListItemText
***REMOVED*** from "@material-ui/core";
import ***REMOVED*** useEffect, useReducer, Fragment ***REMOVED*** from "react";
import api from "../api";
import DrawerList from "./drawer-list";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";

function pendingJobsReducer(state = ***REMOVED******REMOVED***, action) ***REMOVED***
  switch (action.type) ***REMOVED***
    case "LOADING": ***REMOVED***
      return ***REMOVED*** ...state, status: "loading" ***REMOVED***;
    ***REMOVED***
    case "FETCH_SUCCESS": ***REMOVED***
      return ***REMOVED*** ...state, status: "done", jobs: action.jobs ***REMOVED***;
    ***REMOVED***
    case "ERROR": ***REMOVED***
      return ***REMOVED*** ...state, status: "error" ***REMOVED***;
    ***REMOVED***
    default:
      throw new Error("Unknown action type");
  ***REMOVED***
***REMOVED***

export default function AdminDashboardMenuList(***REMOVED***
  user,
  pendingJobs: pendingJobsProp,
  selectedItem
***REMOVED***) ***REMOVED***
  const [***REMOVED*** jobs, status ***REMOVED***, dispatch] = useReducer(pendingJobsReducer, ***REMOVED***
    pendingJobs: [],
    status: "none"
  ***REMOVED***);
  const pendingJobs = pendingJobsProp || jobs;
  const fetchPendingJobs = async () => ***REMOVED***
    dispatch(***REMOVED*** type: "LOADING" ***REMOVED***);
    try ***REMOVED***
      const jobs = await api.getPendingJobs();
      dispatch(***REMOVED*** type: "FETCH_SUCCESS", jobs ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      dispatch(***REMOVED*** type: "ERROR" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  useEffect(() => ***REMOVED***
    if (user.role === "admin" && !pendingJobs) ***REMOVED***
      fetchPendingJobs();
    ***REMOVED***
  ***REMOVED***, [pendingJobs, user.role]);
  return (
    <Fragment>
      ***REMOVED***user.role === "admin" && (
        <DrawerList headerTitle="Admin">
          <ListItem
            selected=***REMOVED***selectedItem === "pendingJobs"***REMOVED***
            button
            onClick=***REMOVED***() => Router.push("/dashboard/pending-jobs")***REMOVED***
          >
            <ListItemIcon>
              <WorkOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps=***REMOVED******REMOVED***
                variant: "subtitle1",
                color: "textSecondary"
              ***REMOVED******REMOVED***
              primary="Pending Jobs"
            />
            <ListItemSecondaryAction>
              ***REMOVED***status === "loading" && (
                <CircularProgress color="primary" size="1rem" />
              )***REMOVED***
              ***REMOVED***pendingJobs && (
                <Badge badgeContent=***REMOVED***pendingJobs.length***REMOVED*** color="primary" />
              )***REMOVED***
            </ListItemSecondaryAction>
          </ListItem>
        </DrawerList>
      )***REMOVED***
    </Fragment>
  );
***REMOVED***
