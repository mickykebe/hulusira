export const GA_TRACKING_ID = "UA-148938506-1";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => ***REMOVED***
  window.gtag("config", GA_TRACKING_ID, ***REMOVED***
    page_path: url
  ***REMOVED***);
***REMOVED***;

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (***REMOVED*** action, category, label, value ***REMOVED***) => ***REMOVED***
  window.gtag("event", action, ***REMOVED***
    event_category: category,
    event_label: label,
    value: value
  ***REMOVED***);
***REMOVED***;
