import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, Wind, Flame, Headphones, Waves, Music } from 'lucide-react';
import { Howl } from 'howler';

const AmbientPlayer = () => {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isOpen, setIsOpen] = useState(false);
  const soundRef = React.useRef(null);

  const toggleSound = (sound) => {
    if (activeSound === sound.id) {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current = null;
      }
      setActiveSound(null);
    } else {
      if (soundRef.current) soundRef.current.stop();
      
      const newSound = new Howl({
        src: [sound.url],
        html5: true,
        loop: true,
        volume: volume
      });
      newSound.play();
      soundRef.current = newSound;
      setActiveSound(sound.id);
    }
  };

  React.useEffect(() => {
    if (soundRef.current) soundRef.current.volume(volume);
  }, [volume]);

  const sounds = [
    { id: 'rain', name: 'Chuva', icon: <CloudRain size={16} />, url: 'https://actions.google.com/sounds/v1/rain/heavy_rain_with_thunder.ogg' },
    { id: 'cafe', name: 'Cafeteria', icon: <Coffee size={16} />, url: 'https://actions.google.com/sounds/v1/ambiences/ambience_outside_cafe.ogg' },
    { id: 'wind', name: 'Vento', icon: <Wind size={16} />, url: 'https://actions.google.com/sounds/v1/water/lapping_waves.ogg' },
    { id: 'fire', name: 'Lareira', icon: <Flame size={16} />, url: 'https://actions.google.com/sounds/v1/water/creek_constant.ogg' },
  ];

  return (
    <div className={`ambient-player-container ${isOpen ? 'open' : ''}`}>
      <button className="ambient-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Headphones size={20} />
      </button>

      {isOpen && (
        <div className="ambient-panel premium-card glass">
          <div className="ambient-header">
            <span>Sons Ambientes</span>
            <Volume2 size={16} />
          </div>

          <div className="volume-slider">
            <input 
              type="range" 
              min="0" max="100" 
              value={volume} 
              onChange={(e) => setVolume(e.target.value)} 
            />
          </div>

          <div className="sound-grid">
            {sounds.map(sound => (
              <button 
                key={sound.id}
                className={`sound-item ${activeSound === sound.id ? 'active' : ''}`}
                onClick={() => toggleSound(sound)}
              >
                <div className="sound-icon">{sound.icon}</div>
                <span className="sound-name">{sound.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ambient-player-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 200;
        }
        .ambient-toggle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .ambient-toggle:hover { background: var(--bg-hover); transform: translateY(-2px); }
        
        .ambient-panel {
          position: absolute;
          top: 60px;
          right: 0;
          width: 240px;
          padding: 20px;
          gap: 16px;
          display: flex;
          flex-direction: column;
        }
        .ambient-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 600;
        }
        .volume-slider input { width: 100%; height: 4px; border-radius: 2px; background: #333; outline: none; accent-color: var(--accent); }
        .sound-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .sound-item {
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
          transition: 0.2s;
        }
        .sound-item:hover { background: rgba(255, 255, 255, 0.06); }
        .sound-item.active { background: var(--accent-muted); border-color: var(--accent); }
        .sound-icon { color: var(--text-muted); transition: 0.2s; }
        .sound-item.active .sound-icon { color: var(--accent); }
        .sound-name { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default AmbientPlayer;
