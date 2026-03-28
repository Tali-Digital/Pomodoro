import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash, MoreVertical, LayoutGrid, Clock, Calendar } from 'lucide-react';
import { usePomodoro } from '../PomodoroContext';

const TaskList = () => {
  const { tasks, addTask, toggleTask, deleteTask, activeTab } = usePomodoro();
  const [inputValue, setInputValue] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'today') return !task.completed; // Simple filter for now
    return !task.completed;
  });

  const completedTasks = tasks.filter(task => task.completed && activeTab !== 'completed');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTask({ title: inputValue });
      setInputValue('');
    }
  };

  const TaskItem = ({ task }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`task-item ${task.completed ? 'completed' : ''}`}
    >
      <button className={`task-check ${task.completed ? 'active' : ''}`} onClick={() => toggleTask(task.id)}>
        <Check size={14} />
      </button>
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <Calendar size={12} />
          <span>{task.dueDate}</span>
        </div>
      </div>
      <div className={`task-priority ${task.priority}`}></div>
      <button className="delete-task" onClick={() => deleteTask(task.id)}>
        <Trash size={14} />
      </button>
    </motion.div>
  );

  return (
    <div className="task-list-container">
      <div className="task-add-section">
        <div className="task-add-input">
          <Plus size={18} color="#777" />
          <input 
            type="text" 
            placeholder='Adicionar uma tarefa no "Tarefas", aperte "Enter" para salvar' 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="task-input-utils">
             <Clock size={16} /> <Calendar size={16} /> <LayoutGrid size={16} /> 
          </div>
        </div>
      </div>

      <div className="tasks-section">
        <div className="section-label">Tarefas • {filteredTasks.length * 25}min</div>
        <AnimatePresence>
          {filteredTasks.map(task => <TaskItem key={task.id} task={task} />)}
        </AnimatePresence>
      </div>

      {completedTasks.length > 0 && (
        <div className="tasks-section completed-tasks">
          <button className="toggle-completed" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? 'Ocultar tarefas concluídas ▲' : 'Mostrar tarefas concluídas ▼'}
          </button>
          <AnimatePresence>
            {showCompleted && completedTasks.map(task => <TaskItem key={task.id} task={task} />)}
          </AnimatePresence>
        </div>
      )}

      <style>{`
        .task-list-container {
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .task-add-input {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          padding: 12px 16px;
          border-radius: 8px;
          width: 100%;
        }
        .task-add-input input { flex: 1; font-size: 14px; color: var(--text-main); }
        .task-add-input input::placeholder { color: var(--text-dim); }
        .task-input-utils { display: flex; gap: 12px; opacity: 0.5; cursor: pointer; }
        
        .section-label { font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; margin-bottom: 8px; }
        
        .task-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: var(--transition);
        }
        .task-item:hover { background: rgba(255, 255, 255, 0.05); }
        .task-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #555;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .task-check.active { background: #34d399; border-color: #34d399; }
        .task-check svg { opacity: 0; }
        .task-check.active svg { opacity: 1; color: #fff; }
        
        .task-content { flex: 1; }
        .task-title { font-size: 14px; margin-bottom: 2px; }
        .task-item.completed .task-title { text-decoration: line-through; color: #555; }
        .task-meta { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #555; }
        
        .task-priority { width: 4px; height: 16px; border-radius: 2px; }
        .task-priority.high { background: var(--status-high); }
        .task-priority.medium { background: var(--status-medium); }
        .task-priority.low { background: var(--status-low); }
        
        .delete-task { opacity: 0; transition: 0.2s; color: #555; }
        .task-item:hover .delete-task { opacity: 1; }
        .delete-task:hover { color: var(--status-high); }
        
        .toggle-completed {
          width: 100%;
          text-align: center;
          padding: 8px;
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
        .toggle-completed:hover { color: #888; }
      `}</style>
    </div>
  );
};

export default TaskList;
