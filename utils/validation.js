import * as Yup from "yup";
import { cleanTags } from ".";

export const jobValidationFields = {
  position: Yup.string().required("Required"),
  jobType: Yup.string().required("Required"),
  primaryTagId: Yup.number()
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
      const { primaryTagId } = this.parent;
      if (primaryTagId === null || primaryTagId === undefined) {
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
    .email()
};
