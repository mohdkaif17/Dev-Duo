// LocalStorage helpers for ClubVerse data

const KEYS = {
  EVENTS: 'cv_events',
  CHALLENGES: 'cv_challenges',
  SUBMISSIONS: 'cv_submissions',
  PHOTOS: 'cv_photos',
  PROJECTS: 'cv_projects'
};

// Events
export const getEvents = () => {
  return JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
};

export const saveEvents = (arr) => {
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(arr));
};

export const addEvent = (event) => {
  const events = getEvents();
  events.push({ ...event, id: event.id || Date.now().toString() });
  saveEvents(events);
  return event;
};

export const deleteEvent = (id) => {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
};

// Challenges
export const getChallenges = () => {
  return JSON.parse(localStorage.getItem(KEYS.CHALLENGES) || '[]');
};

export const saveChallenges = (arr) => {
  localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(arr));
};

export const addChallenge = (challenge) => {
  const challenges = getChallenges();
  challenges.push({ ...challenge, id: challenge.id || Date.now().toString() });
  saveChallenges(challenges);
  return challenge;
};

// Submissions
export const getSubmissions = () => {
  return JSON.parse(localStorage.getItem(KEYS.SUBMISSIONS) || '[]');
};

export const saveSubmissions = (arr) => {
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(arr));
};

export const addSubmission = (submission) => {
  const submissions = getSubmissions();
  submissions.push({
    ...submission,
    id: submission.id || Date.now().toString(),
    submittedAt: submission.submittedAt || new Date().toISOString(),
    status: submission.status || 'Pending',
    score: submission.score || null
  });
  saveSubmissions(submissions);
  return submission;
};

// Photos (Gallery)
export const getPhotos = () => {
  return JSON.parse(localStorage.getItem(KEYS.PHOTOS) || '[]');
};

export const savePhotos = (arr) => {
  localStorage.setItem(KEYS.PHOTOS, JSON.stringify(arr));
};

// Projects
export const getProjects = () => {
  return JSON.parse(localStorage.getItem(KEYS.PROJECTS) || '[]');
};

export const saveProjects = (arr) => {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(arr));
};

// Clear all data (useful for testing)
export const clearAllData = () => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};

export default {
  getEvents,
  saveEvents,
  addEvent,
  deleteEvent,
  getChallenges,
  saveChallenges,
  addChallenge,
  getSubmissions,
  saveSubmissions,
  addSubmission,
  getPhotos,
  savePhotos,
  getProjects,
  saveProjects,
  clearAllData
};
