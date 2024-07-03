import { ExpandOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const isEmptyOrNull = (value) => {
  if (value === "" || value === null || value === "null" || value === undefined || value === "undefined") {
    return true;
  }
  return false;
};

export const formatDateClient = (date) => {
  if (!isEmptyOrNull(date)) {
    return dayjs(date).format("DD/MM/YYYY");
  }
  return null;
};

export const formatDateServer = (date) => {
  if (!isEmptyOrNull(date)) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return null;
};

export const formatTimeServer = (time) => {
  if (!isEmptyOrNull(time)) {
    // return dayjs(time, "HH:mm:ss").format("HH:mm:ss");
    return dayjs("0000-00-00 " + time).format("HH:mm:ss");
  }
  return null;
};
export const formatTimeClient = (time) => {
  if (!isEmptyOrNull(time)) {
    // return dayjs(time, "HH:mm:ss").format("h:mm a");
    return dayjs("0000-00-00 " + time).format("h:mm a");
  }
  return null;
};

export const setUser = (user) => {
  localStorage.setItem("user", user);
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!isEmptyOrNull(user)) {
    return JSON.parse(user);
  }
  return null;
};

export const setRoleMenu = (permison_menu) => {
  localStorage.setItem("permison_menu", permison_menu);
};

export const getRoleMenu = () => {
  const permison_menu = localStorage.getItem("permison_menu");
  if (!isEmptyOrNull(permison_menu)) {
    return JSON.parse(permison_menu);
  }
  return null;
};

export const setIsLogin = (value) => {
  // 1 | 0
  localStorage.setItem("is_login", value);
};

export const getIsLogin = () => {
  const isLogin = localStorage.getItem("is_login");
  if (isLogin === "1") {
    return true;
  }
  return false;
};

export const setAccessToken = (access_token) => {
  localStorage.setItem("access_token", access_token);
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setRefreshToken = (refresh_token) => {
  localStorage.setItem("refresh_token", refresh_token);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const setUserConfig = (config) => {
  localStorage.setItem("config", config);
};

export const getUserConfig = () => {
  // status_type
  // discount_type
  // learning_type
  // classroom_status
  // classroom_shiff
  // payment_method
  var config = localStorage.getItem("config");
  if (!isEmptyOrNull(config)) {
    return JSON.parse(config);
  }
  return null;
};

export const logout = () => {
  setUser("");
  setIsLogin("0");
  setAccessToken("");
  setRefreshToken("");
  window.location.href = "login";
};
