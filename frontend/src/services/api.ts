import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://finance-project-1-hjn2.onrender.com/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiClient = api;
