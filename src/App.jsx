import React from 'react';
import { PomodoroProvider } from './PomodoroContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Timer from './components/Timer';
import AmbientPlayer from './components/AmbientPlayer';
import './App.css';

function App() {
  return (
    <PomodoroProvider>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="content-scroll">
            <TaskList />
          </div>
          <Timer />
        </main>
        <AmbientPlayer />
      </div>
    </PomodoroProvider>
  );
}

export default App;
