import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Camera, 
  AlertCircle, 
  ShieldCheck, 
  Heart, 
  Thermometer, 
  Calendar, 
  Send, 
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const VetTeleconsultationView = ({ onOpenRegisterModal }) => {
  const { activePet, setCurrentView } = usePet();

  // Call status: 'CONNECTING' | 'CONNECTED' | 'UNAVAILABLE' | 'ENDED'
  const [callStatus, setCallStatus] = useState('CONNECTING');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [activeVetFeedback, setActiveVetFeedback] = useState(null);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'vet', text: 'Hello! I am Dr. Lee. I am receiving your live video and telemetry feed. How can I help your pet today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Call connection simulation
  useEffect(() => {
    sounds.playBeep();
    const timer = setTimeout(() => {
      setCallStatus('CONNECTED');
      sounds.playBluetooth();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleEndCall = () => {
    sounds.playAlert();
    setCallStatus('ENDED');
  };

  const handleVetAction = (actionType) => {
    sounds.playBeep();
    if (actionType === 'EMERGENCY') {
      setActiveVetFeedback({
        type: 'EMERGENCY',
        title: 'Emergency Advice',
        message: 'Keep your pet in a cool, shaded area, ensure clean hydration, and proceed to the emergency clinic immediately.',
        color: '#f43f5e'
      });
      setChatMessages(prev => [...prev, {
        sender: 'vet',
        text: '⚠️ EMERGENCY ADVICE: Elevated body temperature detected. Please gently dampen paws with cool water and bring your pet to the clinic immediately.'
      }]);
    } else if (actionType === 'BEHAVIORAL') {
      setActiveVetFeedback({
        type: 'BEHAVIORAL',
        title: 'Behavioral Help',
        message: 'Gait and posture indicate mild fatigue or environmental stress. Provide quiet resting space.',
        color: '#38bdf8'
      });
      setChatMessages(prev => [...prev, {
        sender: 'vet',
        text: '🐾 Behavioral Assessment: Posture appears calm but lethargic. Allow 2 hours of quiet rest and monitor hydration.'
      }]);
    } else if (actionType === 'CLINIC') {
      setActiveVetFeedback({
        type: 'CLINIC',
        title: 'Suggest Clinic Visit',
        message: 'Physical examination and blood screening scheduled for tomorrow at 10:00 AM.',
        color: '#10b981'
      });
      setChatMessages(prev => [...prev, {
        sender: 'vet',
        text: '🏥 Clinic Visit Recommended: I have scheduled a clinic appointment for a comprehensive diagnostic check.'
      }]);
    }
  };

  const handleSendSnapshot = () => {
    sounds.playShutter();
    setSnapshotTaken(true);
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: '📷 [High-Resolution Symptom Photo Transmitted]' },
        { sender: 'vet', text: 'Snapshot received and reviewed. The clear image helps confirm diagnosis.' }
      ]);
      setSnapshotTaken(false);
    }, 1200);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setChatInput('');
    sounds.playBeep();

    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'vet', 
        text: `Understood. I am tracking ${activePet?.name}'s vitals closely and have noted your comments.` 
      }]);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <ViewHeader 
        title="Vet Teleconsultation" 
        subtitle="Dr. Lee • Live Video Consultation" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body" style={{ paddingBottom: '10px' }}>
        {/* Call Container */}
        {callStatus === 'CONNECTING' && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.2)',
              border: '2px solid #06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              animation: 'pulse 1.5s infinite'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1594824813689-5fe4d650116e?auto=format&fit=crop&w=200&q=80" 
                alt="Dr. Lee" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Connecting to Dr. Lee...</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Establishing AES-256 Encrypted Teleconsultation Stream (720p @ 30fps)
            </p>
          </div>
        )}

        {callStatus === 'CONNECTED' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Live Video Feeds Viewport */}
            <div style={{
              position: 'relative',
              height: '220px',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#000',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}>
              {/* Pet Camera Stream (Main View) */}
              <img 
                src={activePet?.photoUrl} 
                alt="Pet Camera Feed"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Picture-in-Picture Vet Stream (Top Right) */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '85px',
                height: '110px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #00f0ff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.7)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1594824813689-5fe4d650116e?auto=format&fit=crop&w=300&q=80" 
                  alt="Dr. Lee Live"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'rgba(0,0,0,0.7)',
                  fontSize: '0.58rem',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '2px 0'
                }}>
                  Dr. Lee (Online)
                </div>
              </div>

              {/* Shared Live Health Vitals Overlay on Screen (Figure 34 GUI Prototype) */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '8px 10px',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                fontSize: '0.7rem',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ fontSize: '0.62rem', color: '#00f0ff', fontWeight: 800 }}>SHARED HEALTH DATA</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={10} color="#ff0055" className="heart-pulse" />
                  <span>{activePet?.vitals?.heartRate} bpm</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={10} color="#38bdf8" />
                  <span>{activePet?.vitals?.temperature}°C</span>
                </div>
              </div>

              {/* Bottom Security / Encryption Tag */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.62rem',
                color: '#10b981',
                background: 'rgba(0,0,0,0.6)',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                <ShieldCheck size={10} />
                <span>AES-256 Encrypted</span>
              </div>
            </div>

            {/* In-Call Action Toolbar (Figure 34 Prototype) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button 
                onClick={() => handleVetAction('EMERGENCY')}
                style={{
                  background: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid #f43f5e',
                  color: '#fecdd3',
                  borderRadius: '10px',
                  padding: '8px 4px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Emergency Advice
              </button>
              <button 
                onClick={() => handleVetAction('BEHAVIORAL')}
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8',
                  color: '#e0f2fe',
                  borderRadius: '10px',
                  padding: '8px 4px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Behavioral Help
              </button>
              <button 
                onClick={() => handleVetAction('CLINIC')}
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  color: '#d1fae5',
                  borderRadius: '10px',
                  padding: '8px 4px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Suggest Clinic Visit
              </button>
            </div>

            {/* Media Snapshot capture requested by vet (Alternative Flow B) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleSendSnapshot}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.74rem' }}
              >
                <Camera size={14} />
                <span>Send Symptom Photo (Alt. Flow B)</span>
              </button>
              <button 
                onClick={handleEndCall}
                className="btn-danger"
                style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              >
                <PhoneOff size={16} />
                <span>End Call</span>
              </button>
            </div>

            {/* Interactive Chat Log with Vet */}
            <div className="glass-card" style={{ padding: '12px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                Consultation Notes & Chat
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.06)',
                      border: msg.sender === 'user' ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      fontSize: '0.72rem',
                      color: '#fff',
                      maxWidth: '85%'
                    }}
                  >
                    <strong>{msg.sender === 'user' ? 'You: ' : 'Dr. Lee: '}</strong>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  placeholder="Type a message to veterinarian..." 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem' }}
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ padding: '6px 12px' }}
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Alternative Flow A: Vet Unavailable Screen */}
        {callStatus === 'UNAVAILABLE' && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <AlertCircle size={36} color="#f59e0b" style={{ margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>No Veterinarian Available</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              All veterinarians are currently busy. You may choose to schedule an appointment instead.
            </p>
            <button 
              onClick={() => { setCallStatus('CONNECTING'); }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '14px', fontSize: '0.8rem' }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Call Ended Summary */}
        {callStatus === 'ENDED' && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Consultation Concluded</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Consultation notes and recommendations have been saved to {activePet?.name}'s medical history.
            </p>
            <button 
              onClick={() => setCurrentView('health')}
              className="btn-primary"
              style={{ width: '100%', marginTop: '14px', fontSize: '0.8rem' }}
            >
              Back to Health Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
