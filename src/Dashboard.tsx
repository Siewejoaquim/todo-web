import React, { useState, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { GrFormSchedule } from "react-icons/gr";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api";
import type { Todo } from "./api";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [todoText, setTodoText] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load user from localStorage
  const [userName] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "Guest";
    try {
      const user = JSON.parse(storedUser);
      return user?.name || "Guest";
    } catch {
      return "Guest";
    }
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(Array.isArray(data) ? data : []);
  };

  const addOrUpdateTodo = async () => {
    if (!todoText.trim()) return;

    if (editIndex !== null) {
      const selectedTodo = todos[editIndex];
      await updateTodo(selectedTodo.id!, { name: todoText });
      setEditIndex(null);
    } else {
      await createTodo({ name: todoText });
    }

    setTodoText("");
    fetchTodos(); // Refresh UI
  };

  const deleteTodoItem = async (index: number) => {
    const todoToDelete = todos[index];
    await deleteTodo(todoToDelete.id!);
    fetchTodos();
  };

  const editTodoItem = (index: number) => {
    setTodoText(todos[index].name);
    setEditIndex(index);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#352323] p-10">
      <div className="flex w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white">

        {/* SIDEBAR */}
        <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-10">
              <img src="j.jpg" alt="Profile" className="h-10 w-10 rounded-full" />
              <div>
                <p className="font-semibold text-[#352323]">{userName}</p>
              </div>
            </div>

            <nav className="flex flex-col space-y-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2 mb-3 font-semibold">
                <RiCalendarScheduleLine />
                <span>Today todos</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[#C47623]">
                <GrFormSchedule />
                <span>Scheduled todos</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[#C47623]">
                <CiSettings />
                <span>Settings</span>
              </div>
            </nav>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 bg-[#C47623] p-10 flex flex-col">
          <div className="mb-8 text-white">
            <p className="text-sm opacity-80">Today main focus</p>
            <h1 className="text-2xl font-bold">Design today for today</h1>
          </div>

          {/* INPUT */}
          <div className="mb-4">
            <input
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOrUpdateTodo()}
              placeholder="What is your next todo?"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none shadow-sm"
            />
          </div>

          <button
            onClick={addOrUpdateTodo}
            className="mb-6 w-40 cursor-pointer bg-[#352323] text-white py-2 rounded-lg"
          >
            {editIndex !== null ? "Update Todo" : "Add Todo"}
          </button>

          {/* TODO LIST */}
          <div className="space-y-4 overflow-y-auto">
            {todos.map((t, index) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-white px-5 py-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-[#352323] font-medium">{t.name}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => editTodoItem(index)}
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTodoItem(index)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;