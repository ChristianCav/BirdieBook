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

export const getUserRoundsByCourse = async (
  userId: string,
  courseId: string,
) => {
  const { data } = await api.get(`/users/${userId}/rounds`, {
    params: { courseId },
  });
  return data;
};

// Courses
export const getAllCourses = async () => {
  const { data } = await api.get("/courses");
  return data;
};

export const getMyCourses = async () => {
  const { data } = await api.get("/courses/me");
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

export const addCourseToUser = async (courseId: string) => {
  const { data } = await api.post(`/courses/${courseId}/add`);
  return data;
};

export const removeCourseFromUser = async (courseId: string) => {
  const { data } = await api.delete(`/courses/${courseId}/remove`);
  return data;
};

export default api;
