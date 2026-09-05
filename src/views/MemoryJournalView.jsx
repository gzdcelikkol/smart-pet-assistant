import React, { useState, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  Film, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Music, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  X,
  Share2,
  Trash2,
  Plus
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const MemoryJournalView = ({ onOpenRegisterModal }) => {
  const { activePet, setCurrentView, triggerCallInterrupt } = usePet();

  // Screen states: 'GALLERY' | 'AI_COMPILING' | 'PLAYBACK'
  const [viewState, setViewState] = useState('GALLERY');
  const [compilingProgress, setCompilingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [musicMuted, setMusicMuted] = useState(false);
  const [stopMusicFn, setStopMusicFn] = useState(null);
  const [compilationErrorAlert, setCompilationErrorAlert] = useState(false);

  const memories = activePet?.memories || [];

  // Start AI Compilation Flow (Figure 48 GUI Prototype)
  const handlePlayMemoryMovie = (simulateError = false) => {
    // Prerequisite Check (Section 3.10 Step 2: At least 3 media files)
    if (memories.length < 3) {
      sounds.playAlert();
      alert(`Anı Günlüğü için en az 3 fotoğraf veya video gereklidir (Şu an: ${memories.length}). Lütfen önce çekim yapın!`);
      return;
    }

    sounds.playBeep();
    setViewState('AI_COMPILING');
    setCompilingProgress(15);
    setCompilationErrorAlert(false);

    let progress = 15;
    const interval = setInterval(() => {
      progress += 20;
      setCompilingProgress(Math.min(100, progress));

      if (progress >= 100) {
        clearInterval(interval);

        if (simulateError) {
          // Alternative Flow C: AI Compilation Error
          sounds.playAlert();
          setCompilationErrorAlert(true);
          setViewState('GALLERY');
        } else {
          // Start Playback Mode (Figure 49 GUI Prototype)
          sounds.playSuccess();
          setViewState('PLAYBACK');
          setIsPlaying(true);
          setActiveStoryIndex(0);

          // Start ambient story music
          const stopAudio = sounds.playJournalMusic();
          setStopMusicFn(() => stopAudio);
        }
      }
    }, 400);
  };

  // Clean up music on unmount
  useEffect(() => {
    return () => {
      if (stopMusicFn) stopMusicFn();
    };
  }, [stopMusicFn]);

  // Story slide advancement during playback
  useEffect(() => {
    let timer;
    if (viewState === 'PLAYBACK' && isPlaying && memories.length > 0) {
      timer = setInterval(() => {
        setActiveStoryIndex((prev) => {
          if (prev >= memories.length - 1) {
            // End of film (Section 3.10 Step 7: Closes player, returns to menu)
            handleStopPlayback();
            return 0;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [viewState, isPlaying, memories.length]);

  // Alternative Flow A: User Stops Playback Early
  const handleStopPlayback = () => {
    if (stopMusicFn) stopMusicFn();
    setIsPlaying(false);
    setViewState('GALLERY');
    sounds.playBeep();
  };

  // Alternative Flow B: User Pauses Playback
  const handleTogglePause = () => {
    setIsPlaying(!isPlaying);
    sounds.playBeep();
  };

  const currentMemoryItem = memories[activeStoryIndex] || memories[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <ViewHeader 
        title="AI Anı Günlüğü" 
        subtitle="Haftalık Öne Çıkanlar & Hikaye Filmi" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body">
        {/* Compilation Error Alert Banner (Alternative Flow C) */}
        {compilationErrorAlert && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.25)',
            border: '1px solid #f43f5e',
            borderRadius: '14px',
            padding: '12px',
            fontSize: '0.78rem',
            color: '#fecdd3',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} color="#f43f5e" />
            <div>
              <strong>Hata: Anı günlüğü oluşturulamadı!</strong>
              <div style={{ fontSize: '0.7rem' }}>Bozuk bir video dosyası veya yapay zeka derleme motoru hatası tespit edildi.</div>
            </div>
          </div>
        )}

        {/* STATE 1: GALLERY VIEW */}
        {viewState === 'GALLERY' && (
          <>
            {/* AI Compilation Hero Banner */}
            <div className="glass-card" style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              boxShadow: '0 8px 30px rgba(168, 85, 247, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Sparkles size={14} />
                <span>Yapay Zeka Destekli Derleme</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                Haftalık Öne Çıkanlar Hikayesi
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                {activePet?.name} ile kaydedilen tüm fotoğrafları ve 15 saniyelik video klipleri duygusal bir mini filme dönüştürün.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button 
                  onClick={() => handlePlayMemoryMovie(false)}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
                    fontSize: '0.85rem'
                  }}
                >
                  <Play size={16} fill="#fff" />
                  <span>"Play Memory Movie" Başlat</span>
                </button>
                <button 
                  onClick={() => setCurrentView('capture')}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  <Plus size={14} />
                  <span>Yeni Çek</span>
                </button>
              </div>
            </div>

            {/* Memories List Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                Kaydedilen Anılar ({memories.length})
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Min. 3 Anı Gereklidir
              </span>
            </div>

            {/* Memories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {memories.map((item, index) => (
                <div 
                  key={item.id}
                  className="glass-card"
                  style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => {
                    setActiveStoryIndex(index);
                    setViewState('PLAYBACK');
                    setIsPlaying(true);
                  }}
                >
                  <div style={{ position: 'relative', height: '110px' }}>
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'rgba(0,0,0,0.6)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '0.62rem',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      {item.type === 'video' ? <Film size={10} color="#38bdf8" /> : <Clock size={10} />}
                      <span>{item.duration}</span>
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Scenarios */}
            <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                🧪 Anı Günlüğü Test Senaryoları
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => handlePlayMemoryMovie(false)}
                  className="sim-btn"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.68rem' }}
                >
                  Başarılı AI Derleme
                </button>
                <button 
                  onClick={() => handlePlayMemoryMovie(true)}
                  className="sim-btn danger"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.68rem' }}
                >
                  Derleme Hatası (Alt. C)
                </button>
              </div>
            </div>
          </>
        )}

        {/* STATE 2: AI COMPILATION SCREEN (Figure 48 GUI Prototype) */}
        {viewState === 'AI_COMPILING' && (
          <div style={{
            position: 'relative',
            height: '380px',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#000',
            border: '1.5px solid #a855f7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(168, 85, 247, 0.4)'
          }}>
            <img 
              src={activePet?.photoUrl} 
              alt="Compiling background"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, filter: 'blur(3px)' }}
            />

            {/* AR Overlay (Figure 48) */}
            <div className="ar-hud-overlay" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div className="ar-corner-tl" />
              <div className="ar-corner-tr" />
              <div className="ar-corner-bl" />
              <div className="ar-corner-br" />

              <div style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '20px',
                padding: '24px 20px',
                textAlign: 'center',
                width: '85%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
              }}>
                <Sparkles size={36} color="#c084fc" style={{ animation: 'pulse 1s infinite', margin: '0 auto 10px auto' }} />
                
                <div style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI Compilation Generating...
                </div>
                
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>
                  Processing Memories: %{compilingProgress}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Başlık: "{activePet?.name}'s Weekly Highlights Reel"
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                  Tahmini Süre: 02:30 • Müzik ve Geçişler Ekleniyor
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '14px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${compilingProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: PLAYBACK MODE (Figure 49 GUI Prototype) */}
        {viewState === 'PLAYBACK' && (
          <div style={{
            position: 'relative',
            height: '420px',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#000',
            border: '1.5px solid #00f0ff',
            boxShadow: '0 0 35px rgba(0, 240, 255, 0.35)'
          }}>
            <img 
              src={currentMemoryItem?.url || activePet?.photoUrl} 
              alt={currentMemoryItem?.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Dark glass overlay gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.1) 60%, rgba(9, 13, 22, 0.7) 100%)'
            }} />

            {/* Top Bar with Exit and Music button */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              right: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 30
            }}>
              <span className="badge-status badge-normal" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff', borderColor: '#00f0ff' }}>
                Memory Journal Mode
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => triggerCallInterrupt('Annem (Öncelikli Çağrı)')}
                  style={{
                    background: 'rgba(244, 63, 94, 0.3)',
                    border: '1px solid rgba(244, 63, 94, 0.5)',
                    color: '#fecdd3',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Arama Kesintisi Testi (Alt. Flow D)"
                >
                  <AlertCircle size={15} />
                </button>
                <button
                  onClick={handleStopPlayback}
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Çıkış ('X' Icon - Alt. Flow A)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* AR Central Frame Bounding Reticle (Figure 49) */}
            <div style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '140px',
              border: '2px solid #00f0ff',
              borderRadius: '16px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
            }} />

            {/* Bottom Controls (Figure 49 GUI Prototype: Play/Pause, Title, Exit) */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '16px',
              padding: '12px 16px',
              zIndex: 30
            }}>
              {/* Progress track */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {memories.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      background: i <= activeStoryIndex ? '#00f0ff' : 'rgba(255,255,255,0.15)'
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                    {currentMemoryItem?.title || `${activePet?.name}'s Memory`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '2px' }}>
                    {currentMemoryItem?.caption} • {currentMemoryItem?.date}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Play / Pause Toggle (Alternative Flow B) */}
                  <button
                    onClick={handleTogglePause}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#00f0ff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      cursor: 'pointer'
                    }}
                    title={isPlaying ? 'Duraklat (Pause)' : 'Oynat (Play)'}
                  >
                    {isPlaying ? <Pause size={18} fill="#000" /> : <Play size={18} fill="#000" />}
                  </button>

                  <button
                    onClick={handleStopPlayback}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    Durdur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
