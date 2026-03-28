import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Folder, Bell, RefreshCw, 
  Flag, Tag, Plus, MessageSquare, Play, 
  CheckCircle2, Clock, Trash2 
} from 'lucide-react';
import { usePomodoro } from '../PomodoroContext';

const TaskModal = ({ task, isOpen, onClose }) => {
  const { updateTask, deleteTask } = usePomodoro();
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!isOpen || !editedTask) return null;

  const handleUpdate = (updates) => {
    const newDoc = { ...editedTask, ...updates };
    setEditedTask(newDoc);
    updateTask(task.id, updates);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="task-detail-panel glass"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="status-toggle">
              <CheckCircle2 size={20} className={editedTask.completed ? 'completed' : ''} onClick={() => handleUpdate({ completed: !editedTask.completed })} />
              <Play size={18} className={editedTask.isActiveTask ? 'active' : ''} onClick={() => handleUpdate({ isActiveTask: !editedTask.isActiveTask })} />
            </div>
            <div className="header-actions">
               <Flag size={18} />
               <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div className="modal-body">
            <input 
              className="task-title-input" 
              value={editedTask.title} 
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />

            <button className="add-tag-btn">
              <Plus size={14} /> Etiquetas
            </button>

            <div className="detail-grid">
              <div className="detail-item">
                 <div className="detail-label"><Clock size={16} /> Pomodoro</div>
                 <div className="detail-value highlighted">
                   <span className="pomodoro-count">🍅 {editedTask.pomodoros || 0} / {editedTask.targetPomodoros || 1}</span>
                   <span className="pomodoro-time"> = {((editedTask.pomodoros || 0) * 25)}min</span>
                 </div>
              </div>

              <div className="detail-item">
                 <div className="detail-label"><Calendar size={16} /> Data limite</div>
                 <div className="detail-value">{editedTask.dueDate || 'Hoje'}</div>
              </div>

              <div className="detail-item">
                 <div className="detail-label"><Folder size={16} /> Projeto</div>
                 <div className="detail-value">{editedTask.project || 'Tarefas'}</div>
              </div>

              <div className="detail-item">
                 <div className="detail-label"><Bell size={16} /> Lembrete</div>
                 <div className="detail-value dim">Nenhum</div>
              </div>

              <div className="detail-item">
                 <div className="detail-label"><RefreshCw size={16} /> Repetir</div>
                 <div className="detail-value dim">Nenhum</div>
              </div>
            </div>

            <div className="subtasks-section">
               <button className="add-action-btn"><Plus size={16} /> Adicionar etapa</button>
            </div>

            <div className="notes-section">
               <textarea 
                placeholder="Adicionar nota" 
                value={editedTask.notes} 
                onChange={(e) => handleUpdate({ notes: e.target.value })}
               ></textarea>
            </div>
          </div>

          <div className="modal-footer">
             <div className="stats-info">
                <span>Criado em: {new Date(editedTask.createdAt).toLocaleDateString()}</span>
                <span>Tempo total: {formatTime(editedTask.timeSpent || 0)}</span>
             </div>
             <button className="delete-btn" onClick={() => { deleteTask(task.id); onClose(); }}>
               <Trash2 size={18} />
             </button>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .task-detail-panel {
          width: 400px;
          height: 100%;
          background: var(--bg-surface);
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.3);
        }
        .modal-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }
        .status-toggle { display: flex; gap: 16px; align-items: center; color: var(--text-dim); }
        .status-toggle svg { cursor: pointer; transition: 0.2s; }
        .status-toggle .completed { color: #34d399; }
        .status-toggle .active { color: var(--accent); }
        .header-actions { display: flex; gap: 16px; color: var(--text-dim); }

        .modal-body { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
        .task-title-input {
          font-size: 20px;
          font-weight: 700;
          background: transparent;
          border: none;
          color: var(--text-main);
          width: 100%;
          outline: none;
        }
        .add-tag-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          font-size: 12px;
          width: fit-content;
          color: var(--text-dim);
          border: 1px dashed var(--border-color);
        }

        .detail-grid { display: flex; flex-direction: column; gap: 12px; }
        .detail-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .detail-label { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--text-muted); }
        .detail-value { font-size: 13px; color: var(--text-main); }
        .detail-value.dim { color: var(--text-dim); }
        .detail-value.highlighted { color: var(--accent); display: flex; flex-direction: column; align-items: flex-end; }
        .pomodoro-time { font-size: 11px; opacity: 0.6; }

        .subtasks-section { border-top: 1px solid var(--border-color); padding-top: 20px; }
        .add-action-btn { display: flex; align-items: center; gap: 12px; color: var(--text-dim); font-size: 14px; width: 100%; text-align: left; }
        
        .notes-section { flex: 1; margin-top: 10px; }
        .notes-section textarea {
          width: 100%;
          height: 100px;
          background: transparent;
          border: none;
          resize: none;
          font-size: 14px;
          color: var(--text-main);
          outline: none;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stats-info { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--text-dim); }
        .delete-btn { color: #ff5f56; opacity: 0.6; transition: 0.2s; }
        .delete-btn:hover { opacity: 1; transform: scale(1.1); }
      `}</style>
    </AnimatePresence>
  );
};

export default TaskModal;
