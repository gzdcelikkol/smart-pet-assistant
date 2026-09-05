import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Battery, 
  Signal, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Radio,
  Eye,
  Crosshair,
  Volume2
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const LostPetTrackerView = ({ onOpenRegisterModal }) => {
  const { 
    activePet, 
    tracker, 
    setTracker, 
    toggleSafeZoneBreach 
  } = usePet();

  // Test mode: 'NORMAL' | 'WEAK_SIGNAL' | 'LOW_BATTERY'
  const [testScenario, setTestScenario] = useState('NORMAL');
  const [arModeActive, setArModeActive] = useState(false);
  const [petFoundSuccess, setPetFoundSuccess] = useState(false);

  // Compass animation heading
  const [needleRotation, setNeedleRotation] = useState(45);

  useEffect(() => {
    // Subtle realistic compass fluctuation
    const interval = setInterval(() => {
      setNeedleRotation(prev => {
        const jitter = (Math.random() - 0.5) * 4;
        return (prev + jitter) % 360;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleStartTracking = () => {
    sounds.playAlert();
    setTracker(prev => ({
      ...prev,
      isTracking: true,
      inSafeZone: false,
      distanceMeters: 480,
      headingDeg: 45
    }));
  };

  const handlePetFound = () => {
    sounds.playSuccess();
    setPetFoundSuccess(true);
    setTracker(prev => ({
      ...prev,
      isTracking: false,
      inSafeZone: true,
      distanceMeters: 5
    }));

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const isLowBattery = testScenario === 'LOW_BATTERY';
  const isWeakSignal = testScenario === 'WEAK_SIGNAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <ViewHeader 
        title="Lost Pet Tracker" 
        subtitle="GPS Radar & 3D AR Directional Compass" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body">
        {/* Safe Zone Alert Banner */}
        {!tracker.inSafeZone && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(15, 23, 42, 0.9))',
            border: '1px solid #f43f5e',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(244, 63, 94, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={22} color="#f43f5e" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                  SAFE ZONE BREACH ALERT!
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fecdd3' }}>
                  {activePet?.name} exited perimeter boundary ({tracker.distanceMeters}m away).
                </div>
              </div>
            </div>
            <button
              onClick={() => sounds.playAlert()}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px',
                color: '#fff',
                cursor: 'pointer'
              }}
              title="Play Audible Alarm"
            >
              <Volume2 size={16} />
            </button>
          </div>
        )}

        {/* Alternative Flow B Warning: Low Battery */}
        {isLowBattery && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            borderRadius: '14px',
            padding: '10px 14px',
            fontSize: '0.76rem',
            color: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <div>
              <strong>Collar Battery Critically Low (12%)!</strong>
              <div style={{ fontSize: '0.7rem' }}>Search manually around the last known GPS location if signal drops.</div>
            </div>
          </div>
        )}

        {/* Alternative Flow A Warning: Weak Signal */}
        {isWeakSignal && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            borderRadius: '14px',
            padding: '10px 14px',
            fontSize: '0.76rem',
            color: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Radio size={18} color="#38bdf8" />
            <div>
              <strong>Weak GPS Signal (Scanning in Background)</strong>
              <div style={{ fontSize: '0.7rem' }}>Displaying last known coordinates on radar until signal strengthens.</div>
            </div>
          </div>
        )}

        {/* Interactive Radar & Compass Visualizer */}
        <div className="glass-card" style={{
          position: 'relative',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px',
          overflow: 'hidden'
        }}>
          {/* Radar Background grid rings */}
          <div style={{
            position: 'relative',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 70%)',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)'
          }}>
            {/* Inner rings */}
            <div style={{ position: 'absolute', width: '170px', height: '170px', borderRadius: '50%', border: '1px dashed rgba(6, 182, 212, 0.25)' }} />
            <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '1px solid rgba(6, 182, 212, 0.2)' }} />
            
            {/* Crosshairs */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(6, 182, 212, 0.15)' }} />
            <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'rgba(6, 182, 212, 0.15)' }} />

            {/* Radar Beam Sweep */}
            <div 
              className="ar-radar-sweep" 
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(0, 240, 255, 0.25) 0deg, transparent 60deg)'
              }} 
            />

            {/* User Position (Center) */}
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8',
              zIndex: 10
            }} />

            {/* Directional 3D AR Arrow pointing to Pet (Step 2 GUI Prototype) */}
            <div style={{
              position: 'absolute',
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{
                position: 'relative',
                top: '-75px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'pulse 1.5s infinite'
              }}>
                <div style={{
                  width: '0',
                  height: '0',
                  borderLeft: '14px solid transparent',
                  borderRight: '14px solid transparent',
                  borderBottom: '26px solid #00f0ff',
                  filter: 'drop-shadow(0 0 10px #00f0ff)'
                }} />
                <div style={{
                  background: 'rgba(0,0,0,0.85)',
                  border: '1px solid #00f0ff',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  color: '#00f0ff',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  {activePet?.name || 'Pet'} • {tracker.distanceMeters}m
                </div>
              </div>
            </div>

            {/* Compass Card Directions */}
            <span style={{ position: 'absolute', top: '8px', fontSize: '0.65rem', fontWeight: 800, color: '#ff0055' }}>N</span>
            <span style={{ position: 'absolute', bottom: '8px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>S</span>
            <span style={{ position: 'absolute', left: '8px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>W</span>
            <span style={{ position: 'absolute', right: '8px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>E</span>
          </div>

          {/* HUD Status Bar overlaying radar */}
          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            width: '100%'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              {tracker.distanceMeters} Meters • {activePet?.currentLocation?.direction || 'North-East'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
              Last Known: {activePet?.currentLocation?.name || 'Central Park, Fountain'}
            </div>
          </div>
        </div>

        {/* Action Buttons: Find My Pet / Pet Found / AR View Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!tracker.isTracking && tracker.inSafeZone ? (
            <button 
              onClick={handleStartTracking}
              className="btn-danger"
              style={{ width: '100%', fontSize: '0.92rem' }}
            >
              <Navigation size={18} />
              <span>Start "Find My Pet" Tracking</span>
            </button>
          ) : (
            <button 
              onClick={handlePetFound}
              className="btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.92rem' }}
            >
              <CheckCircle2 size={18} />
              <span>I Found My Pet! ("Pet Found")</span>
            </button>
          )}

          <button 
            onClick={() => setArModeActive(!arModeActive)}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            <Eye size={16} />
            <span>{arModeActive ? 'Switch to 2D Radar View' : 'Open Camera AR Directional Arrow'}</span>
          </button>
        </div>

        {/* Live AR Camera View simulation if toggled */}
        {arModeActive && (
          <div style={{
            position: 'relative',
            height: '200px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #00f0ff',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.25)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80" 
              alt="Park AR Background" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* AR Nav overlay */}
            <div className="ar-hud-overlay">
              <div className="ar-corner-tl" />
              <div className="ar-corner-tr" />
              <div className="ar-corner-bl" />
              <div className="ar-corner-br" />

              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <Navigation 
                  size={54} 
                  color="#00f0ff" 
                  style={{
                    transform: `rotate(${needleRotation}deg)`,
                    filter: 'drop-shadow(0 0 15px #00f0ff)'
                  }} 
                />
                <div style={{
                  background: 'rgba(0,0,0,0.85)',
                  border: '1px solid #00f0ff',
                  borderRadius: '10px',
                  padding: '4px 12px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  marginTop: '8px'
                }}>
                  {activePet?.name} : {tracker.distanceMeters}m North-East
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Scenarios Selector */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            🧪 Tracking Test Scenarios
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button 
              onClick={() => { setTestScenario('NORMAL'); sounds.playBeep(); }}
              className={`sim-btn ${testScenario === 'NORMAL' ? 'active' : ''}`}
              style={{ fontSize: '0.68rem', justifyContent: 'center' }}
            >
              Normal GPS
            </button>
            <button 
              onClick={() => { setTestScenario('WEAK_SIGNAL'); sounds.playAlert(); }}
              className={`sim-btn ${testScenario === 'WEAK_SIGNAL' ? 'active' : ''}`}
              style={{ fontSize: '0.68rem', justifyContent: 'center' }}
            >
              Weak Signal
            </button>
            <button 
              onClick={() => { setTestScenario('LOW_BATTERY'); sounds.playAlert(); }}
              className={`sim-btn ${testScenario === 'LOW_BATTERY' ? 'active' : ''}`}
              style={{ fontSize: '0.68rem', justifyContent: 'center' }}
            >
              Low Battery
            </button>
          </div>
        </div>
      </div>

      {/* Pet Found Celebration Modal */}
      {petFoundSuccess && (
        <div className="modal-backdrop">
          <div className="modal-bottom-sheet" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: '#10b981'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {activePet?.name} Safely Found! 🐾
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              AR Navigation guidance completed. The pet is verified within safe proximity.
            </p>

            <button 
              onClick={() => setPetFoundSuccess(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Great! Return to Assistant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
