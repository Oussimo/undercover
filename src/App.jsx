import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import VotingScreen from "./components/VotingScreen";
import ScoreScreen from "./components/ScoreScreen";

import "./App.css";

function App() {
  return (
    <Router basename="/undercover">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:gameCode" element={<Lobby />} />
          <Route path="/game/:gameCode" element={<Game />} />
          <Route path="/voting/:gameCode" element={<VotingScreen />} />
          <Route path="/score/:gameCode" element={<ScoreScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
