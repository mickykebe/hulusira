export default function jobCloseReducer(state, action) {
  switch (action.type) {
    case "CLOSING_JOB":
      return { ...state, closeStatus: "closing" };
    case "CLOSED_JOB":
      return { ...state, closeStatus: "closed" };
    case "ERROR_CLOSING_JOB":
      return { ...state, closeStatus: "errorClosing" };
    case "CLEAR_ERROR":
      return { ...state, closeStatus: null };
    default:
      throw new Error("Unidentified action type");
  }
}
