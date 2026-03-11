import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./style.css";

const App = () => {
  const [message, setMessage] = useState("");

  const fetchFortune = async () => {
    try {
      const res = await fetch("/api/fortune");
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("failed to get fortune cookie", err);
    }
  };
  return (
    <div>
      {message ? (
        <div className="flex justify-center items-center flex-col">
          <div>Message: {message}</div>
          <button onClick={fetchFortune}>Refetch</button>
        </div>
      ) : (
        <button onClick={fetchFortune}>Get Fortune</button>
      )}
    </div>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
