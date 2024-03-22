import React, { useEffect } from "react";
import AudioDropDisplay from "./AudioDropDisplay";
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    document.title = "S2T Application"; // Title Page
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>S2T Assistance</h1> {/* Visual title for the page */}
        <AudioDropDisplay />
      </header>
    </div>
  );
};

export default App;
