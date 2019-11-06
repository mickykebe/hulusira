export default function jobCloseReducer(state, action) {
  switch (action.type) {
    case "CLOSING_JOB":
      return { ...state, isClosingJob: true, errorClosingJob: false };
    case "CLOSED_JOB":
      return { ...state, isClosingJob: false, errorClosingJob: false };
    case "ERROR_CLOSING_JOB":
      return { ...state, isClosingJob: false, errorClosingJob: true };
    case "CLEAR_ERROR":
      return { ...state, errorClosingJob: false };
    default:
      throw new Error("Unidentified action type");
  }
}
