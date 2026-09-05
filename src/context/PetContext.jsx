import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PETS } from '../data/samplePets';
import { FOOD_DATABASE } from '../data/sampleFoods';
import { sounds } from '../utils/soundEffects';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  // Pets state stored with localStorage persistence
  const [pets, setPets] = useState(() => {
    try {
      const saved = localStorage.getItem('petvision_pets');
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [activePetId, setActivePetId] = useState(() => {
    return pets[0]?.id || "pet_001";
  });

  // Global app navigation view
  const [currentView, setCurrentView] = useState('main-menu');
  const [phoneFrameMode, setPhoneFrameMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Active pet helper
  const activePet = pets.find(p => p.id === activePetId) || pets[0] || null;

  // Save pets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('petvision_pets', JSON.stringify(pets));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [pets]);

  // Collar Connection State
  const [collarState, setCollarState] = useState({
    status: 'CONNECTED', // 'CONNECTED' | 'DISCONNECTED' | 'SCANNING' | 'CONNECTING' | 'FAILED'
    deviceRssi: -62,
    battery: activePet?.vitals?.collarBattery || 88,
    autoReconnectCountdown: null,
    lowBatteryAlert: false
  });

  // Tracker state
  const [tracker, setTracker] = useState({
    isTracking: false,
    inSafeZone: true,
    distanceMeters: 120,
    headingDeg: 45,
    gpsSignal: 'STRONG', // 'STRONG' | 'WEAK' | 'NO_SIGNAL'
    lastKnownAddress: "Central Park, Fountain Walk",
    safeZoneRadius: 200,
    petFoundModal: false
  });

  // Voice command status for Memory Capture
  const [voiceListening, setVoiceListening] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState(null);

  // Incoming Phone Call Interrupt Simulation (Alternative Flow D in Memory Capture/Journal)
  const [incomingCallInterrupt, setIncomingCallInterrupt] = useState(null);

  // Update active pet properties
  const updatePet = (petId, updates) => {
    setPets(prev => prev.map(pet => pet.id === petId ? { ...pet, ...updates } : pet));
  };

  const updateActivePet = (updates) => {
    if (activePet) {
      updatePet(activePet.id, updates);
    }
  };

  // Add new pet
  const registerNewPet = (petData) => {
    const newId = `pet_${Date.now().toString().slice(-4)}`;
    const newPet = {
      id: newId,
      name: petData.name || "My Pet",
      species: petData.species || "DOG",
      breed: petData.breed || "Mixed Breed",
      age: Number(petData.age) || 1,
      weightKg: Number(petData.weightKg) || 10,
      sex: petData.sex || "Neutered",
      collarId: petData.collarId || `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      medicalInfo: petData.medicalInfo || "Healthy, regular checks.",
      activityLevel: petData.activityLevel || "MODERATE",
      bcs: 5,
      specialConditions: "None",
      photoUrl: petData.photoUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      collarConnected: true,
      safeZoneRadiusMeters: 200,
      currentLocation: {
        lat: 50.1109,
        lng: 8.6821,
        name: "Home Garden / Safe Zone",
        distanceMeters: 10,
        direction: "North",
        headingDeg: 0,
        inSafeZone: true
      },
      vitals: {
        heartRate: petData.species === 'CAT' ? 140 : 80,
        temperature: 38.4,
        activity: "Resting",
        collarBattery: 95,
        bleSignal: -55,
        healthStatus: "NORMAL",
        lastSync: "Just now"
      },
      nutrition: {
        consumedCalories: 0,
        targetCalories: 850,
        lastFedTime: "Not yet today",
        dietType: "Standard Nutrition",
        feedingHistory: []
      },
      memories: []
    };

    setPets(prev => [newPet, ...prev]);
    setActivePetId(newId);
    sounds.playSuccess();
    return newPet;
  };

  // Check duplicate collar ID
  const isCollarIdDuplicate = (collarId, currentPetId = null) => {
    return pets.some(p => p.collarId.toLowerCase() === collarId.trim().toLowerCase() && p.id !== currentPetId);
  };

  // Toggle Health Anomaly Simulation (to test Critical Health Alert & Vet Teleconsultation recommendation)
  const toggleHealthAnomaly = () => {
    if (!activePet) return;
    const isCurrentlyNormal = activePet.vitals.healthStatus === 'NORMAL';
    if (isCurrentlyNormal) {
      sounds.playAlert();
      updateActivePet({
        vitals: {
          ...activePet.vitals,
          healthStatus: 'CRITICAL',
          temperature: 40.2, // High fever
          heartRate: activePet.species === 'CAT' ? 220 : 142, // Elevated heart rate
          activity: 'Lethargic / Sedentary',
          lastSync: 'Just now'
        }
      });
    } else {
      sounds.playSuccess();
      updateActivePet({
        vitals: {
          ...activePet.vitals,
          healthStatus: 'NORMAL',
          temperature: 38.5,
          heartRate: activePet.species === 'CAT' ? 145 : 85,
          activity: 'Walking',
          lastSync: 'Just now'
        }
      });
    }
  };

  // Simulate Safe Zone breach
  const toggleSafeZoneBreach = () => {
    const nextInSafeZone = !tracker.inSafeZone;
    if (!nextInSafeZone) {
      sounds.playAlert();
      setTracker(prev => ({
        ...prev,
        inSafeZone: false,
        isTracking: true,
        distanceMeters: 450,
        headingDeg: 55,
        lastKnownAddress: "Maple St. / East Park Boundary (Out of Safe Zone!)"
      }));
    } else {
      sounds.playSuccess();
      setTracker(prev => ({
        ...prev,
        inSafeZone: true,
        isTracking: false,
        distanceMeters: 30,
        headingDeg: 10,
        lastKnownAddress: "Home Perimeter (Within Safe Zone)"
      }));
    }
  };

  // Collar connect / disconnect simulation
  const disconnectCollar = () => {
    setCollarState(prev => ({ ...prev, status: 'DISCONNECTED' }));
    updateActivePet({ collarConnected: false });

    // Auto-reconnect within 5 seconds requirement (Non-functional requirement #17)
    let countdown = 5;
    setCollarState(prev => ({ ...prev, autoReconnectCountdown: countdown }));
    
    const interval = setInterval(() => {
      countdown -= 1;
      if (countdown > 0) {
        setCollarState(prev => ({ ...prev, autoReconnectCountdown: countdown }));
      } else {
        clearInterval(interval);
        setCollarState({
          status: 'CONNECTED',
          deviceRssi: -58,
          battery: 86,
          autoReconnectCountdown: null,
          lowBatteryAlert: false
        });
        updateActivePet({ collarConnected: true });
        sounds.playBluetooth();
      }
    }, 1000);
  };

  const connectCollarManual = () => {
    setCollarState(prev => ({ ...prev, status: 'CONNECTING' }));
    setTimeout(() => {
      setCollarState({
        status: 'CONNECTED',
        deviceRssi: -55,
        battery: 90,
        autoReconnectCountdown: null,
        lowBatteryAlert: false
      });
      updateActivePet({ collarConnected: true });
      sounds.playBluetooth();
    }, 1200);
  };

  // Add food intake
  const logFoodIntake = (foodItem, amountGrams) => {
    if (!activePet) return;
    const calories = Math.round((foodItem.caloriesPer100g * amountGrams) / 100);
    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      food: foodItem.name,
      amountGrams,
      calories
    };

    const newConsumed = (activePet.nutrition?.consumedCalories || 0) + calories;
    const updatedHistory = [newLog, ...(activePet.nutrition?.feedingHistory || [])];

    updateActivePet({
      nutrition: {
        ...activePet.nutrition,
        consumedCalories: newConsumed,
        lastFedTime: newLog.time,
        feedingHistory: updatedHistory
      }
    });

    sounds.playSuccess();
  };

  // Add captured memory
  const addMemory = (memoryData) => {
    if (!activePet) return;
    const newMemory = {
      id: `mem_${Date.now()}`,
      title: memoryData.title || `Memory with ${activePet.name}`,
      type: memoryData.type || 'photo',
      date: new Date().toISOString().split('T')[0],
      duration: memoryData.duration || 'Photo',
      url: memoryData.url,
      caption: memoryData.caption || 'Captured via PetVision Mobile'
    };

    const currentMemories = activePet.memories || [];
    updateActivePet({
      memories: [newMemory, ...currentMemories]
    });

    sounds.playSuccess();
    return newMemory;
  };

  // Trigger Incoming Call Interrupt simulation
  const triggerCallInterrupt = (callerName = "Mom (Incoming Call)") => {
    setIncomingCallInterrupt({
      caller: callerName,
      time: "Now"
    });
  };

  const dismissCallInterrupt = () => {
    setIncomingCallInterrupt(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        activePetId,
        setActivePetId,
        activePet,
        updateActivePet,
        registerNewPet,
        isCollarIdDuplicate,
        currentView,
        setCurrentView,
        phoneFrameMode,
        setPhoneFrameMode,
        isOnline,
        setIsOnline,
        collarState,
        setCollarState,
        disconnectCollar,
        connectCollarManual,
        tracker,
        setTracker,
        toggleSafeZoneBreach,
        toggleHealthAnomaly,
        logFoodIntake,
        addMemory,
        voiceListening,
        setVoiceListening,
        lastVoiceCommand,
        setLastVoiceCommand,
        incomingCallInterrupt,
        triggerCallInterrupt,
        dismissCallInterrupt
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) throw new Error('usePet must be used within PetProvider');
  return context;
};
