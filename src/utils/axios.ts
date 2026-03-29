import axios from "axios";

const BASE_URL =
	import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000";

const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

export default api;
