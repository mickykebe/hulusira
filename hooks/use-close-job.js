import { useReducer, useState } from "react";
import jobCloseReducer from "../reducers/close-job";

export default function useCloseJob(closeJob) {
  const [{ closeStatus }, dispatch] = useReducer(jobCloseReducer, {
    closeStatus: null
  });
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const handleCloseJob = async () => {
    dispatch({ type: "CLOSING_JOB" });
    setCloseDialogOpen(false);
    try {
      await closeJob();
      dispatch({ type: "CLOSED_JOB" });
    } catch (err) {
      console.error(err);
      dispatch({ type: "ERROR_CLOSING_JOB" });
    }
  };
  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return [
    { closeStatus, closeDialogOpen },
    setCloseDialogOpen,
    clearError,
    handleCloseJob
  ];
}
