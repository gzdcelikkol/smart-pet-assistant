import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { PlusCircle, ChevronDown, Wifi, WifiOff, Sparkles, Home } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const ViewHeader = ({ title, subtitle, onOpenRegisterModal, hideHomeButton }) => {
  const { pets, activePet, activePetId, setActivePetId, isOnline, setIsOnline, setCurrentView } = usePet();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectPet = (petId) => {
    setActivePetId(petId);
    setDropdownOpen(false);
    sounds.playBeep();
  };

  return (
    <header className="view-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!hideHomeButton && (
          <button 
            onClick={() => setCurrentView('main-menu')}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              borderRadius: '12px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}
            title="Back to App Launcher"
          >
            <Home size={16} />
            <span>HOME</span>
          </button>
        )}
        <div className="view-title-group">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {/* Pet Switcher Button */}
        {activePet && (
          <div 
            className="pet-pill-selector"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Switch Active Pet"
          >
            <img 
              src={activePet.photoUrl} 
              alt={activePet.name} 
              className="pet-pill-avatar" 
            />
            <span className="pet-pill-name">{activePet.name}</span>
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        )}

        {/* Add Pet Button */}
        <button 
          onClick={onOpenRegisterModal}
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            color: '#38bdf8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Add New Pet (Pet Registration)"
        >
          <PlusCircle size={17} />
        </button>

        {/* Pet Switcher Dropdown */}
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            width: '200px',
            background: '#1e293b',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 100,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '4px 8px', fontWeight: 600, textTransform: 'uppercase' }}>
              Registered Pets
            </div>
            {pets.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectPet(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '10px',
                  background: p.id === activePetId ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                <img 
                  src={p.photoUrl} 
                  alt={p.name} 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{p.breed}</div>
                </div>
                {p.id === activePetId && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
