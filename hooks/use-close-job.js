import ***REMOVED*** useReducer, useState ***REMOVED*** from "react";
import jobCloseReducer from "../reducers/close-job";

export default function useCloseJob(closeJob) ***REMOVED***
  const [***REMOVED*** closeStatus ***REMOVED***, dispatch] = useReducer(jobCloseReducer, ***REMOVED***
    closeStatus: null
  ***REMOVED***);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const handleCloseJob = async () => ***REMOVED***
    dispatch(***REMOVED*** type: "CLOSING_JOB" ***REMOVED***);
    setCloseDialogOpen(false);
    try ***REMOVED***
      await closeJob();
      dispatch(***REMOVED*** type: "CLOSED_JOB" ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      dispatch(***REMOVED*** type: "ERROR_CLOSING_JOB" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  const clearError = () => dispatch(***REMOVED*** type: "CLEAR_ERROR" ***REMOVED***);

  return [
    ***REMOVED*** closeStatus, closeDialogOpen ***REMOVED***,
    setCloseDialogOpen,
    clearError,
    handleCloseJob
  ];
***REMOVED***
