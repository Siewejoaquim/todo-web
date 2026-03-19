import React, { useState, useEffect } from "react";
import { GrFormSchedule } from "react-icons/gr";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getTodos, createTodo, updateTodo, completeTodo, deleteTodo } from "./api";
import type { Todo } from "./api";

import { useAuth } from "./context/AuthContext";

type View = "today" | "scheduled" | "completed";

const todayStr = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);

const formatDate = (date: string, time: string) => {
  if (!date || !time) return "";
  // date is "YYYY-MM-DD", time is "HH:MM"
  // append Z to treat as UTC-neutral local parse
  const d = new Date(`${date}T${time}`);
  if (isNaN(d.getTime())) return `${date} ${time}`;
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};


interface ModalProps {
  view: View;
  initial?: Todo | null;
  onClose: () => void;
  onSave: () => void;
}

const TodoModal: React.FC<ModalProps> = ({ view, initial, onClose, onSave }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate]   = useState(initial?.date  ?? todayStr());
  const [time, setTime]   = useState(initial?.time  ?? nowTime());
  const [saving, setSaving] = useState(false);

  const minDate = todayStr();
  // if selected date is today, min time is current time; otherwise no restriction
  const minTime = date === todayStr() ? nowTime() : undefined;

  const isTimeInPast = date === todayStr() && time < nowTime();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) return;
    if (isTimeInPast) return;
    setSaving(true);
    if (initial) {
      await updateTodo(initial.id, { title, date, time });
    } else {
      await createTodo({ title, date, time });
    }
    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-[#352323] mb-5">
          {initial ? "Edit Todo" : view === "scheduled" ? "Schedule a Todo" : "Add a Todo"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              minLength={5}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C47623]"
            />
            {title.trim().length > 0 && title.trim().length < 5 && (
              <p className="text-red-500 text-xs mt-1">Title must be at least 5 characters.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C47623]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={time}
              min={minTime}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C47623]"
            />
            {isTimeInPast && (
              <p className="text-red-500 text-xs mt-1">Time has already passed for today.</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || isTimeInPast}
              className="flex-1 bg-[#C47623] text-white py-2 rounded-lg font-medium hover:bg-black transition disabled:opacity-50"
            >
              {saving ? "Saving..." : initial ? "Update" : "Save"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-black hover:text-white transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const [view, setView]               = useState<View>("today");
  const [todos, setTodos]             = useState<Todo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTodo, setEditTodo]       = useState<Todo | null>(null);

  useEffect(() => { fetchTodos(); }, [view]);

  const fetchTodos = async () => {
    const data = await getTodos(view);
    setTodos(data);
  };

  const openAdd    = () => { setEditTodo(null); setModalOpen(true); };
  const openEdit   = (t: Todo) => { setEditTodo(t); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTodo(null); };

  const handleCheck  = async (t: Todo) => { await completeTodo(t.id); fetchTodos(); };
  const handleDelete = async (id: string) => { await deleteTodo(id); fetchTodos(); };
  const logout = () => { authLogout(); navigate("/login"); };
  const switchView = (v: View) => { setView(v); setSidebarOpen(false); };

  const navBtn = (v: View, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => switchView(v)}
      className={`flex items-center space-x-2 w-full text-left hover:text-[#C47623] transition-colors
        ${view === v ? "font-semibold text-[#C47623]" : "text-gray-700"}`}
    >
      {icon}<span>{label}</span>
    </button>
  );


  return (
    <div className="h-screen flex overflow-hidden">

        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between bg-gray-100 px-4 py-3 w-full absolute top-0 left-0 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#352323] text-2xl font-bold">☰</button>
          <p className="font-semibold text-[#352323]">{user?.name ?? "Guest"}</p>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-black transition">Logout</button>
        </div>

        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-10" onClick={() => setSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`
          fixed md:static top-0 left-0 h-full z-20 w-64 bg-gray-100 p-6 flex flex-col justify-between
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}>
          <div>
            <div className="flex items-center space-x-3 mb-10 mt-2 md:mt-0">
              <div className="h-10 w-10 rounded-full bg-[#C47623] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <p className="font-semibold text-[#352323]">{user?.name ?? "Guest"}</p>
            </div>
            <nav className="flex flex-col space-y-5 text-base">
              {navBtn("today",     <RiCalendarScheduleLine size={18} />, "Today todos")}
              {navBtn("scheduled", <GrFormSchedule size={18} />,         "Scheduled todos")}
              {navBtn("completed", <BsCheckCircle size={18} />,          "Completed todos")}
            </nav>
          </div>
          <button onClick={logout} className="hidden md:block bg-[#C47623] text-white py-2 rounded-lg hover:bg-black transition">
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 bg-[#C47623] p-5 md:p-10 flex flex-col pt-16 md:pt-10 overflow-hidden">
          <div className="mb-6 text-white shrink-0">
            <p className="text-sm opacity-80">
              {view === "today" ? "Today's focus" : view === "scheduled" ? "Upcoming" : "Done & dusted"}
            </p>
            <h1 className="text-xl md:text-2xl font-bold capitalize">{view} todos</h1>
          </div>

          {view !== "completed" && (
            <button
              onClick={openAdd}
              className="mb-6 shrink-0 w-full sm:w-44 bg-[#352323] text-white py-2 rounded-lg font-medium hover:bg-black transition"
            >
              + Add Todo
            </button>
          )}

          {/* SCROLLABLE TODO LIST ONLY */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {todos.length === 0 && (
              <p className="text-white/70 text-sm">
                {view === "today" ? "No todos for today." : view === "scheduled" ? "No scheduled todos." : "No completed todos yet."}
              </p>
            )}
            {todos.map((t) => (
              <div key={t.id} className="flex items-start justify-between bg-white px-4 py-3 rounded-lg shadow-sm gap-2">
                <div className="flex items-start space-x-3 min-w-0">
                  {view !== "completed" && (
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleCheck(t)}
                      className="shrink-0 mt-1 cursor-pointer"
                    />
                  )}
                  <div className="min-w-0">
                    <span className={`font-medium block truncate ${view === "completed" ? "line-through text-gray-400" : "text-[#352323]"}`}>
                      {t.title}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(t.date, t.time)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  {view !== "completed" && (
                    <button onClick={() => openEdit(t)} className="text-blue-500 hover:text-blue-700" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700" title="Delete">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

      {modalOpen && (
        <TodoModal view={view} initial={editTodo} onClose={closeModal} onSave={fetchTodos} />
      )}
    </div>
  );
};

export default Dashboard;
