import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, ShieldCheck, Zap, Bell, Clock, Globe } from 'lucide-react';
import { usePomodoro } from '../PomodoroContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, setSettings } = usePomodoro();

  if (!isOpen) return null;

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="settings-card glass"
          onClick={e => e.stopPropagation()}
        >
          <div className="settings-header">
            <div className="title">
              <Settings size={20} />
              <h3>Configurações Premium</h3>
            </div>
            <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
          </div>

          <div className="settings-body">
            <div className="settings-section">
               <div className="section-title"><Clock size={16} /> Timer</div>
               <div className="setting-item">
                  <label>Tempo de Foco (min)</label>
                  <input 
                    type="number" 
                    value={settings.focusTime} 
                    onChange={(e) => updateSetting('focusTime', parseInt(e.target.value))}
                  />
               </div>
               <div className="setting-item">
                  <label>Descanso Curto (min)</label>
                  <input 
                    type="number" 
                    value={settings.shortBreak} 
                    onChange={(e) => updateSetting('shortBreak', parseInt(e.target.value))}
                  />
               </div>
               <div className="setting-item">
                  <label>Descanso Longo (min)</label>
                  <input 
                    type="number" 
                    value={settings.longBreak} 
                    onChange={(e) => updateSetting('longBreak', parseInt(e.target.value))}
                  />
               </div>
            </div>

            <div className="settings-section">
               <div className="section-title"><Zap size={16} /> Automação</div>
               <div className="setting-item toggle">
                  <label>Iniciar descanso automaticamente</label>
                  <input 
                    type="checkbox" 
                    checked={settings.autoStartBreak} 
                    onChange={(e) => updateSetting('autoStartBreak', e.target.checked)}
                  />
               </div>
               <div className="setting-item toggle">
                  <label>Iniciar próximo foco automaticamente</label>
                  <input 
                    type="checkbox" 
                    checked={settings.autoStartNext} 
                    onChange={(e) => updateSetting('autoStartNext', e.target.checked)}
                  />
               </div>
            </div>

            <div className="premium-banner">
              <ShieldCheck size={24} color="var(--accent)" />
              <div className="banner-text">
                <p>Você está no Modo Premium</p>
                <span>Acesso total a todas as funcionalidades</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .settings-card {
          width: 480px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
        }
        .settings-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .settings-header .title { display: flex; align-items: center; gap: 12px; }
        .settings-header h3 { font-size: 16px; font-weight: 700; }
        
        .settings-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .section-title { font-size: 12px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        
        .setting-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .setting-item label { font-size: 14px; color: var(--text-main); }
        .setting-item input[type="number"] {
          width: 60px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px;
          text-align: center;
          color: var(--text-main);
        }

        .setting-item.toggle input { cursor: pointer; width: 34px; height: 18px; accent-color: var(--accent); }

        .premium-banner {
          background: rgba(255, 107, 74, 0.1);
          border: 1px solid var(--accent-muted);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .banner-text p { font-size: 14px; font-weight: 600; color: var(--text-main); }
        .banner-text span { font-size: 12px; color: var(--text-dim); }
      `}</style>
    </AnimatePresence>
  );
};

export default SettingsModal;
