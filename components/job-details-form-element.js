import { TextField, MenuItem, Box, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MDEditor from "./md-editor";
import HSCard from "./hs-card";
import { careerLevels, jobTypes } from "../utils";

function DatePickerTextField(props) {
  return <TextField margin="normal" fullWidth {...props} />;
}

export default function JobDetailsFormElement({
  values,
  errors,
  touched,
  handleChange,
  primaryTags,
  setFieldValue,
  className
}) {
  const handleMdeChange = fieldName => value => setFieldValue(fieldName, value);
  return (
    <HSCard className={className} title="Job Details">
      <TextField
        name="position"
        label="Position*"
        variant="outlined"
        fullWidth
        margin="normal"
        value={values.position}
        onChange={handleChange}
        error={!!(touched.position && errors.position)}
        helperText={touched.position && errors.position}
      />
      <TextField
        name="jobType"
        select
        value={values.jobType}
        label="Job Type*"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange={handleChange}
        error={!!(touched.jobType && errors.jobType)}
        helperText={touched.jobType && errors.jobType}
      >
        {jobTypes.map(jobType => (
          <MenuItem key={jobType} value={jobType}>
            {jobType}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="careerLevel"
        select
        value={values.careerLevel}
        label="Career Level*"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange={handleChange}
        error={!!(touched.careerLevel && errors.careerLevel)}
        helperText={touched.careerLevel && errors.careerLevel}
      >
        {careerLevels.map(careerLevel => (
          <MenuItem key={careerLevel.id} value={careerLevel.id}>
            {careerLevel.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="location"
        label="Location (optional)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={values.location}
        onChange={handleChange}
        error={!!(touched.location && errors.location)}
        helperText={touched.location && errors.location}
      />
      <Box display="flex" flexWrap="wrap">
        <Box flex="1" flexBasis={["100%", 0]}>
          <TextField
            name="primaryTag"
            select
            value={values.primaryTag}
            label="Primary Tag"
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={!!(touched.primaryTag && errors.primaryTag)}
            helperText={
              !!(touched.primaryTag && errors.primaryTag)
                ? errors.primaryTag
                : "Choosing a tag here boosts your job's visibility."
            }
          >
            {primaryTags.map(tag => (
              <MenuItem key={tag.name} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box textAlign="center" px={2} my="auto" flexBasis={["100%", "0"]}>
          <Typography variant="subtitle2">AND/OR</Typography>
        </Box>
        <Box flex="1" flexBasis={["100%", "0"]}>
          <TextField
            name="tags"
            label="Extra Tags"
            variant="outlined"
            margin="normal"
            fullWidth
            placeholder="Marketing, Software developer, Modeling, etc."
            value={values.tags.join(",")}
            onChange={ev => {
              setFieldValue(
                "tags",
                ev.target.value.split(",").map(tag => tag.toUpperCase())
              );
            }}
            error={!!(touched.tags && errors.tags)}
            helperText={
              !!(touched.tags && errors.tags)
                ? errors.tags
                : "List tags separated by comma(,)."
            }
          />
        </Box>
      </Box>
      <TextField
        name="salary"
        label="Salary (optional)"
        variant="outlined"
        margin="normal"
        fullWidth
        value={values.salary}
        onChange={handleChange}
        error={!!(touched.salary && errors.salary)}
        helperText={
          !!(touched.salary && errors.salary)
            ? errors.salary
            : "Salary is not required but highly recommended. Enter salary data for better results."
        }
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          format="yyyy-MM-dd"
          label="Application Deadline (optional)"
          inputVariant="outlined"
          disablePast
          value={values.deadline}
          onChange={date => setFieldValue("deadline", date)}
          TextFieldComponent={DatePickerTextField}
        />
      </MuiPickersUtilsProvider>
      <MDEditor
        id="description"
        label="Job Description*"
        value={values.description}
        onChange={handleMdeChange("description")}
        error={!!(touched.description && errors.description)}
        helperText={touched.description && errors.description}
      />
      <MDEditor
        id="requirements"
        label="Job Requirements (optional)"
        value={values.requirements}
        onChange={handleMdeChange("requirements")}
      />
      <MDEditor
        id="responsibilities"
        label="Job Responsibilities (optional)"
        value={values.responsibilities}
        onChange={handleMdeChange("responsibilities")}
      />
      <MDEditor
        id="how_to_apply"
        label="How to Apply (optional)"
        value={values.howToApply}
        onChange={handleMdeChange("howToApply")}
      />
      <Box display="flex" flexWrap="wrap">
        <Box flex="1" flexBasis={["100%", "0"]}>
          <TextField
            name="applyUrl"
            label="Apply URL (optional)"
            variant="outlined"
            margin="normal"
            helperText="The url can be a link to your telegram account, facebook URL or to a site where the job is posted."
            fullWidth
            value={values.applyUrl}
            onChange={ev => {
              setFieldValue("applyEmail", "");
              handleChange(ev);
            }}
            error={!!(touched.applyUrl && errors.applyUrl)}
            helperText={
              (touched.applyUrl && errors.applyUrl) || "Used for 'Apply' button"
            }
          />
        </Box>
        <Box textAlign="center" px={2} my="auto" flexBasis={["100%", "0"]}>
          <Typography variant="subtitle2">OR</Typography>
        </Box>
        <Box flex="1" flexBasis={["100%", "0"]}>
          <TextField
            name="applyEmail"
            label="Apply Email (optional)"
            variant="outlined"
            margin="normal"
            fullWidth
            type="email"
            value={values.applyEmail}
            onChange={ev => {
              setFieldValue("applyUrl", "");
              handleChange(ev);
            }}
            error={!!(touched.applyEmail && errors.applyEmail)}
            helperText={
              (touched.applyEmail && errors.applyEmail) ||
              "Used for 'apply' button"
            }
          />
        </Box>
      </Box>
    </HSCard>
  );
}
