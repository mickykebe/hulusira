export default function jobCloseReducer(state, action) ***REMOVED***
  switch (action.type) ***REMOVED***
    case "CLOSING_JOB":
      return ***REMOVED*** ...state, isClosingJob: true, errorClosingJob: false ***REMOVED***;
    case "CLOSED_JOB":
      return ***REMOVED*** ...state, errorClosingJob: false ***REMOVED***;
    case "ERROR_CLOSING_JOB":
      return ***REMOVED*** ...state, isClosingJob: false, errorClosingJob: true ***REMOVED***;
    case "CLEAR_ERROR":
      return ***REMOVED*** ...state, errorClosingJob: false ***REMOVED***;
    default:
      throw new Error("Unidentified action type");
  ***REMOVED***
***REMOVED***
