export function cleanTags(tags) {
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
}
