import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PomodoroContext = createContext();

export const PomodoroProvider = ({ children }) => {
  const API_URL = import.meta.env.PROD 
    ? 'https://pomodoro-api.talidigital.com.br/api'
    : 'http://localhost:5000/api';

  // --- Tasks State ---
  const [tasks, setTasks] = useState([]);

  // --- Projects State ---
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('pomodoro_projects');
    return saved ? JSON.parse(saved) : [
      { id: 'all', name: 'Todas', icon: 'all' },
      { id: 'today', name: 'Hoje', icon: 'today' },
      { id: 'tomorrow', name: 'Amanhã', icon: 'tomorrow' },
      { id: 'week', name: 'Esta Semana', icon: 'week' },
      { id: 'planned', name: 'Planejado', icon: 'planned' },
      { id: 'someday', name: 'Algum dia', icon: 'someday' },
      { id: 'completed', name: 'Concluído', icon: 'completed' },
      { id: 'inbox', name: 'Inbox', icon: 'inbox' }
    ];
  });

  const [activeTab, setActiveTab] = useState('today');

  // --- Timer State ---
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoro_settings');
    return saved ? JSON.parse(saved) : {
      focusTime: 90, // minutes (as per user screenshot)
      shortBreak: 5,
      longBreak: 15,
      cycles: 4,
      autoStartNext: false,
      autoStartBreak: false,
    };
  });

  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [cycleCount, setCycleCount] = useState(0);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
  }, [settings]);

  // --- Timer Logic ---
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        // --- Task Time Tracking ---
        if (mode === 'focus') {
          setTasks(prevTasks => 
            prevTasks.map(t => 
              t.isActiveTask && !t.completed 
                ? { ...t, timeSpent: (t.timeSpent || 0) + 1 } 
                : t
            )
          );
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, mode]);

  const handleTimerComplete = () => {
    setIsActive(false);
    // Notification logic here
    if (mode === 'focus') {
      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);
      
      // Mark current active tasks as completed or just stop tracking?
      // For now just transition mode.
      
      if (nextCycle % settings.cycles === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
      if (settings.autoStartBreak) setIsActive(true);
    } else {
      setMode('focus');
      setTimeLeft(settings.focusTime * 60);
      if (settings.autoStartNext) setIsActive(true);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? settings.focusTime * 60 : (mode === 'shortBreak' ? settings.shortBreak * 60 : settings.longBreak * 60));
  };

  // --- Task Actions ---
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      isActiveTask: false,
      timeSpent: 0,
      priority: taskData.priority || 'medium',
      project: taskData.project || 'inbox',
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate || 'today',
      pomodoros: 0,
      targetPomodoros: 1,
      notes: '',
      tags: [],
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleActiveTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isActiveTask: !t.isActiveTask } : t));
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <PomodoroContext.Provider value={{
      tasks, addTask, toggleTask, toggleActiveTask, updateTask, deleteTask,
      projects, activeTab, setActiveTab,
      settings, setSettings,
      timeLeft, setTimeLeft, isActive, toggleTimer, resetTimer, mode,
      cycleCount
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => useContext(PomodoroContext);
