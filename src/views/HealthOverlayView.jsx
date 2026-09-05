import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Battery, 
  AlertTriangle, 
  PhoneCall, 
  Calendar, 
  History, 
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const HealthOverlayView = ({ onOpenRegisterModal }) => {
  const { 
    activePet, 
    toggleHealthAnomaly, 
    setCurrentView 
  } = usePet();

  const [sensorStatus, setSensorStatus] = useState('ACTIVE'); // 'ACTIVE' | 'UNAVAILABLE'
  const isAnomaly = activePet?.vitals?.healthStatus === 'CRITICAL';

  const handleStartVetCall = () => {
    sounds.playBeep();
    setCurrentView('vet');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ViewHeader 
        title="Health Overlay Display" 
        subtitle="AR Biometric Telemetry & Vitals" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body">
        {/* Critical Health Anomaly Alert Card (Alternative Flow C) */}
        {isAnomaly && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(15, 23, 42, 0.95))',
            border: '1.5px solid #f43f5e',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 8px 30px rgba(244, 63, 94, 0.4)',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f43f5e',
                flexShrink: 0
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                  Critical Health Anomaly Detected!
                </div>
                <p style={{ fontSize: '0.75rem', color: '#fecdd3', marginTop: '4px', lineHeight: 1.4 }}>
                  {activePet?.name}'s body temperature (<strong>{activePet?.vitals?.temperature}°C</strong>) and heart rate (<strong>{activePet?.vitals?.heartRate} bpm</strong>) exceed normal ranges!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button 
                onClick={handleStartVetCall}
                className="btn-danger"
                style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem' }}
              >
                <PhoneCall size={16} />
                <span>Consult Dr. Lee (Live Vet Call)</span>
              </button>
            </div>
          </div>
        )}

        {/* Alternative Flow A: Sensor Data Unavailable */}
        {sensorStatus === 'UNAVAILABLE' && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            borderRadius: '14px',
            padding: '12px 14px',
            fontSize: '0.78rem',
            color: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Clock size={20} color="#f59e0b" />
            <div>
              <strong>Health Data Unavailable — Reconnecting...</strong>
              <div style={{ fontSize: '0.72rem' }}>Collar telemetry lost. Retrying in background... cached data displayed.</div>
            </div>
          </div>
        )}

        {/* Real-time Health Overlay HUD Preview */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '210px' }}>
            <img 
              src={activePet?.photoUrl} 
              alt={activePet?.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {/* Dark glass overlay with HUD */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.2) 60%, rgba(9, 13, 22, 0.7) 100%)'
            }} />

            {/* AR Target Reticle on pet heart area */}
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '52%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              border: `2px solid ${isAnomaly ? '#ff0055' : '#00f0ff'}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${isAnomaly ? 'rgba(255,0,85,0.5)' : 'rgba(0,240,255,0.4)'}`
            }}>
              <Heart size={28} color={isAnomaly ? '#ff0055' : '#00f0ff'} className="heart-pulse" />
            </div>

            {/* Top HUD Badges */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span className={`badge-status ${isAnomaly ? 'badge-critical' : 'badge-normal'}`}>
                {isAnomaly ? '🔴 Anomaly Detected' : '🟢 Live Biometrics'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '8px' }}>
                Last Sync: {activePet?.vitals?.lastSync || 'Just now'}
              </span>
            </div>

            {/* Bottom HUD metrics within camera preview */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              right: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', borderRadius: '10px', padding: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Heart Rate</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isAnomaly ? '#ff0055' : '#fff' }}>
                  {activePet?.vitals?.heartRate} <span style={{ fontSize: '0.65rem' }}>bpm</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', borderRadius: '10px', padding: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Body Temp</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isAnomaly ? '#ff0055' : '#38bdf8' }}>
                  {activePet?.vitals?.temperature}°C
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', borderRadius: '10px', padding: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Activity Level</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10b981' }}>
                  {activePet?.vitals?.activity}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Vital Trends Simulation */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#06b6d4" />
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                24-Hour Biometric Pulse Curve
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Avg: 82 bpm</span>
          </div>

          {/* Graphical Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', paddingTop: '10px', gap: '6px' }}>
            {[72, 75, 80, 85, 92, 110, 88, 82, 85, 78, 80, isAnomaly ? 142 : 85].map((val, idx) => {
              const heightPercent = Math.min(100, Math.max(15, (val / 160) * 100));
              const isPeak = idx === 11 && isAnomaly;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: isPeak 
                      ? 'linear-gradient(to top, #f43f5e, #fda4af)' 
                      : 'linear-gradient(to top, #06b6d4, #38bdf8)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }} />
                  <span style={{ fontSize: '0.58rem', color: isPeak ? '#f43f5e' : '#64748b' }}>
                    {idx * 2}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teleconsultation Quick Link */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Vet Teleconsultation</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>On-Duty Vet: Dr. Lee (Online)</div>
            </div>
          </div>
          <button 
            onClick={handleStartVetCall}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            Start Video Call
          </button>
        </div>

        {/* Test Toggles */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            🧪 Health Simulation Controls
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              onClick={toggleHealthAnomaly}
              className={`sim-btn ${isAnomaly ? 'danger' : ''}`}
              style={{ justifyContent: 'center', fontSize: '0.72rem' }}
            >
              {isAnomaly ? '✅ Restore Normal' : '⚠️ Trigger Fever Anomaly'}
            </button>
            <button 
              onClick={() => {
                setSensorStatus(sensorStatus === 'ACTIVE' ? 'UNAVAILABLE' : 'ACTIVE');
                sounds.playBeep();
              }}
              className={`sim-btn ${sensorStatus === 'UNAVAILABLE' ? 'active' : ''}`}
              style={{ justifyContent: 'center', fontSize: '0.72rem' }}
            >
              {sensorStatus === 'UNAVAILABLE' ? 'Connect Sensor' : 'Disconnect Sensor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
