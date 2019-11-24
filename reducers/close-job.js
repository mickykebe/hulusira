export default function jobCloseReducer(state, action) ***REMOVED***
  switch (action.type) ***REMOVED***
    case "CLOSING_JOB":
      return ***REMOVED*** ...state, closeStatus: "closing" ***REMOVED***;
    case "CLOSED_JOB":
      return ***REMOVED*** ...state, closeStatus: "closed" ***REMOVED***;
    case "ERROR_CLOSING_JOB":
      return ***REMOVED*** ...state, closeStatus: "errorClosing" ***REMOVED***;
    case "CLEAR_ERROR":
      return ***REMOVED*** ...state, closeStatus: null ***REMOVED***;
    default:
      throw new Error("Unidentified action type");
  ***REMOVED***
***REMOVED***
