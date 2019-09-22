export function tagIdsfromQueryParam(tags) ***REMOVED***
  return tags
    .split(",")
    .filter(tagId => tagId !== "" && !isNaN(Number(tagId)))
    .map(Number);
***REMOVED***
