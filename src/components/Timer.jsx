import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings as SettingsIcon } from 'lucide-react';
import { usePomodoro } from '../PomodoroContext';

const Timer = () => {
  const { timeLeft, isActive, toggleTimer, resetTimer, mode, settings } = usePomodoro();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const totalSeconds = mode === 'focus' ? settings.focusTime * 60 : (mode === 'shortBreak' ? settings.shortBreak * 60 : settings.longBreak * 60);
  const percentage = (timeLeft / totalSeconds) * 100;

  return (
    <div className="timer-footer glass">
      <div className="timer-circular-display">
        <svg viewBox="0 0 36 36">
          <path
            className="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle-progress"
            style={{ strokeDasharray: `${percentage}, 100` }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="timer-value">{minutes}</span>
      </div>

      <div className="timer-mode-info">
        <div className="mode-label">{mode === 'focus' ? 'Tempo de Foco' : 'Descanso'}</div>
        <div className="mode-time">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div>
      </div>

      <div className="timer-controls">
        <button className="control-btn" onClick={resetTimer}><RotateCcw size={18} /></button>
        <button className="play-btn" onClick={toggleTimer}>
          {isActive ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
        </button>
        <button className="control-btn"><SkipForward size={18} /></button>
      </div>

      <div className="timer-settings-shortcut">
        <button className="settings-btn"><SettingsIcon size={20} /></button>
      </div>

      <style>{`
        .timer-circular-display {
          width: 50px;
          height: 50px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .timer-circular-display svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .circle-bg { fill: none; stroke: rgba(255, 255, 255, 0.05); stroke-width: 2; }
        .circle-progress {
          fill: none;
          stroke: var(--accent);
          stroke-width: 2;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
        }
        .timer-value {
          position: absolute;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        
        .timer-mode-info { flex: 1; display: flex; flex-direction: column; }
        .mode-label { font-size: 10px; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 0.5px; }
        .mode-time { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
        
        .timer-controls { display: flex; align-items: center; gap: 16px; margin: 0 40px; }
        .control-btn { color: #555; transition: 0.2s; }
        .control-btn:hover { color: #fff; }
        .play-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
          transition: 0.2s;
        }
        .play-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .settings-btn { color: #555; }
        .settings-btn:hover { color: #fff; }
      `}</style>
    </div>
  );
};

export default Timer;
