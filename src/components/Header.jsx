import { Settings as SettingsIcon } from 'lucide-react';
import SettingsModal from './SettingsModal';

const Header = () => {
  const { activeTab, tasks, settings, timeLeft, mode } = usePomodoro();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'today': return 'Hoje';
      case 'all': return 'Todas';
      case 'completed': return 'Concluído';
      default: return 'Tarefas';
    }
  };

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const totalMinutes = pendingCount * settings.focusTime;
  
  // Calculate total time spent on all tasks
  const totalTimeSpentSeconds = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);
  const totalTimeSpentMinutes = Math.floor(totalTimeSpentSeconds / 60);

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="header-title">{getTitle()}</h1>
        <button className="settings-trigger" onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon size={20} />
        </button>
      </div>

      <div className="header-stats">
        <div className="stat-card">
          <div className="stat-value">{totalMinutes}<span>min</span></div>
          <div className="stat-label">Prazo estimado</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-card">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Tarefas pendentes</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-card">
          <div className="stat-value">{totalTimeSpentMinutes}<span>min</span></div>
          <div className="stat-label">Tempo percorrido</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-card">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Tarefas concluídas</div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <style>{`
        .header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          height: auto;
          padding: 24px 0;
          border-bottom: none;
          margin-bottom: 0;
        }
        .header-top { 
          width: 100%;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }
        .header-title { font-size: 24px; font-weight: 700; color: #fff; }
        .settings-trigger {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-color);
          transition: 0.2s;
        }
        .settings-trigger:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .header-stats {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 24px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .stat-value { font-size: 24px; font-weight: 600; color: #fff; }
        .stat-value span { font-size: 14px; font-weight: 400; color: #777; margin-left: 2px; }
        .stat-label { font-size: 11px; font-weight: 500; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-divider { width: 1px; height: 32px; background: var(--border-color); }
        .stat-card:nth-child(3) .stat-value { color: #e74c3c; }
      `}</style>
    </header>
  );
};

export default Header;
