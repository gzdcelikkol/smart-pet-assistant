import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  Camera, 
  Video, 
  Mic, 
  MicOff, 
  Square, 
  Check, 
  AlertCircle, 
  PhoneCall, 
  Volume2, 
  Sparkles, 
  HardDrive, 
  RefreshCw,
  Film
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const MemoryCaptureView = ({ onOpenRegisterModal }) => {
  const { 
    activePet, 
    addMemory, 
    triggerCallInterrupt, 
    setCurrentView 
  } = usePet();

  const [mode, setMode] = useState('PHOTO'); // 'PHOTO' | 'VIDEO'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [listeningVoice, setListeningVoice] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [testScenario, setTestScenario] = useState('NORMAL'); // 'NORMAL' | 'STORAGE_FULL' | 'CALL_INTERRUPT'
  const [storageFullAlert, setStorageFullAlert] = useState(false);
  const [lastCapturedPreview, setLastCapturedPreview] = useState(null);

  // Video recording timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 14) {
            // Auto finish after 15 seconds (Requirements 3.9 Step 3: 10-15s limit)
            handleFinishRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Handle voice command simulation
  const handleTriggerVoiceCommand = (commandText) => {
    setListeningVoice(true);
    setRecognizedText(`Listening for "${commandText}"...`);
    sounds.playBeep();

    setTimeout(() => {
      setListeningVoice(false);
      setRecognizedText(`Recognized Command: "${commandText}"`);

      if (commandText === 'Record!') {
        handleStartRecording();
      } else if (commandText === 'Capture photo' || commandText === 'Capture this moment') {
        handleCapturePhoto();
      } else if (commandText === 'Cancel!' || commandText === 'Stop!') {
        handleCancelRecording();
      } else {
        // Alternative Flow A: Command not recognized
        sounds.playAlert();
        setRecognizedText('⚠️ Command not recognized');
      }
    }, 1000);
  };

  const handleCapturePhoto = () => {
    // Alternative Flow B: Storage full check
    if (testScenario === 'STORAGE_FULL') {
      sounds.playAlert();
      setStorageFullAlert(true);
      return;
    }

    // Alternative Flow D: Call interrupt simulation
    if (testScenario === 'CALL_INTERRUPT') {
      triggerCallInterrupt('Dr. Lee (Veterinary Call)');
      return;
    }

    sounds.playShutter();
    const photo = addMemory({
      title: `${activePet?.name} - Joyful Moment`,
      type: 'photo',
      duration: 'Photo',
      url: activePet?.photoUrl,
      caption: 'Captured via voice command ("Capture photo")'
    });
    setLastCapturedPreview(photo);
  };

  const handleStartRecording = () => {
    if (testScenario === 'STORAGE_FULL') {
      sounds.playAlert();
      setStorageFullAlert(true);
      return;
    }

    if (testScenario === 'CALL_INTERRUPT') {
      triggerCallInterrupt('Veterinary Hospital (Priority Call)');
      return;
    }

    sounds.playBeep();
    setMode('VIDEO');
    setIsRecording(true);
  };

  const handleFinishRecording = () => {
    setIsRecording(false);
    sounds.playSuccess();
    const video = addMemory({
      title: `${activePet?.name} Play Clip`,
      type: 'video',
      duration: `0:${recordingSeconds.toString().padStart(2, '0')}`,
      url: activePet?.photoUrl,
      caption: 'H.265 compressed memory clip saved to journal.'
    });
    setLastCapturedPreview(video);
  };

  // Alternative Flow C: User cancels recording mid-way
  const handleCancelRecording = () => {
    setIsRecording(false);
    sounds.playAlert();
    alert('Recording cancelled ("Cancel!"). Buffer discarded and memory deleted.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <ViewHeader 
        title="Memory Capture" 
        subtitle="Voice Control & Camera Viewfinder" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body" style={{ paddingBottom: '6px' }}>
        {/* Storage Full Emergency Error Banner (Alternative Flow B) */}
        {storageFullAlert && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.25)',
            border: '1px solid #f43f5e',
            borderRadius: '14px',
            padding: '12px',
            color: '#fecdd3',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardDrive size={18} color="#f43f5e" />
              <span>Error: Storage space full. Memory could not be saved.</span>
            </div>
            <button 
              onClick={() => setStorageFullAlert(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Camera Viewfinder with HUD Reticle */}
        <div style={{
          position: 'relative',
          height: '230px',
          borderRadius: '18px',
          overflow: 'hidden',
          background: '#000',
          border: isRecording ? '2px solid #ff0055' : '1.5px solid rgba(6, 182, 212, 0.4)',
          boxShadow: isRecording ? '0 0 25px rgba(255, 0, 85, 0.4)' : '0 8px 30px rgba(0,0,0,0.6)'
        }}>
          <img 
            src={activePet?.photoUrl} 
            alt="Pet Camera Feed"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* AR HUD Overlay */}
          <div className="ar-hud-overlay">
            <div className="ar-corner-tl" />
            <div className="ar-corner-tr" />
            <div className="ar-corner-bl" />
            <div className="ar-corner-br" />

            {/* Top recording status indicator */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '12px',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#fff'
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
                padding: '3px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isRecording ? (
                  <>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0055', animation: 'pulse 1s infinite' }} />
                    <strong style={{ color: '#ff0055' }}>REC 00:{recordingSeconds.toString().padStart(2, '0')}</strong>
                  </>
                ) : (
                  <span style={{ color: '#00f0ff' }}>STANDBY ({mode})</span>
                )}
              </div>
              <span style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '8px', fontSize: '0.65rem' }}>
                H.265 1080p
              </span>
            </div>

            {/* Central Framing Reticle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              border: `1.5px dashed ${isRecording ? '#ff0055' : '#00f0ff'}`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${isRecording ? 'rgba(255,0,85,0.4)' : 'rgba(0,240,255,0.3)'}`
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isRecording ? '#ff0055' : '#00f0ff' }} />
            </div>

            {/* Voice Command Feedback Banner on Camera */}
            {recognizedText && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                borderRadius: '10px',
                padding: '6px 10px',
                fontSize: '0.72rem',
                color: '#fff',
                textAlign: 'center'
              }}>
                {recognizedText}
              </div>
            )}
          </div>
        </div>

        {/* Voice Command Bar (Section 3.9 Voice Recognition) */}
        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mic size={15} color="#06b6d4" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                Voice Command Recognition (95% Accuracy)
              </span>
            </div>
            {listeningVoice && (
              <span style={{ fontSize: '0.68rem', color: '#00ffaa', animation: 'pulse 1s infinite' }}>
                🎙️ Listening...
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['"Record!"', '"Capture photo"', '"Capture this moment"', '"Cancel!"'].map((cmd) => {
              const cleanCmd = cmd.replace(/"/g, '');
              return (
                <button
                  key={cmd}
                  onClick={() => handleTriggerVoiceCommand(cleanCmd)}
                  className="sim-btn"
                  style={{ fontSize: '0.72rem', padding: '6px 10px' }}
                >
                  <Volume2 size={12} />
                  <span>{cmd}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Camera Touch Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '8px 0' }}>
          {isRecording ? (
            <>
              <button 
                onClick={handleCancelRecording}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '8px 14px', color: '#fecdd3' }}
              >
                Cancel ("Stop")
              </button>
              <button
                onClick={handleFinishRecording}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#f43f5e',
                  border: '4px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(244, 63, 94, 0.6)'
                }}
                title="Finish & Save Recording"
              >
                <Square size={24} fill="#fff" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setMode(mode === 'PHOTO' ? 'VIDEO' : 'PHOTO')}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '8px 14px' }}
              >
                {mode === 'PHOTO' ? <Video size={16} /> : <Camera size={16} />}
                <span>{mode === 'PHOTO' ? 'Switch Video' : 'Switch Photo'}</span>
              </button>

              {/* Big Shutter Button */}
              <button
                onClick={mode === 'PHOTO' ? handleCapturePhoto : handleStartRecording}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: mode === 'PHOTO' ? '#fff' : '#f43f5e',
                  border: '4px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.15s ease'
                }}
                title="Capture Media"
              >
                {mode === 'PHOTO' ? (
                  <Camera size={26} color="#000" />
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff' }} />
                )}
              </button>

              <button 
                onClick={() => { sounds.playBeep(); setCurrentView('journal'); }}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '8px 14px' }}
              >
                <Film size={16} />
                <span>Journal ({activePet?.memories?.length || 0})</span>
              </button>
            </>
          )}
        </div>

        {/* Test Scenarios */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            🧪 Capture Test Scenarios
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button 
              onClick={() => { setTestScenario('NORMAL'); sounds.playBeep(); }}
              className={`sim-btn ${testScenario === 'NORMAL' ? 'active' : ''}`}
              style={{ fontSize: '0.68rem', justifyContent: 'center' }}
            >
              Normal Capture
            </button>
            <button 
              onClick={() => { setTestScenario('STORAGE_FULL'); sounds.playAlert(); }}
              className={`sim-btn ${testScenario === 'STORAGE_FULL' ? 'active' : ''}`}
              style={{ fontSize: '0.68rem', justifyContent: 'center' }}
            >
              Storage Full
            </button>
            <button 
              onClick={() => { setTestScenario('CALL_INTERRUPT'); sounds.playAlert(); }}
              className={`sim-btn ${testScenario === 'CALL_INTERRUPT' ? 'active' : ''}`}
              style={{ fontSize: '0.68rem', justifyContent: 'center' }}
            >
              Call Interrupt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
