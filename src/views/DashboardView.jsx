import React from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  ScanFace, 
  MapPin, 
  Activity, 
  Utensils, 
  Camera, 
  Film, 
  Radio, 
  Heart, 
  Thermometer, 
  Battery, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  PhoneCall,
  Scale
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const DashboardView = ({ onOpenRegisterModal }) => {
  const { 
    activePet, 
    setCurrentView, 
    collarState, 
    tracker, 
    toggleHealthAnomaly,
    toggleSafeZoneBreach 
  } = usePet();

  if (!activePet) return null;

  const isAnomaly = activePet.vitals.healthStatus === 'CRITICAL';
  const consumed = activePet.nutrition?.consumedCalories || 0;
  const target = activePet.nutrition?.targetCalories || 1200;
  const caloriePercent = Math.min(100, Math.round((consumed / target) * 100));

  const handleAction = (viewName) => {
    sounds.playBeep();
    setCurrentView(viewName);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ViewHeader 
        title="PetVision" 
        subtitle="Smart Pet Assistant App" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Critical Health / Safe Zone Alert Banner */}
        {isAnomaly && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(15, 23, 42, 0.9))',
            border: '1px solid #f43f5e',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(244, 63, 94, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={24} color="#f43f5e" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                  Critical Health Anomaly Detected!
                </div>
                <div style={{ fontSize: '0.74rem', color: '#fecdd3' }}>
                  Temp: {activePet.vitals.temperature}°C • Heart Rate: {activePet.vitals.heartRate} bpm
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleAction('vet')}
              style={{
                background: '#f43f5e',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <PhoneCall size={13} />
              <span>Consult Vet</span>
            </button>
          </div>
        )}

        {!tracker.inSafeZone && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.9))',
            border: '1px solid #f59e0b',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={24} color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                  Safe Zone Breach Alert!
                </div>
                <div style={{ fontSize: '0.74rem', color: '#fef3c7' }}>
                  {activePet.name} left the designated boundary ({tracker.distanceMeters}m).
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleAction('tracker')}
              style={{
                background: '#f59e0b',
                color: '#000',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Open Compass
            </button>
          </div>
        )}

        {/* Pet Profile Hero Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '180px' }}>
            <img 
              src={activePet.photoUrl} 
              alt={activePet.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 13, 22, 1) 0%, rgba(9, 13, 22, 0.4) 60%, transparent 100%)'
            }} />
            
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px'
            }}>
              <span className={`badge-status ${isAnomaly ? 'badge-critical' : 'badge-normal'}`}>
                {isAnomaly ? 'Critical Anomaly' : 'Healthy'}
              </span>
              <span className="badge-status badge-normal" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.4)' }}>
                {activePet.species}
              </span>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              right: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{activePet.name}</h2>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  {activePet.breed} • {activePet.age} yrs • {activePet.weightKg} kg
                </p>
              </div>
              <button 
                onClick={() => handleAction('recognition')}
                style={{
                  background: 'rgba(6, 182, 212, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <ScanFace size={15} />
                <span>AR Scan</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar underneath hero */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            padding: '12px 14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#ff0055' }}>
                <Heart size={14} className="heart-pulse" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  {activePet.vitals.heartRate}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>bpm</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Heart Rate</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#38bdf8' }}>
                <Thermometer size={14} />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  {activePet.vitals.temperature}°C
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Body Temp</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#10b981' }}>
                <Activity size={14} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                  {activePet.vitals.activity}
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Activity</div>
            </div>
          </div>
        </div>

        {/* Daily Calorie Tracker Widget */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Utensils size={15} color="#06b6d4" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Daily Nutrition & Calories</span>
            </div>
            <button 
              onClick={() => handleAction('calculator')}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              Calculate →
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
            <span>Consumed: <strong style={{ color: '#fff' }}>{consumed} kcal</strong></span>
            <span>Target: <strong style={{ color: '#fff' }}>{target} kcal</strong></span>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${caloriePercent}%`,
              height: '100%',
              background: caloriePercent > 105 ? '#f59e0b' : 'linear-gradient(90deg, #06b6d4, #10b981)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Core Features Grid */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            10 Core Features & Modules
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {/* 1 & 2: Pet Recognition */}
            <div 
              className="glass-card" 
              onClick={() => handleAction('recognition')}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <ScanFace size={18} color="#06b6d4" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>AI Pet Recognition</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Camera biometric face scan</div>
            </div>

            {/* 3 & 4: Collar & GPS */}
            <div 
              className="glass-card" 
              onClick={() => handleAction('tracker')}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <MapPin size={18} color="#818cf8" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Lost Pet Tracker</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>GPS Radar & AR Compass</div>
            </div>

            {/* 5 & 6: Health & Vet */}
            <div 
              className="glass-card" 
              onClick={() => handleAction('health')}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Activity size={18} color="#f43f5e" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Health & Teleconsult</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Live vitals & Dr. Lee call</div>
            </div>

            {/* 7 & 8: Nutrition Scanner */}
            <div 
              className="glass-card" 
              onClick={() => handleAction('nutrition')}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Utensils size={18} color="#10b981" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Nutrition Scanner</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Barcode & toxicity safety</div>
            </div>

            {/* 9: Memory Capture */}
            <div 
              className="glass-card" 
              onClick={() => handleAction('capture')}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Camera size={18} color="#f59e0b" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Memory Capture</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Voice commands & quick clips</div>
            </div>

            {/* 10: Memory Journal */}
            <div 
              className="glass-card" 
              onClick={() => handleAction('journal')}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Film size={18} color="#c084fc" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>AI Memory Journal</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Highlights reel with music</div>
            </div>
          </div>
        </div>

        {/* Demo Test Scenario Triggers (Interactive for Testing) */}
        <div className="glass-card" style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            🧪 Interactive Test Scenario Triggers
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              onClick={toggleHealthAnomaly}
              className={`sim-btn ${isAnomaly ? 'danger' : ''}`}
              style={{ justifyContent: 'center', fontSize: '0.72rem' }}
            >
              {isAnomaly ? '✅ Restore Normal Vitals' : '⚠️ Trigger Fever Anomaly'}
            </button>
            <button 
              onClick={toggleSafeZoneBreach}
              className={`sim-btn ${!tracker.inSafeZone ? 'danger' : ''}`}
              style={{ justifyContent: 'center', fontSize: '0.72rem' }}
            >
              {!tracker.inSafeZone ? '🏠 Return to Safe Zone' : '🚨 Simulate Safe Zone Exit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
