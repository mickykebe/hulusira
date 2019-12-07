import Router, ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import ***REMOVED***
  Box,
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox
***REMOVED*** from "@material-ui/core";
import ***REMOVED*** jobTypes, careerLevels ***REMOVED*** from "../utils/index";
import ***REMOVED*** useState, useMemo ***REMOVED*** from "react";
import queryString from "query-string";
import FilterPanel from "./filter-panel";

const useStyles = makeStyles(theme => (***REMOVED***
  filterList: ***REMOVED***
    width: "100%"
  ***REMOVED***
***REMOVED***));

export default function JobFilterPanels(***REMOVED***
  tags = [],
  onCheckTagFilter,
  onUncheckTagFilter,
  onCheckJobTypeFilter,
  onUncheckJobTypeFilter,
  onCheckCareerLevelFilter,
  onUncheckCareerLevelFilter,
  onClearTagFilter,
  onClearJobTypeFilter,
  onClearCareerLevelFilter
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const router = useRouter();
  const parsedQS = queryString.parse(queryString.extract(router.asPath), ***REMOVED***
    arrayFormat: "bracket"
  ***REMOVED***);
  const activeTags = parsedQS.tags || [];
  const activeJobTypes = parsedQS.jobTypes || [];
  const activeCareerLevels = parsedQS.careerLevels || [];
  const activePrimaryTags = useMemo(() => ***REMOVED***
    return tags.filter(tag => activeTags.indexOf(tag.name) !== -1);
  ***REMOVED***, [activeTags, tags]);

  const [tagsExpanded, setTagsExpanded] = useState(
    activePrimaryTags.length > 0
  );
  const [jobTypePanelExpanded, setJobTypePanelExpanded] = useState(
    activeJobTypes.length > 0
  );
  const [careerLevelExpanded, setCareerLevelExpanded] = useState(
    activeCareerLevels.length > 0
  );

  const handleExpansionChange = setExpansion => (_ev, isExpanded) => ***REMOVED***
    setExpansion(isExpanded);
  ***REMOVED***;
  const handleTagToggle = tagName => ev => ***REMOVED***
    if (ev.target.checked) ***REMOVED***
      onCheckTagFilter(tagName);
    ***REMOVED*** else ***REMOVED***
      onUncheckTagFilter(tagName);
    ***REMOVED***
  ***REMOVED***;
  const handleJobTypeToggle = jobType => ev => ***REMOVED***
    if (ev.target.checked) ***REMOVED***
      onCheckJobTypeFilter(jobType);
    ***REMOVED*** else ***REMOVED***
      onUncheckJobTypeFilter(jobType);
    ***REMOVED***
  ***REMOVED***;
  const handleCareerLevelToggle = careerLevel => ev => ***REMOVED***
    if (ev.target.checked) ***REMOVED***
      onCheckCareerLevelFilter(careerLevel);
    ***REMOVED*** else ***REMOVED***
      onUncheckCareerLevelFilter(careerLevel);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Box width="100%">
      ***REMOVED***tags.length > 0 && (
        <FilterPanel
          expanded=***REMOVED***tagsExpanded***REMOVED***
          onExpandChange=***REMOVED***handleExpansionChange(setTagsExpanded)***REMOVED***
          title="Category"
          filterCount=***REMOVED***activePrimaryTags.length***REMOVED***
          onClear=***REMOVED***onClearTagFilter***REMOVED***
        >
          <List className=***REMOVED***classes.filterList***REMOVED*** dense>
            ***REMOVED***tags.map(tag => ***REMOVED***
              const labelId = `checkbox-category-$***REMOVED***tag.name***REMOVED***`;
              return (
                <ListItem key=***REMOVED***tag.name***REMOVED***>
                  <ListItemText
                    id=***REMOVED***labelId***REMOVED***
                    primaryTypographyProps=***REMOVED******REMOVED*** variant: "caption" ***REMOVED******REMOVED***
                    primary=***REMOVED***tag.name***REMOVED***
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      checked=***REMOVED***activeTags.indexOf(tag.name) !== -1***REMOVED***
                      onChange=***REMOVED***handleTagToggle(tag.name)***REMOVED***
                      edge="end"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            ***REMOVED***)***REMOVED***
          </List>
        </FilterPanel>
      )***REMOVED***
      <FilterPanel
        expanded=***REMOVED***jobTypePanelExpanded***REMOVED***
        onExpandChange=***REMOVED***handleExpansionChange(setJobTypePanelExpanded)***REMOVED***
        title="Job Type"
        filterCount=***REMOVED***activeJobTypes.length***REMOVED***
        onClear=***REMOVED***onClearJobTypeFilter***REMOVED***
      >
        <List className=***REMOVED***classes.filterList***REMOVED*** dense>
          ***REMOVED***jobTypes.map(jobType => ***REMOVED***
            const labelId = `checkbox-jobType-$***REMOVED***jobType***REMOVED***`;
            return (
              <ListItem key=***REMOVED***jobType***REMOVED***>
                <ListItemText
                  id=***REMOVED***labelId***REMOVED***
                  primaryTypographyProps=***REMOVED******REMOVED*** variant: "caption" ***REMOVED******REMOVED***
                  primary=***REMOVED***jobType***REMOVED***
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked=***REMOVED***activeJobTypes.indexOf(jobType) !== -1***REMOVED***
                    onChange=***REMOVED***handleJobTypeToggle(jobType)***REMOVED***
                    edge="end"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          ***REMOVED***)***REMOVED***
        </List>
      </FilterPanel>
      <FilterPanel
        expanded=***REMOVED***careerLevelExpanded***REMOVED***
        onExpandChange=***REMOVED***handleExpansionChange(setCareerLevelExpanded)***REMOVED***
        title="Career Level"
        filterCount=***REMOVED***activeCareerLevels.length***REMOVED***
        onClear=***REMOVED***onClearCareerLevelFilter***REMOVED***
      >
        <List className=***REMOVED***classes.filterList***REMOVED*** dense>
          ***REMOVED***careerLevels.map(careerLevel => ***REMOVED***
            const labelId = `checkbox-careerLevel-$***REMOVED***careerLevel.id***REMOVED***`;
            return (
              <ListItem key=***REMOVED***careerLevel.id***REMOVED***>
                <ListItemText
                  id=***REMOVED***labelId***REMOVED***
                  primaryTypographyProps=***REMOVED******REMOVED*** variant: "caption" ***REMOVED******REMOVED***
                  primary=***REMOVED***careerLevel.label***REMOVED***
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked=***REMOVED***activeCareerLevels.indexOf(careerLevel.id) !== -1***REMOVED***
                    onChange=***REMOVED***handleCareerLevelToggle(careerLevel.id)***REMOVED***
                    edge="end"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          ***REMOVED***)***REMOVED***
        </List>
      </FilterPanel>
    </Box>
  );
***REMOVED***
