export function setJobAdminToken(id, adminToken) {
  localStorage.setItem(`jobToken-${id}`, adminToken);
}

export function getJobAdminToken(id) {
  return localStorage.getItem(`jobToken-${id}`);
}
