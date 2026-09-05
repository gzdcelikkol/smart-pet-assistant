import React from 'react';
import { usePet } from '../context/PetContext';
import { 
  LayoutDashboard, 
  ScanFace, 
  MapPin, 
  Activity, 
  Utensils, 
  Camera 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const BottomNav = () => {
  const { currentView, setCurrentView } = usePet();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recognition', label: 'AR Vision', icon: ScanFace },
    { id: 'tracker', label: 'Collar & GPS', icon: MapPin },
    { id: 'health', label: 'Health & Vet', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'memories', label: 'Memories', icon: Camera }
  ];

  const handleNavClick = (id) => {
    sounds.playBeep();
    setCurrentView(id);
  };

  return (
    <nav className="phone-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id || 
          (item.id === 'nutrition' && (currentView === 'nutrition' || currentView === 'calculator')) ||
          (item.id === 'health' && (currentView === 'health' || currentView === 'vet')) ||
          (item.id === 'memories' && (currentView === 'memories' || currentView === 'journal' || currentView === 'capture'));

        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <div className="nav-icon-container">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span>{item.label}</span>
            {isActive && <div className="nav-indicator-dot" />}
          </button>
        );
      })}
    </nav>
  );
};
