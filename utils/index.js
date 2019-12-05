export function cleanTags(tags) {
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
}

const careerLevels = [
  {
    id: "entry",
    label: "Entry Level (Fresh Graduate)"
  },
  {
    id: "junior",
    label: "Junior Level (1+ - 2 years experience)"
  },
  {
    id: "mid",
    label: "Mid Level (2+ - 5 years experience)"
  },
  {
    id: "senior",
    label: "Senior Level (5+ years experience)"
  },
  {
    id: "manager",
    label: "Managerial Level (Manager, Supervisor, Director)"
  },
  {
    id: "executive",
    label: "Executive (VP, General Manager)"
  },
  {
    id: "senior-executive",
    label: "Senior Executive (CEO, Country Manager, General Manager)"
  }
];

export function careerLevelLabel(careerLevel) {
  const level = careerLevels.find(level => level.id === careerLevel);
  return level ? level.label : "";
}
