import Router, { useRouter } from "next/router";
import {
  Box,
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox
} from "@material-ui/core";
import { jobTypes, careerLevels } from "../utils/index";
import { useState, useMemo } from "react";
import queryString from "query-string";
import FilterPanel from "./filter-panel";

const useStyles = makeStyles(theme => ({
  filterList: {
    width: "100%"
  }
}));

export default function JobFilterPanels({
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
}) {
  const classes = useStyles();
  const router = useRouter();
  const parsedQS = queryString.parse(queryString.extract(router.asPath), {
    arrayFormat: "bracket"
  });
  const activeTags = parsedQS.tags || [];
  const activeJobTypes = parsedQS.jobTypes || [];
  const activeCareerLevels = parsedQS.careerLevels || [];
  const activePrimaryTags = useMemo(() => {
    return tags.filter(tag => activeTags.indexOf(tag.name) !== -1);
  }, [activeTags, tags]);

  const [tagsExpanded, setTagsExpanded] = useState(
    activePrimaryTags.length > 0
  );
  const [jobTypePanelExpanded, setJobTypePanelExpanded] = useState(
    activeJobTypes.length > 0
  );
  const [careerLevelExpanded, setCareerLevelExpanded] = useState(
    activeCareerLevels.length > 0
  );

  const handleExpansionChange = setExpansion => (_ev, isExpanded) => {
    setExpansion(isExpanded);
  };
  const handleTagToggle = tagName => ev => {
    if (ev.target.checked) {
      onCheckTagFilter(tagName);
    } else {
      onUncheckTagFilter(tagName);
    }
  };
  const handleJobTypeToggle = jobType => ev => {
    if (ev.target.checked) {
      onCheckJobTypeFilter(jobType);
    } else {
      onUncheckJobTypeFilter(jobType);
    }
  };
  const handleCareerLevelToggle = careerLevel => ev => {
    if (ev.target.checked) {
      onCheckCareerLevelFilter(careerLevel);
    } else {
      onUncheckCareerLevelFilter(careerLevel);
    }
  };

  return (
    <Box width="100%">
      {tags.length > 0 && (
        <FilterPanel
          expanded={tagsExpanded}
          onExpandChange={handleExpansionChange(setTagsExpanded)}
          title="Category"
          filterCount={activePrimaryTags.length}
          onClear={onClearTagFilter}
        >
          <List className={classes.filterList} dense>
            {tags.map(tag => {
              const labelId = `checkbox-category-${tag.name}`;
              return (
                <ListItem key={tag.name}>
                  <ListItemText
                    id={labelId}
                    primaryTypographyProps={{ variant: "caption" }}
                    primary={tag.name}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      checked={activeTags.indexOf(tag.name) !== -1}
                      onChange={handleTagToggle(tag.name)}
                      edge="end"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </FilterPanel>
      )}
      <FilterPanel
        expanded={jobTypePanelExpanded}
        onExpandChange={handleExpansionChange(setJobTypePanelExpanded)}
        title="Job Type"
        filterCount={activeJobTypes.length}
        onClear={onClearJobTypeFilter}
      >
        <List className={classes.filterList} dense>
          {jobTypes.map(jobType => {
            const labelId = `checkbox-jobType-${jobType}`;
            return (
              <ListItem key={jobType}>
                <ListItemText
                  id={labelId}
                  primaryTypographyProps={{ variant: "caption" }}
                  primary={jobType}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={activeJobTypes.indexOf(jobType) !== -1}
                    onChange={handleJobTypeToggle(jobType)}
                    edge="end"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </FilterPanel>
      <FilterPanel
        expanded={careerLevelExpanded}
        onExpandChange={handleExpansionChange(setCareerLevelExpanded)}
        title="Career Level"
        filterCount={activeCareerLevels.length}
        onClear={onClearCareerLevelFilter}
      >
        <List className={classes.filterList} dense>
          {careerLevels.map(careerLevel => {
            const labelId = `checkbox-careerLevel-${careerLevel.id}`;
            return (
              <ListItem key={careerLevel.id}>
                <ListItemText
                  id={labelId}
                  primaryTypographyProps={{ variant: "caption" }}
                  primary={careerLevel.label}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={activeCareerLevels.indexOf(careerLevel.id) !== -1}
                    onChange={handleCareerLevelToggle(careerLevel.id)}
                    edge="end"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </FilterPanel>
    </Box>
  );
}
