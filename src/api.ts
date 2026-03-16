import axios from "axios";

const API = "https://login-web-nu1s.onrender.com"; 
const getToken = () => localStorage.getItem("token");

// Types
export type Todo = {
  id?: string;
  name: string;
};

// Todo APIs
export const getTodos = async () => {
  try {
    const res = await axios.get(`${API}/todos`, { headers: { Authorization: `Bearer ${getToken()}` } });
    return res.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

export const createTodo = async (todo: { name: string }) => {
  try {
    const res = await axios.post(`${API}/todos`, todo, { headers: { Authorization: `Bearer ${getToken()}` } });
    return res.data;
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

export const updateTodo = async (id: string, todo: { name: string }) => {
  try {
    const res = await axios.put(`${API}/todos/${id}`, todo, { headers: { Authorization: `Bearer ${getToken()}` } });
    return res.data;
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

export const deleteTodo = async (id: string) => {
  try {
    await axios.delete(`${API}/todos/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Auth APIs
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${API}/auth/login`, credentials);
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const registerUser = async (user: { name: string; email: string; password: string }) => {
  try {
    const res = await axios.post(`${API}/auth/register`, user);
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};