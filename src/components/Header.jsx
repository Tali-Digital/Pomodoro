import React from 'react';
import { usePomodoro } from '../PomodoroContext';

const Header = () => {
  const { activeTab, tasks, settings } = usePomodoro();

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

  return (
    <header className="header">
      <div className="header-title-section">
        <h1 className="header-title">{getTitle()}</h1>
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
          <div className="stat-value">0<span>min</span></div>
          <div className="stat-label">Tempo percorrido</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-card">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Tarefas concluídas</div>
        </div>
      </div>

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
        .header-title { font-size: 20px; font-weight: 700; }
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
