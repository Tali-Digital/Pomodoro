import React from 'react';
import { 
  Search, Sun, Calendar, List, CheckCircle, 
  Folder, Inbox, ChevronDown, Plus, LayoutGrid, Clock, Clipboard
} from 'lucide-react';
import { usePomodoro } from '../PomodoroContext';

const Sidebar = () => {
  const { projects, activeTab, setActiveTab, tasks } = usePomodoro();

  const getCount = (tab) => {
    switch (tab) {
      case 'today': return tasks.filter(t => !t.completed).length; // simplistic
      case 'all': return tasks.length;
      case 'completed': return tasks.filter(t => t.completed).length;
      default: return 0;
    }
  };

  const menuItems = [
    { id: 'today', name: 'Hoje', icon: <Sun size={18} color="#f59e0b" /> },
    { id: 'tomorrow', name: 'Amanhã', icon: <Clock size={18} color="#f87171" /> },
    { id: 'week', name: 'Esta Semana', icon: <Calendar size={18} color="#60a5fa" /> },
    { id: 'planned', name: 'Planejado', icon: <Clipboard size={18} color="#c084fc" /> },
    { id: 'all', name: 'Tudo', icon: <LayoutGrid size={18} color="#fbbf24" /> },
    { id: 'completed', name: 'Concluído', icon: <CheckCircle size={18} color="#34d399" /> },
    { id: 'inbox', name: 'Tarefas', icon: <Inbox size={18} color="#94a3b8" /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="avatar">C</div>
          <span>criativoh5</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="sidebar-search">
        <div className="search-input">
          <Search size={16} />
          <input type="text" placeholder="Pesquisar" />
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-name">{item.name}</span>
            <span className="menu-count">{getCount(item.id)}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="add-project">
          <Plus size={18} />
          <span>Criar projeto</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          padding: 16px;
          gap: 20px;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
        }
        .user-profile:hover { background: var(--bg-hover); }
        .avatar {
          width: 24px;
          height: 24px;
          background: #555;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }
        .search-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          margin-bottom: 16px;
        }
        .search-input input { font-size: 13px; flex: 1; }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          width: 100%;
          text-align: left;
          font-size: 13px;
          margin-bottom: 2px;
          transition: var(--transition);
        }
        .menu-item:hover { background: var(--bg-hover); }
        .menu-item.active { background: var(--bg-surface); font-weight: 500; }
        .menu-name { flex: 1; }
        .menu-count { font-size: 11px; color: var(--text-dim); }
        .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .add-project {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 13px;
          width: 100%;
        }
        .add-project:hover { color: var(--text-main); }
      `}</style>
    </aside>
  );
};

export default Sidebar;
