import * as Yup from "yup";
import ***REMOVED*** cleanTags ***REMOVED*** from ".";

export const jobValidationFields = ***REMOVED***
  position: Yup.string().required("Required"),
  jobType: Yup.string().required("Required"),
  primaryTagId: Yup.number()
    .nullable()
    .test(
      "primaryTag-required",
      "Choose at least one tag here or enter a tag in the Extra Tags input below.",
      function(value) ***REMOVED***
        const tags = cleanTags(this.parent.tags);
        if (!tags || tags.length === 0) ***REMOVED***
          return !!value;
        ***REMOVED***
        return true;
      ***REMOVED***
    ),
  tags: Yup.array().test(
    "tags-required",
    "Please enter at least one tag here or choose a tag in the Primary Tag input above.",
    function(value) ***REMOVED***
      const ***REMOVED*** primaryTagId ***REMOVED*** = this.parent;
      if (primaryTagId === null || primaryTagId === undefined) ***REMOVED***
        return value && cleanTags(value).length > 0;
      ***REMOVED***
      return true;
    ***REMOVED***
  ),
  deadline: Yup.date()
    .nullable()
    .default(null),
  description: Yup.string().required("Required"),
  applyEmail: Yup.string()
    .nullable()
    .notRequired()
    .email()
***REMOVED***;
