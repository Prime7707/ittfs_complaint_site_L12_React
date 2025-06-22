import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
	baseURL: "/", // Adjust if needed
	withCredentials: true, // Important: sends cookies (XSRF-TOKEN, session)
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		"Content-Type": "application/json",
	},
});

// Dynamically attach the CSRF token from <meta> if it exists
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
if (token) {
	api.defaults.headers.common["X-CSRF-TOKEN"] = token;
}

export default api;
	