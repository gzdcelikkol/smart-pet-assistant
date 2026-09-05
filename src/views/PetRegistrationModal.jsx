import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { 
  X, 
  Camera, 
  Check, 
  AlertCircle, 
  QrCode, 
  Sparkles, 
  WifiOff, 
  ArrowRight,
  RefreshCw,
  Dog,
  Cat
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const PetRegistrationModal = ({ isOpen, onClose }) => {
  const { registerNewPet, isCollarIdDuplicate, isOnline } = usePet();

  const [step, setStep] = useState(1); // 1: Info, 2: Camera, 3: Confirmation
  const [formData, setFormData] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    age: '',
    weightKg: '',
    medicalInfo: '',
    collarId: ''
  });
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdPet, setCreatedPet] = useState(null);

  if (!isOpen) return null;

  // Sample preset photos to choose or simulate camera
  const samplePhotos = {
    DOG: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80"
    ],
    CAT: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80"
    ],
    RABBIT: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80"
    ],
    HAMSTER: [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
    ]
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Offline mode check (Alternative Flow A)
    if (!isOnline) {
      setErrorMsg('Offline mode: Full registration Mode disabled without internet connectivity.');
      sounds.playAlert();
      return;
    }

    // Required fields check (Alternative Flow C)
    if (!formData.name.trim() || !formData.breed.trim() || !formData.age || !formData.collarId.trim()) {
      setErrorMsg('Please enter valid data for all required fields (Name, Breed, Age, Collar ID).');
      sounds.playAlert();
      return;
    }

    // Duplicate Collar ID check (Alternative Flow B)
    if (isCollarIdDuplicate(formData.collarId)) {
      setErrorMsg(`This collar ID "${formData.collarId}" is already registered to another pet! Please enter a unique collar ID.`);
      sounds.playAlert();
      return;
    }

    sounds.playBeep();
    setStep(2);
  };

  const handleCapturePhoto = (photoUrl) => {
    sounds.playShutter();
    setCapturedPhoto(photoUrl);
  };

  const handleFinalSubmit = () => {
    if (!capturedPhoto) {
      const def = samplePhotos[formData.species]?.[0] || samplePhotos.DOG[0];
      setCapturedPhoto(def);
    }

    const newPet = registerNewPet({
      ...formData,
      photoUrl: capturedPhoto || samplePhotos[formData.species]?.[0] || samplePhotos.DOG[0]
    });

    setCreatedPet(newPet);
    setStep(3);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      name: '',
      species: 'DOG',
      breed: '',
      age: '',
      weightKg: '',
      medicalInfo: '',
      collarId: ''
    });
    setCapturedPhoto(null);
    setErrorMsg('');
    setCreatedPet(null);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-bottom-sheet">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-status badge-normal">Step {step} of 3</span>
              {!isOnline && <span className="badge-status badge-critical"><WifiOff size={10} /> Offline</span>}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
              {step === 1 && 'Pet Registration - Basic Info'}
              {step === 2 && 'Capture Photo & Link Profile'}
              {step === 3 && 'Registration Confirmation'}
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer' 
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#fecdd3',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} color="#f43f5e" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label>Animal Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {['DOG', 'CAT', 'RABBIT', 'HAMSTER'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, species: type })}
                    style={{
                      background: formData.species === type ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.05)',
                      border: formData.species === type ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '8px 4px',
                      color: formData.species === type ? '#38bdf8' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {type === 'DOG' && 'Dog 🐶'}
                    {type === 'CAT' && 'Cat 🐱'}
                    {type === 'RABBIT' && 'Rabbit 🐰'}
                    {type === 'HAMSTER' && 'Hamster 🐹'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Pet Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Charlie"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Breed / Specie *</label>
                <input
                  type="text"
                  placeholder="e.g. Beagle"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Age (Years) *</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 2"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg) *</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 14.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Smart Collar ID (BLE / QR) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. BG89-KL12"
                  value={formData.collarId}
                  onChange={(e) => setFormData({ ...formData, collarId: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, collarId: `SC-${Math.floor(1000 + Math.random() * 9000)}` });
                    sounds.playBeep();
                  }}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer'
                  }}
                  title="Generate Random Smart Collar ID"
                >
                  <QrCode size={18} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Medical History & Notes</label>
              <textarea
                placeholder="Vaccinations, allergies, or veterinary remarks..."
                value={formData.medicalInfo}
                onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                className="form-input"
                rows={2}
                style={{ resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
              <span>Proceed to Biometric Photo Step</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 2: Camera Capture */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Point camera at your pet's face. The PetVision AI module will extract features and create a biometric profile.
            </p>

            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '240px',
              background: '#000',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Image Preview */}
              <img 
                src={capturedPhoto || samplePhotos[formData.species]?.[0] || samplePhotos.DOG[0]} 
                alt="Pet Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* AR HUD Bounding Box Overlay */}
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                border: '2px dashed #00f0ff',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  background: '#00f0ff',
                  color: '#000',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px'
                }}>
                  AI FACE SCAN
                </div>
              </div>

              {/* Status overlay */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                padding: '6px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem'
              }}>
                <span style={{ color: '#38bdf8' }}>Target: {formData.name} ({formData.species})</span>
                <span style={{ color: '#00ffaa' }}>98% Ready</span>
              </div>
            </div>

            {/* Quick sample pickers */}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                Select Reference Photo or Trigger Camera:
              </label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {(samplePhotos[formData.species] || samplePhotos.DOG).map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt="Sample"
                    onClick={() => handleCapturePhoto(photo)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: capturedPhoto === photo ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={handleFinalSubmit} 
                className="btn-primary"
                style={{ flex: 2 }}
              >
                <Camera size={18} />
                <span>Save Photo & Link Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Registration Confirmation */}
        {step === 3 && createdPet && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
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
              <Check size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                {createdPet.name} Successfully Registered!
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                Profile synced with cloud database. The pet is now identifiable in real-time.
              </p>
            </div>

            {/* Pet Summary Card */}
            <div className="glass-card" style={{ textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <img 
                src={createdPet.photoUrl} 
                alt={createdPet.name} 
                style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #06b6d4' }} 
              />
              <div style={{ flex: 1, fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{createdPet.name}</div>
                <div style={{ color: '#94a3b8' }}>{createdPet.breed} • {createdPet.age} yrs</div>
                <div style={{ color: '#38bdf8', marginTop: '4px', fontSize: '0.74rem' }}>
                  Collar ID: <strong>{createdPet.collarId}</strong>
                </div>
              </div>
            </div>

            <button onClick={handleClose} className="btn-primary" style={{ width: '100%' }}>
              <span>Finish & Return to Assistant</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
