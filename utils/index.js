export function tagIdsfromQueryParam(tags) {
  return tags
    .split(",")
    .filter(tagId => tagId !== "" && !isNaN(Number(tagId)))
    .map(Number);
}

export function cleanTags(tags) {
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
}
