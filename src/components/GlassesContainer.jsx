import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { 
  Wifi, 
  Battery, 
  Signal, 
  AlertTriangle,
  Radio,
  PhoneCall,
  PhoneOff,
  Heart
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const GlassesContainer = ({ children }) => {
  const { 
    phoneFrameMode, 
    activePet, 
    isOnline, 
    collarState, 
    incomingCallInterrupt, 
    dismissCallInterrupt,
    setCurrentView
  } = usePet();

  const [currentTime, setCurrentTime] = useState('16:45');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswerCall = () => {
    sounds.playSuccess();
    dismissCallInterrupt();
    setCurrentView('vet');
  };

  const handleDeclineCall = () => {
    sounds.playAlert();
    dismissCallInterrupt();
  };

  const isAnomaly = activePet?.vitals?.healthStatus === 'CRITICAL';

  return (
    <div className={`smart-glasses-frame ${!phoneFrameMode ? 'fullscreen-mode' : ''}`}>
      {/* AR Corner Overlays */}
      <div className="ar-corner-tl" />
      <div className="ar-corner-tr" />
      <div className="ar-corner-bl" />
      <div className="ar-corner-br" />

      {/* AR Top Status Bar */}
      <div className="hud-status-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '1.2rem', letterSpacing: '1px', textShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }}>{currentTime}</span>
          {isAnomaly ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff0055', animation: 'pulse 1s infinite' }}>
              <AlertTriangle size={16} />
              <span>CRITICAL ANOMALY</span>
            </div>
          ) : collarState.status === 'CONNECTED' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--hud-emerald)' }}>
              <Radio size={16} />
              <span style={{ fontSize: '0.85rem' }}>LINK: {activePet?.name?.toUpperCase() || 'SYS'} ACTIVE</span>
            </div>
          ) : null}
        </div>

        {/* Top Right AR Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Signal size={16} color={isOnline ? 'var(--hud-emerald)' : '#64748b'} />
            <Wifi size={16} color={isOnline ? 'var(--hud-emerald)' : '#ef4444'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <span>SYS: 98%</span>
            <Battery size={16} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <span>COLLAR: {collarState.battery}%</span>
            <Battery size={16} color={collarState.battery < 20 ? '#ef4444' : '#10b981'} />
          </div>
        </div>
      </div>

      {/* Holographic Incoming Call */}
      {incomingCallInterrupt && (
        <div className="incoming-call-banner" style={{
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          background: 'rgba(5, 10, 8, 0.95)',
          border: '1px solid var(--secondary)',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--secondary), var(--accent-rose))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PhoneCall size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
                {incomingCallInterrupt.caller}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                INCOMING TRANSMISSION
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleDeclineCall} 
              style={{
                background: 'rgba(244, 63, 94, 0.2)', 
                border: '1px solid var(--accent-rose)',
                borderRadius: '8px', 
                width: '44px', 
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--accent-rose)'
              }}
              title="Decline"
            >
              <PhoneOff size={20} />
            </button>
            <button 
              onClick={handleAnswerCall} 
              style={{
                background: 'rgba(16, 185, 129, 0.2)', 
                border: '1px solid var(--primary)',
                borderRadius: '8px', 
                width: '44px', 
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--primary)'
              }}
              title="Answer"
            >
              <PhoneCall size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main AR Viewport */}
      <div className="hud-screen">
        {children}
      </div>
    </div>
  );
};
