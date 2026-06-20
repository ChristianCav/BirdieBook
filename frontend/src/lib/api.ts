import api from "./axios";

// User
export const syncUser = async (userData: any) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

export const getUserById = async (userId: string) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const updateUser = async (userId: string, userData: any) => {
  const { data } = await api.put(`/users/${userId}`, userData);
  return data;
};

export const getUserRounds = async (userId: string) => {
  const { data } = await api.get(`/users/${userId}/rounds`);
  return data;
};

// Courses
export const getCourses = async () => {
  const { data } = await api.get("/courses");
  return data;
};

export const getCourseById = async (courseId: string) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data;
};

export const createCourse = async (courseData: any) => {
  const { data } = await api.post("/courses", courseData);
  return data;
};

export const updateCourse = async (courseId: string, courseData: any) => {
  const { data } = await api.put(`/courses/${courseId}`, courseData);
  return data;
};

export const deleteCourse = async (courseId: string) => {
  const { data } = await api.delete(`/courses/${courseId}`);
  return data;
};

// Course holes
export const getCourseHoleById = async (courseHoleId: string) => {
  const { data } = await api.get(`/courseHoles/${courseHoleId}`);
  return data;
};

export const getCourseHolesByCourseId = async (courseId: string) => {
  const { data } = await api.get(`/courseHoles/course/${courseId}`);
  return data;
};

export const createCourseHole = async (courseHoleData: any) => {
  const { data } = await api.post("/courseHoles", courseHoleData);
  return data;
};

export const updateCourseHole = async (
  courseHoleId: string,
  courseHoleData: any,
) => {
  const { data } = await api.put(
    `/courseHoles/${courseHoleId}`,
    courseHoleData,
  );
  return data;
};

export const deleteCourseHole = async (courseHoleId: string) => {
  const { data } = await api.delete(`/courseHoles/${courseHoleId}`);
  return data;
};

// Tee sets
export const getTeeSetById = async (teeSetId: string) => {
  const { data } = await api.get(`/teeSets/${teeSetId}`);
  return data;
};

export const getTeeSetsByCourseId = async (courseId: string) => {
  const { data } = await api.get(`/teeSets/course/${courseId}`);
  return data;
};

export const createTeeSet = async (teeSetData: any) => {
  const { data } = await api.post("/teeSets", teeSetData);
  return data;
};

export const updateTeeSet = async (teeSetId: string, teeSetData: any) => {
  const { data } = await api.put(`/teeSets/${teeSetId}`, teeSetData);
  return data;
};

export const deleteTeeSet = async (teeSetId: string) => {
  const { data } = await api.delete(`/teeSets/${teeSetId}`);
  return data;
};

// Tee set holes
export const getTeeSetHoleById = async (teeSetHoleId: string) => {
  const { data } = await api.get(`/teeSetHoles/${teeSetHoleId}`);
  return data;
};

export const getTeeSetHolesByTeeSetId = async (teeSetId: string) => {
  const { data } = await api.get(`/teeSetHoles/teeSet/${teeSetId}`);
  return data;
};

export const createTeeSetHole = async (teeSetHoleData: any) => {
  const { data } = await api.post("/teeSetHoles", teeSetHoleData);
  return data;
};

export const updateTeeSetHole = async (
  teeSetHoleId: string,
  teeSetHoleData: any,
) => {
  const { data } = await api.put(
    `/teeSetHoles/${teeSetHoleId}`,
    teeSetHoleData,
  );
  return data;
};

export const deleteTeeSetHole = async (teeSetHoleId: string) => {
  const { data } = await api.delete(`/teeSetHoles/${teeSetHoleId}`);
  return data;
};

// Rounds
export const getRoundById = async (roundId: string) => {
  const { data } = await api.get(`/rounds/${roundId}`);
  return data;
};

export const createRound = async (roundData: any) => {
  const { data } = await api.post("/rounds", roundData);
  return data;
};

export const updateRound = async (roundId: string, roundData: any) => {
  const { data } = await api.put(`/rounds/${roundId}`, roundData);
  return data;
};

export const deleteRound = async (roundId: string) => {
  const { data } = await api.delete(`/rounds/${roundId}`);
  return data;
};

// Round holes
export const getRoundHoleById = async (roundHoleId: string) => {
  const { data } = await api.get(`/rounds/holes/${roundHoleId}`);
  return data;
};

export const getRoundHolesByRoundId = async (roundId: string) => {
  const { data } = await api.get(`/rounds/${roundId}/holes`);
  return data;
};

export const createRoundHole = async (roundHoleData: any) => {
  const { data } = await api.post("/rounds/holes", roundHoleData);
  return data;
};

export const updateRoundHole = async (
  roundHoleId: string,
  roundHoleData: any,
) => {
  const { data } = await api.put(`/rounds/holes/${roundHoleId}`, roundHoleData);
  return data;
};

export const deleteRoundHole = async (roundHoleId: string) => {
  const { data } = await api.delete(`/rounds/holes/${roundHoleId}`);
  return data;
};

export default api;
