import axios from "axios";

export const api = axios.create({
  baseURL: process.env.GITHUB_USER_CONTENT_URL,
});
