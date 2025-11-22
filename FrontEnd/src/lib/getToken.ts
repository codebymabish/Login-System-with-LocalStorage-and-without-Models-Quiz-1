export const getToken = () => {
  // change key here if you store token under a different localStorage key
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};