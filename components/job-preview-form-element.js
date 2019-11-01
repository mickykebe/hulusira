import JobItem from "./job-item";
import ***REMOVED*** cleanTags ***REMOVED*** from "../utils";

export default function JobPreviewFormElement(***REMOVED***
  className = "",
  values,
  company,
  primaryTags
***REMOVED***) ***REMOVED***
  return (
    <JobItem
      className=***REMOVED***className***REMOVED***
      company=***REMOVED***values.hasCompany ? company : null***REMOVED***
      job=***REMOVED******REMOVED***
        position: values.position || "Position",
        jobType: values.jobType
      ***REMOVED******REMOVED***
      tags=***REMOVED***[
        ...primaryTags
          .filter(tag => tag.id === values.primaryTagId)
          .map(tag => tag.name),
        ...cleanTags(values.tags)
      ]***REMOVED***
      preview
    />
  );
***REMOVED***
