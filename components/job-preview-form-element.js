import JobItem from "./job-item";
import { cleanTags } from "../utils";

export default function JobPreviewFormElement({
  className = "",
  values,
  company,
  primaryTags
}) {
  return (
    <JobItem
      className={className}
      company={values.hasCompany ? company : null}
      job={{
        position: values.position || "Position",
        jobType: values.jobType
      }}
      tags={[
        ...primaryTags
          .filter(tag => tag.name === values.primaryTag)
          .map(tag => tag.name),
        ...cleanTags(values.tags)
      ]}
      preview
    />
  );
}
