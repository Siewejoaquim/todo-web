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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ add completed locally
  const [todos, setTodos] = useState<(Todo & { completed?: boolean })[]>([]);

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, [navigate]);

  const fetchTodos = async () => {
    const data = await getTodos();

    // ✅ add completed = false by default
    const updated = Array.isArray(data)
      ? data.map((t) => ({ ...t, completed: false }))
      : [];

    setTodos(updated);
  };

  const addOrUpdateTodo = async () => {
    if (!todoText.trim()) return;

    if (editIndex !== null) {
      const selectedTodo = todos[editIndex];
      await updateTodo(selectedTodo.id, { name: todoText });
      setEditIndex(null);
    } else {
      await createTodo({ name: todoText });
    }

    setTodoText("");
    fetchTodos();
  };

  const deleteTodoItem = async (index: number) => {
    const todoToDelete = todos[index];
    if (!todoToDelete.id) return;
    await deleteTodo(todoToDelete.id);
    fetchTodos();
  };

  const editTodoItem = (index: number) => {
    setTodoText(todos[index].name);
    setEditIndex(index);
  };

  // ✅ toggle completed (frontend only)
  const toggleTodo = (index: number) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#352323] md:p-10 p-0">
      <div className="flex w-full h-full md:rounded-2xl overflow-hidden shadow-2xl bg-white relative">

        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between bg-gray-100 px-4 py-3 w-full absolute top-0 left-0 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#352323] text-2xl font-bold">
            ☰
          </button>
          <p className="font-semibold text-[#352323]">{userName}</p>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
            Logout
          </button>
        </div>

        {/* SIDEBAR OVERLAY (mobile) */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static top-0 left-0 h-full z-20
            w-64 bg-gray-100 p-6 flex flex-col justify-between
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <div>
            <div className="flex items-center space-x-3 mb-10 mt-2 md:mt-0">
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
            className="hidden md:block bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 bg-[#C47623] p-5 md:p-10 flex flex-col pt-16 md:pt-10">
          <div className="mb-6 md:mb-8 text-white">
            <p className="text-sm opacity-80">Today main focus</p>
            <h1 className="text-xl md:text-2xl font-bold">Today's todos</h1>
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
            className="mb-6 w-full sm:w-40 cursor-pointer bg-[#352323] text-white py-2 rounded-lg"
          >
            {editIndex !== null ? "Update Todo" : "Add Todo"}
          </button>

          {/* TODO LIST */}
          <div className="space-y-3 overflow-y-auto">
            {todos.map((t, index) => (
              <div
                key={t.id ?? index}
                className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm gap-2"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={t.completed || false}
                    onChange={() => toggleTodo(index)}
                    className="shrink-0"
                  />
                  <span
                    className={`font-medium truncate ${
                      t.completed ? "line-through text-gray-400" : "text-[#352323]"
                    }`}
                  >
                    {t.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
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