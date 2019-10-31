import ***REMOVED*** Fragment ***REMOVED*** from "react";
import ***REMOVED***
  TextField,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Switch
***REMOVED*** from "@material-ui/core";
import ***REMOVED*** MuiPickersUtilsProvider, DatePicker ***REMOVED*** from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MDEditor from "./md-editor";

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary"
];

function DatePickerTextField(props) ***REMOVED***
  return <TextField margin="normal" fullWidth ***REMOVED***...props***REMOVED*** />;
***REMOVED***

export default function JobFormFields(***REMOVED***
  values,
  errors,
  touched,
  handleChange,
  primaryTags,
  setFieldValue
***REMOVED***) ***REMOVED***
  const handleMdeChange = fieldName => value => setFieldValue(fieldName, value);
  return (
    <Fragment>
      <TextField
        name="position"
        label="Position"
        variant="outlined"
        fullWidth
        margin="normal"
        value=***REMOVED***values.position***REMOVED***
        onChange=***REMOVED***handleChange***REMOVED***
        error=***REMOVED***!!(touched.position && errors.position)***REMOVED***
        helperText=***REMOVED***touched.position && errors.position***REMOVED***
      />
      <TextField
        name="jobType"
        select
        value=***REMOVED***values.jobType***REMOVED***
        label="Job Type*"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange=***REMOVED***handleChange***REMOVED***
        error=***REMOVED***!!(touched.jobType && errors.jobType)***REMOVED***
        helperText=***REMOVED***touched.jobType && errors.jobType***REMOVED***>
        ***REMOVED***jobTypes.map(jobType => (
          <MenuItem key=***REMOVED***jobType***REMOVED*** value=***REMOVED***jobType***REMOVED***>
            ***REMOVED***jobType***REMOVED***
          </MenuItem>
        ))***REMOVED***
      </TextField>
      <TextField
        name="location"
        label="Location"
        variant="outlined"
        fullWidth
        margin="normal"
        value=***REMOVED***values.location***REMOVED***
        onChange=***REMOVED***handleChange***REMOVED***
        error=***REMOVED***!!(touched.location && errors.location)***REMOVED***
        helperText=***REMOVED***touched.location && errors.location***REMOVED***
      />
      <TextField
        name="primaryTagId"
        select
        value=***REMOVED***values.primaryTagId***REMOVED***
        label="Primary Tag"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange=***REMOVED***handleChange***REMOVED***
        error=***REMOVED***!!(touched.primaryTagId && errors.primaryTagId)***REMOVED***
        helperText=***REMOVED***
          !!(touched.primaryTagId && errors.primaryTagId)
            ? errors.primaryTagId
            : "Choosing a tag here boosts your job's visibility."
        ***REMOVED***>
        ***REMOVED***primaryTags.map(tag => (
          <MenuItem key=***REMOVED***tag.id***REMOVED*** value=***REMOVED***tag.id***REMOVED***>
            ***REMOVED***tag.name***REMOVED***
          </MenuItem>
        ))***REMOVED***
      </TextField>
      <TextField
        name="tags"
        label="Extra Tags"
        variant="outlined"
        margin="normal"
        fullWidth
        placeholder="Marketing, Software developer, Modeling, etc."
        value=***REMOVED***values.tags.join(",")***REMOVED***
        onChange=***REMOVED***ev => ***REMOVED***
          setFieldValue(
            "tags",
            ev.target.value.split(",").map(tag => tag.toUpperCase())
          );
        ***REMOVED******REMOVED***
        error=***REMOVED***!!(touched.tags && errors.tags)***REMOVED***
        helperText=***REMOVED***
          !!(touched.tags && errors.tags)
            ? errors.tags
            : "List tags separated by comma(,)."
        ***REMOVED***
      />
      <TextField
        name="salary"
        label="Salary"
        variant="outlined"
        margin="normal"
        fullWidth
        value=***REMOVED***values.salary***REMOVED***
        onChange=***REMOVED***handleChange***REMOVED***
        error=***REMOVED***!!(touched.salary && errors.salary)***REMOVED***
        helperText=***REMOVED***
          !!(touched.salary && errors.salary)
            ? errors.salary
            : "Salary is not required but highly recommended. Enter salary data for better results."
        ***REMOVED***
      />
      <MuiPickersUtilsProvider utils=***REMOVED***DateFnsUtils***REMOVED***>
        <DatePicker
          format="yyyy-MM-dd"
          label="Application Deadline"
          inputVariant="outlined"
          value=***REMOVED***values.deadline***REMOVED***
          onChange=***REMOVED***date => setFieldValue("deadline", date)***REMOVED***
          TextFieldComponent=***REMOVED***DatePickerTextField***REMOVED***
        />
      </MuiPickersUtilsProvider>
      <MDEditor
        id="description"
        label="Job Description*"
        value=***REMOVED***values.description***REMOVED***
        onChange=***REMOVED***handleMdeChange("description")***REMOVED***
        error=***REMOVED***!!(touched.description && errors.description)***REMOVED***
        helperText=***REMOVED***touched.description && errors.description***REMOVED***
      />
      <MDEditor
        id="requirements"
        label="Job Requirements"
        value=***REMOVED***values.requirements***REMOVED***
        onChange=***REMOVED***handleMdeChange("requirements")***REMOVED***
      />
      <MDEditor
        id="responsibilities"
        label="Job Responsibilities"
        value=***REMOVED***values.responsibilites***REMOVED***
        onChange=***REMOVED***handleMdeChange("responsibilities")***REMOVED***
      />
      <MDEditor
        id="how_to_apply"
        label="How to Apply"
        value=***REMOVED***values.howToApply***REMOVED***
        onChange=***REMOVED***handleMdeChange("howToApply")***REMOVED***
      />
      <Box display="flex" flexWrap="wrap">
        <Box flex="1" flexBasis=***REMOVED***["100%", "0"]***REMOVED***>
          <TextField
            name="applyUrl"
            label="Apply URL*"
            variant="outlined"
            margin="normal"
            helperText="The url can be a link to your telegram account, facebook URL or to a site where the job is posted."
            fullWidth
            value=***REMOVED***values.applyUrl***REMOVED***
            onChange=***REMOVED***ev => ***REMOVED***
              setFieldValue("applyEmail", "");
              handleChange(ev);
            ***REMOVED******REMOVED***
            error=***REMOVED***!!(touched.applyUrl && errors.applyUrl)***REMOVED***
            helperText=***REMOVED***touched.applyUrl && errors.applyUrl***REMOVED***
          />
        </Box>
        <Box textAlign="center" px=***REMOVED***2***REMOVED*** my="auto" flexBasis=***REMOVED***["100%", "0"]***REMOVED***>
          <Typography variant="subtitle2">OR</Typography>
        </Box>
        <Box flex="1" flexBasis=***REMOVED***["100%", "0"]***REMOVED***>
          <TextField
            name="applyEmail"
            label="Apply Email*"
            variant="outlined"
            margin="normal"
            helperText="Your email address"
            fullWidth
            type="email"
            value=***REMOVED***values.applyEmail***REMOVED***
            onChange=***REMOVED***ev => ***REMOVED***
              setFieldValue("applyUrl", "");
              handleChange(ev);
            ***REMOVED******REMOVED***
            error=***REMOVED***!!(touched.applyEmail && errors.applyEmail)***REMOVED***
            helperText=***REMOVED***touched.applyEmail && errors.applyEmail***REMOVED***
          />
        </Box>
      </Box>
      <Box mt=***REMOVED***2***REMOVED*** mb=***REMOVED***1***REMOVED***>
        <FormControlLabel
          control=***REMOVED***
            <Switch
              onChange=***REMOVED***ev => setFieldValue("hasCompany", ev.target.checked)***REMOVED***
              checked=***REMOVED***values.hasCompany***REMOVED***
              color="primary"
            />
          ***REMOVED***
          label=***REMOVED***
            <Typography variant="subtitle2">This is a company job</Typography>
          ***REMOVED***
        />
      </Box>
    </Fragment>
  );
***REMOVED***
