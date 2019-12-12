import Router from "next/router";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  CircularProgress,
  Badge,
  ListItemText
} from "@material-ui/core";
import { useEffect, useReducer, Fragment } from "react";
import api from "../api";
import DrawerList from "./drawer-list";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";

function pendingJobsReducer(state = {}, action) {
  switch (action.type) {
    case "LOADING": {
      return { ...state, status: "loading" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, status: "done", jobs: action.jobs };
    }
    case "ERROR": {
      return { ...state, status: "error" };
    }
    default:
      throw new Error("Unknown action type");
  }
}

export default function AdminDashboardMenuList({
  user,
  pendingJobs: pendingJobsProp,
  selectedItem
}) {
  const [{ jobs, status }, dispatch] = useReducer(pendingJobsReducer, {
    pendingJobs: [],
    status: "none"
  });
  const pendingJobs = pendingJobsProp || jobs;
  const fetchPendingJobs = async () => {
    dispatch({ type: "LOADING" });
    try {
      const jobs = await api.getPendingJobs();
      dispatch({ type: "FETCH_SUCCESS", jobs });
    } catch (err) {
      console.error(err);
      dispatch({ type: "ERROR" });
    }
  };
  useEffect(() => {
    if (user.role === "admin" && !pendingJobs) {
      fetchPendingJobs();
    }
  }, [pendingJobs, user.role]);
  return (
    <Fragment>
      {user.role === "admin" && (
        <DrawerList headerTitle="Admin">
          <ListItem
            selected={selectedItem === "pendingJobs"}
            button
            onClick={() => Router.push("/dashboard/pending-jobs")}
          >
            <ListItemIcon>
              <WorkOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                variant: "subtitle1",
                color: "textSecondary"
              }}
              primary="Pending Jobs"
            />
            <ListItemSecondaryAction>
              {status === "loading" && (
                <CircularProgress color="primary" size="1rem" />
              )}
              {pendingJobs && (
                <Badge badgeContent={pendingJobs.length} color="primary" />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </DrawerList>
      )}
    </Fragment>
  );
}
