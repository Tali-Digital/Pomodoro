import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PomodoroContext = createContext();

export const PomodoroProvider = ({ children }) => {
  const API_URL = import.meta.env.PROD 
    ? 'https://pomodoro-api.talidigital.com.br/api' // Exemplo de URL de produção
    : 'http://localhost:5000/api';

  // --- Tasks State ---
  const [tasks, setTasks] = useState([]);

  // Fetch from API on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tasks`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTasks(data.map(t => ({ 
            ...t, 
            completed: !!t.completed,
            dueDate: t.due_date 
          })));
        } else {
          loadFromLocal();
        }
      } catch (err) {
        console.warn('API error, falling back to local storage');
        loadFromLocal();
      }
    };
    
    const loadFromLocal = () => {
      const saved = localStorage.getItem('pomodoro_tasks');
      if (saved) setTasks(JSON.parse(saved));
    };

    fetchTasks();
  }, []);

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
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    // Notification logic here
    if (mode === 'focus') {
      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);
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
  const addTask = async (taskData) => {
    const newTask = {
      title: taskData.title,
      priority: taskData.priority || 'medium',
      project: taskData.project || 'inbox',
      due_date: taskData.dueDate || 'today',
    };

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const savedTask = await res.json();
      const mappedTask = { ...savedTask, completed: !!savedTask.completed, dueDate: savedTask.due_date };
      setTasks([mappedTask, ...tasks]);
    } catch (err) {
      setTasks([{ ...newTask, id: Date.now().toString(), completed: false }, ...tasks]);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    try {
      await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
    } catch (err) {
      console.error('Failed to sync toggle');
    }
  };

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));

    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to sync delete');
    }
  };

  return (
    <PomodoroContext.Provider value={{
      tasks, addTask, toggleTask, deleteTask,
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
