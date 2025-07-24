import React from "react";
import ReactDOM from "react-dom/client";

// Example main component using improved styles
function App() {
  return (
    <main className="section">
      <h1 className="heading-xl animate-fade-in">
        Welcome to Safety Sister Alert
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="card animate-scale-in hover-glow">
          <h2 className="heading-lg">Stay Protected</h2>
          <p>
            Get instant alerts and emergency help at your fingertips. Your safety is our priority.
          </p>
          <button className="btn-primary mt-4">Get Protected Now</button>
        </div>
        <div className="card-emergency card animate-scale-in hover-glow">
          <h2 className="heading-lg">Emergency Mode</h2>
          <p>
            Activate emergency mode to notify trusted contacts and authorities immediately.
          </p>
          <button className="btn-emergency mt-4">Activate Emergency</button>
        </div>
      </div>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);