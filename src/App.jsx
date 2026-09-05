import React, { useState } from 'react';
import { PetProvider, usePet } from './context/PetContext';
import { GlassesContainer } from './components/GlassesContainer';
import { DashboardView } from './views/DashboardView';
import { PetRegistrationModal } from './views/PetRegistrationModal';
import { PetRecognitionView } from './views/PetRecognitionView';
import { CollarRecognitionView } from './views/CollarRecognitionView';
import { LostPetTrackerView } from './views/LostPetTrackerView';
import { HealthOverlayView } from './views/HealthOverlayView';
import { VetTeleconsultationView } from './views/VetTeleconsultationView';
import { NutritionScannerView } from './views/NutritionScannerView';
import { NutritionCalculatorView } from './views/NutritionCalculatorView';
import { MemoryCaptureView } from './views/MemoryCaptureView';
import { MemoryJournalView } from './views/MemoryJournalView';
import { 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';
import { sounds } from './utils/soundEffects';

const MainAppContent = () => {
  const { 
    currentView, 
    setCurrentView, 
    phoneFrameMode, 
    setPhoneFrameMode, 
    isOnline, 
    setIsOnline, 
    toggleHealthAnomaly, 
    toggleSafeZoneBreach, 
    triggerCallInterrupt 
  } = usePet();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Render view by current ID
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'recognition':
        return <PetRecognitionView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'collar':
        return <CollarRecognitionView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'tracker':
        return <LostPetTrackerView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'health':
        return <HealthOverlayView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'vet':
        return <VetTeleconsultationView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'nutrition':
        return <NutritionScannerView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'calculator':
        return <NutritionCalculatorView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'capture':
        return <MemoryCaptureView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'journal':
        return <MemoryJournalView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      default:
        return <DashboardView onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Background ambient lighting */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Top Controller Bar for Demo / Desktop Inspection */}
      <aside className="desktop-controls-bar" aria-label="Demo Controller Bar">
        <div className="title-tag">
          <Sparkles size={16} color="#10b981" />
          <span>PetVision AR</span>
          <span className="badge">10 Modules Active</span>
        </div>

        <div className="sim-btn-group">
          {/* Glasses Frame Toggle */}
          <button 
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            className={`sim-btn ${phoneFrameMode ? 'active' : ''}`}
            title="Toggle Smart Glasses Frame / Expanded View"
          >
            <Smartphone size={14} />
            <span>{phoneFrameMode ? 'AR Glasses Frame' : 'Expanded'}</span>
          </button>

          {/* Online / Offline Toggle (Testing Use Case 3.1 Alternative Flow A) */}
          <button 
            onClick={() => {
              setIsOnline(!isOnline);
              sounds.playBeep();
            }}
            className={`sim-btn ${!isOnline ? 'danger' : ''}`}
            title="Test Offline Mode (UML Alt. Flow A)"
          >
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </button>

          {/* Quick Anomaly Trigger */}
          <button 
            onClick={toggleHealthAnomaly}
            className="sim-btn danger"
            title="Trigger Critical Health Anomaly (Fever / High Pulse)"
          >
            <ShieldAlert size={14} />
            <span>Vital Alert</span>
          </button>

          {/* Quick Safe-Zone Breach Trigger */}
          <button 
            onClick={toggleSafeZoneBreach}
            className="sim-btn"
            style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.4)' }}
            title="Safe Zone Breach (GPS Lost Pet Radar)"
          >
            <MapPin size={14} />
            <span>Lost Pet Radar</span>
          </button>

          {/* Incoming Call Interrupt (Use Case 3.9 / 3.10 Alt Flow D) */}
          <button 
            onClick={() => triggerCallInterrupt('Mom (Incoming Call)')}
            className="sim-btn"
            title="Simulate Incoming Phone Call Interrupt (Alt. Flow D)"
          >
            <PhoneCall size={14} />
            <span>Call Interrupt</span>
          </button>

          {/* Add Pet */}
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="sim-btn active"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
          >
            <PlusCircle size={14} />
            <span>Add New Pet</span>
          </button>
        </div>
      </aside>

      {/* Main AR Shell */}
      <GlassesContainer>
        {renderCurrentView()}
      </GlassesContainer>

      {/* Pet Registration Modal */}
      <PetRegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <PetProvider>
      <MainAppContent />
    </PetProvider>
  );
}
