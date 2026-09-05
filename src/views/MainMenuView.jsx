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
  Heart,
  LayoutDashboard,
  Calculator,
  ShieldAlert
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const MainMenuView = ({ onOpenRegisterModal }) => {
  const { setCurrentView, activePet } = usePet();

  const handleAction = (viewName) => {
    sounds.playBeep();
    setCurrentView(viewName);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#38bdf8' },
    { id: 'recognition', label: 'Pet Recognition', icon: ScanFace, color: '#06b6d4' },
    { id: 'collar', label: 'Smart Collar', icon: Activity, color: '#818cf8' },
    { id: 'tracker', label: 'Lost Pet Radar', icon: MapPin, color: '#f59e0b' },
    { id: 'health', label: 'Health Overlay', icon: Heart, color: '#f43f5e' },
    { id: 'vet', label: 'Vet Consult', icon: ShieldAlert, color: '#ef4444' },
    { id: 'nutrition', label: 'Food Scanner', icon: Utensils, color: '#10b981' },
    { id: 'calculator', label: 'Calorie Plan', icon: Calculator, color: '#34d399' },
    { id: 'capture', label: 'Memory Capture', icon: Camera, color: '#f59e0b' },
    { id: 'journal', label: 'Memory Journal', icon: Film, color: '#c084fc' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ViewHeader 
        title="PetVision OS" 
        subtitle="Select a module to launch" 
        onOpenRegisterModal={onOpenRegisterModal}
        hideHomeButton={true} 
      />

      <div className="scrollable-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ar-app-grid">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="ar-app-icon"
                onClick={() => handleAction(item.id)}
              >
                <div className="icon-wrapper" style={{ borderColor: item.color, boxShadow: `0 0 15px ${item.color}40` }}>
                  <Icon size={32} color={item.color} />
                </div>
                <span className="icon-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
