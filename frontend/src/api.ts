import { apiClient } from "./utils";

export type Todo = {
  id: string;
  title: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  completed: boolean;
  createdAt: string;
};

type RawTodo = {
  _id: string;
  title: string;
  date: string;
  time: string;
  completed?: boolean;
  createdAt?: string;
};

const mapTodo = (raw: RawTodo): Todo => ({
  id: raw._id,
  title: raw.title,

  date: raw.date ? raw.date.slice(0, 10) : "",
  time: raw.time ? raw.time.slice(0, 5) : "00:00",
  completed: raw.completed === true, 
  createdAt: raw.createdAt ?? new Date().toISOString(),
});

export const getTodos = async (type: "today" | "scheduled" | "completed" = "today"): Promise<Todo[]> => {
  try {
    const res = await apiClient.get<RawTodo[]>(`/todos?type=${type}`);
    return Array.isArray(res.data) ? res.data.map(mapTodo) : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

export const createTodo = async (todo: {
  title: string;
  date: string;
  time: string;
}): Promise<Todo | undefined> => {
  try {
    const res = await apiClient.post<RawTodo>("/todos", todo);
    return mapTodo(res.data);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

export const updateTodo = async (
  id: string,
  data: { title?: string; date?: string; time?: string; completed?: boolean }
): Promise<Todo | undefined> => {
  try {
    const res = await apiClient.patch<RawTodo>(`/todos/${id}`, data);
    return mapTodo(res.data);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

export const completeTodo = async (id: string): Promise<void> => {
  await apiClient.patch(`/todos/${id}`, { completed: true });
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/todos/${id}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

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
