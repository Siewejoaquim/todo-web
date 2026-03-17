import { apiClient } from "./utils";

// Core types aligned with backend
export type Todo = {
  id: string;
  name: string;
};

type RawTodo = {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
};

const mapTodo = (raw: RawTodo): Todo => ({
  id: raw._id,
  name: raw.title,
});

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Todo APIs
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const res = await apiClient.get<RawTodo[]>("/todos", {
      headers: authHeader(),
    });
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(mapTodo);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

export const createTodo = async (todo: { name: string }): Promise<Todo | undefined> => {
  try {
    const res = await apiClient.post<RawTodo>(
      "/todos",
      {
        title: todo.name,
        description: "",
      },
      { headers: authHeader() }
    );
    return mapTodo(res.data);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

export const updateTodo = async (id: string, todo: { name: string }): Promise<Todo | undefined> => {
  try {
    const res = await apiClient.patch<RawTodo>(
      `/todos/${id}`,
      {
        title: todo.name,
      },
      { headers: authHeader() }
    );
    return mapTodo(res.data);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/todos/${id}`, { headers: authHeader() });
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Auth APIs
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const registerUser = async (user: { name: string; email: string; password: string }) => {
  try {
    const res = await apiClient.post("/auth/register", user);
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};