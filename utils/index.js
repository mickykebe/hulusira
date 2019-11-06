export function tagIdsfromQueryParam(tags) ***REMOVED***
  return tags
    .split(",")
    .filter(tagId => tagId !== "" && !isNaN(Number(tagId)))
    .map(Number);
***REMOVED***

export function cleanTags(tags) ***REMOVED***
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
***REMOVED***
