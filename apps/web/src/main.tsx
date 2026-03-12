import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import "./style.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos", {
        method: "GET"
      });
      const data = await res.json();
      setTodos(data.todos);
    } catch (err) {
      console.error("failed to get todos", err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return;
    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newTodo,
        })
      });
      fetchTodos();
      setNewTodo("");
    } catch (err) {
      console.error("failed to add todo", err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (err) {
      console.error("failed to delete todo", err);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="empty">No todos yet. Add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-text">{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
