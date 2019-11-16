import * as Yup from "yup";
import ***REMOVED*** cleanTags ***REMOVED*** from ".";

export const jobValidationSchema = Yup.object().shape(
  ***REMOVED***
    position: Yup.string().required("Required"),
    jobType: Yup.string().required("Required"),
    primaryTag: Yup.string()
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
        const ***REMOVED*** primaryTag ***REMOVED*** = this.parent;
        if (primaryTag === null || primaryTag === undefined) ***REMOVED***
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
      .email(),
    companyName: Yup.string().when(["hasCompany", "companyId"], ***REMOVED***
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string().required("Required")
    ***REMOVED***),
    companyEmail: Yup.string().when(["hasCompany", "companyId"], ***REMOVED***
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string()
        .email()
        .required("Required")
    ***REMOVED***),
    companyId: Yup.number()
      .nullable()
      .when(["hasCompany", "companyName"], ***REMOVED***
        is: (hasCompany, companyName) => hasCompany && !companyName,
        then: Yup.number().required("Required")
      ***REMOVED***)
  ***REMOVED***,
  ["companyId", "companyName"]
);
