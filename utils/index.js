export function cleanTags(tags) ***REMOVED***
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
***REMOVED***

export const careerLevels = [
  ***REMOVED***
    id: "entry",
    label: "Entry Level (Fresh Graduate)"
  ***REMOVED***,
  ***REMOVED***
    id: "junior",
    label: "Junior Level (1-2 years experience)"
  ***REMOVED***,
  ***REMOVED***
    id: "mid",
    label: "Mid Level (2-5 years experience)"
  ***REMOVED***,
  ***REMOVED***
    id: "senior",
    label: "Senior Level (5+ years experience)"
  ***REMOVED***,
  ***REMOVED***
    id: "manager",
    label: "Managerial Level (Manager, Supervisor, Director)"
  ***REMOVED***,
  ***REMOVED***
    id: "executive",
    label: "Executive (VP, General Manager)"
  ***REMOVED***,
  ***REMOVED***
    id: "senior-executive",
    label: "Senior Executive (CEO, Country Manager, General Manager)"
  ***REMOVED***
];

export function careerLevelLabel(careerLevel) ***REMOVED***
  const level = careerLevels.find(level => level.id === careerLevel);
  return level ? level.label : "";
***REMOVED***
