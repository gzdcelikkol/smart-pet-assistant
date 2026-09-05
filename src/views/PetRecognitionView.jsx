import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { 
  ScanFace, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Thermometer, 
  Battery, 
  Wifi,
  Sparkles
} from 'lucide-react';
import { ViewHeader } from '../components/ViewHeader';
import { sounds } from '../utils/soundEffects';

export const PetRecognitionView = ({ onOpenRegisterModal }) => {
  const { activePet, pets, setActivePetId, setCurrentView } = usePet();

  // Test mode state: 'HIGH_CONFIDENCE' | 'LOW_CONFIDENCE' | 'NO_MATCH'
  const [scanScenario, setScanScenario] = useState('HIGH_CONFIDENCE');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [matchResult, setMatchResult] = useState(null);

  const startScan = (scenario = scanScenario) => {
    setIsScanning(true);
    setScanProgress(0);
    setMatchResult(null);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setScanProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);

        if (scenario === 'HIGH_CONFIDENCE') {
          setMatchResult({
            status: 'MATCH_FOUND',
            pet: activePet || pets[0],
            confidence: 96,
            message: 'Match Verified'
          });
          sounds.playSuccess();
        } else if (scenario === 'LOW_CONFIDENCE') {
          setMatchResult({
            status: 'LOW_CONFIDENCE',
            pet: activePet || pets[0],
            confidence: 68,
            message: 'Low Confidence (<80%). Please confirm or correct pet identity.'
          });
          sounds.playAlert();
        } else {
          setMatchResult({
            status: 'NO_MATCH',
            pet: null,
            confidence: 12,
            message: 'No matching pet found in the database.'
          });
          sounds.playAlert();
        }
      }
    }, 150);
  };

  useEffect(() => {
    startScan(scanScenario);
  }, [scanScenario, activePet]);

  const handleConfirmLowConfidence = (confirmedPetId) => {
    setActivePetId(confirmedPetId);
    setMatchResult({
      status: 'MATCH_FOUND',
      pet: pets.find(p => p.id === confirmedPetId),
      confidence: 98,
      message: 'AI recognition model updated with user feedback.'
    });
    sounds.playSuccess();
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ViewHeader 
        title="AI Pet Recognition" 
        subtitle="Biometric Camera Scan" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />
      {/* Top Camera HUD Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
          <span style={{ fontWeight: 700, color: '#00f0ff' }}>AI VISION SCANNER</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.7rem' }}>
          <span>FPS: 30</span>
          <span>LATENCY: 42ms</span>
        </div>
      </div>

      {/* Main Viewfinder Simulation */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
        <img 
          src={scanScenario === 'NO_MATCH' ? 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80' : (activePet?.photoUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80')} 
          alt="Live Camera Feed"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isScanning ? 'brightness(0.85)' : 'brightness(0.95)' }}
        />

        {/* AR Scanning Laser & Bounding Box */}
        <div className="ar-hud-overlay">
          <div className="ar-corner-tl" />
          <div className="ar-corner-tr" />
          <div className="ar-corner-bl" />
          <div className="ar-corner-br" />

          {isScanning && (
            <>
              <div className="ar-scan-laser" />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '180px',
                border: '2px solid rgba(0, 240, 255, 0.7)',
                borderRadius: '24px',
                boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <ScanFace size={36} color="#00f0ff" style={{ animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f0ff', letterSpacing: '0.5px' }}>
                  Biometric Analysis... {scanProgress}%
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Querying Cloud Database</span>
              </div>
            </>
          )}

          {/* AR Overlay Card when Match Found (Step 2 GUI Prototype) */}
          {matchResult && matchResult.status === 'MATCH_FOUND' && (
            <div style={{
              position: 'absolute',
              bottom: '90px',
              left: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid #00f0ff',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: '0 10px 30px rgba(0, 240, 255, 0.3)',
              animation: 'slideUp 0.3s ease-out',
              pointerEvents: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0, 240, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00f0ff'
                  }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                      {matchResult.pet.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {matchResult.pet.breed} • {matchResult.pet.age} yrs • {matchResult.pet.species}
                    </div>
                  </div>
                </div>
                <span className="badge-status badge-normal" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff', borderColor: '#00f0ff' }}>
                  {matchResult.confidence}% Confidence
                </span>
              </div>

              {/* Real-time Health Overlay preview directly on camera */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                padding: '8px',
                marginTop: '10px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Heart Rate</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    <Heart size={11} color="#ff0055" className="heart-pulse" />
                    <span>{matchResult.pet.vitals?.heartRate || 85}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Temperature</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {matchResult.pet.vitals?.temperature || 38.5}°C
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Collar Battery</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                    %{matchResult.pet.vitals?.collarBattery || 88}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  onClick={() => setCurrentView('health')} 
                  className="btn-primary" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  <Activity size={14} />
                  <span>Open Health Overlay</span>
                </button>
              </div>
            </div>
          )}

          {/* Alternative Flow A: Low Confidence (<80%) */}
          {matchResult && matchResult.status === 'LOW_CONFIDENCE' && (
            <div style={{
              position: 'absolute',
              bottom: '90px',
              left: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1.5px solid #f59e0b',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
              animation: 'slideUp 0.3s ease-out',
              pointerEvents: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '6px' }}>
                <AlertTriangle size={20} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Recognition Confidence Low ({matchResult.confidence}%)</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#fef3c7', marginBottom: '10px' }}>
                Visual recognition is unsure. Is this registered pet <strong>{matchResult.pet.name}</strong>?
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleConfirmLowConfidence(matchResult.pet.id)}
                  style={{
                    flex: 1,
                    background: '#f59e0b',
                    color: '#000',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Yes, {matchResult.pet.name} (Confirm)
                </button>
                <button 
                  onClick={() => startScan('NO_MATCH')}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid var(--border-glass)',
                    padding: '8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Different Pet
                </button>
              </div>
            </div>
          )}

          {/* Alternative Flow B: No Match Found -> Prompt Register */}
          {matchResult && matchResult.status === 'NO_MATCH' && (
            <div style={{
              position: 'absolute',
              bottom: '90px',
              left: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1.5px solid #f43f5e',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: '0 10px 30px rgba(244, 63, 94, 0.3)',
              animation: 'slideUp 0.3s ease-out',
              textAlign: 'center',
              pointerEvents: 'auto'
            }}>
              <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                No Matching Pet Found!
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '12px' }}>
                The animal in frame is not registered in the database. Would you like to register this pet?
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => { sounds.playBeep(); onOpenRegisterModal(); }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  <UserPlus size={15} />
                  <span>Register Now</span>
                </button>
                <button 
                  onClick={() => startScan('HIGH_CONFIDENCE')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  <RefreshCw size={15} />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Scenario Controller for Live Testing */}
      <div style={{
        background: 'rgba(11, 15, 25, 0.95)',
        borderTop: '1px solid var(--border-glass)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        zIndex: 20
      }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Test Scenarios:</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => { setScanScenario('HIGH_CONFIDENCE'); startScan('HIGH_CONFIDENCE'); }}
            className={`sim-btn ${scanScenario === 'HIGH_CONFIDENCE' ? 'active' : ''}`}
            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
          >
            Match Found (&gt;90%)
          </button>
          <button 
            onClick={() => { setScanScenario('LOW_CONFIDENCE'); startScan('LOW_CONFIDENCE'); }}
            className={`sim-btn ${scanScenario === 'LOW_CONFIDENCE' ? 'active' : ''}`}
            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
          >
            Low Confidence (&lt;80%)
          </button>
          <button 
            onClick={() => { setScanScenario('NO_MATCH'); startScan('NO_MATCH'); }}
            className={`sim-btn ${scanScenario === 'NO_MATCH' ? 'active' : ''}`}
            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
          >
            No Match
          </button>
        </div>
      </div>
    </div>
  );
};
