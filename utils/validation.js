import * as Yup from "yup";
import { cleanTags, jobTypes, careerLevels } from ".";

export const jobValidationSchema = Yup.object().shape(
  {
    position: Yup.string().required("Required"),
    jobType: Yup.string()
      .required("Required")
      .oneOf(jobTypes, "Invalid Job Type"),
    careerLevel: Yup.string()
      .required("Required")
      .oneOf(
        careerLevels.map(level => level.id),
        "Invalid Career Level"
      ),
    primaryTag: Yup.string()
      .nullable()
      .test(
        "primaryTag-required",
        "Choose at least one tag here or enter a tag in the Extra Tags input below.",
        function(value) {
          const tags = cleanTags(this.parent.tags);
          if (!tags || tags.length === 0) {
            return !!value;
          }
          return true;
        }
      ),
    tags: Yup.array().test(
      "tags-required",
      "Please enter at least one tag here or choose a tag in the Primary Tag input above.",
      function(value) {
        const { primaryTag } = this.parent;
        if (primaryTag === null || primaryTag === undefined) {
          return value && cleanTags(value).length > 0;
        }
        return true;
      }
    ),
    deadline: Yup.date()
      .nullable()
      .default(null),
    description: Yup.string().required("Required"),
    applyEmail: Yup.string()
      .nullable()
      .notRequired()
      .email(),
    companyName: Yup.string().when(["hasCompany", "companyId"], {
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string().required("Required")
    }),
    companyEmail: Yup.string().when(["hasCompany", "companyId"], {
      is: (hasCompany, companyId) => hasCompany && !companyId,
      then: Yup.string()
        .email()
        .required("Required")
    }),
    companyId: Yup.number()
      .nullable()
      .when(["hasCompany", "companyName"], {
        is: (hasCompany, companyName) => hasCompany && !companyName,
        then: Yup.number().required("Required")
      })
  },
  ["companyId", "companyName"]
);
