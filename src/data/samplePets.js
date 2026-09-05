export const INITIAL_PETS = [
  {
    id: "pet_001",
    name: "Buddy",
    species: "DOG",
    breed: "Golden Retriever / Labrador",
    age: 3,
    weightKg: 25.0,
    sex: "Male, neutered",
    collarId: "AB12-CD34",
    medicalInfo: "Vaccinations up-to-date (Rabies, DHPP). Mild grass pollen allergy. Microchipped.",
    activityLevel: "MODERATE", // MODERATE, SEDENTARY, ACTIVE, VERY_ACTIVE
    bcs: 5, // Body Condition Score 1-9 (5 = Ideal)
    specialConditions: "None",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
    collarConnected: true,
    safeZoneRadiusMeters: 250,
    currentLocation: {
      lat: 50.1109,
      lng: 8.6821,
      name: "Central Park, Near Fountain",
      distanceMeters: 120,
      direction: "North-East",
      headingDeg: 42,
      inSafeZone: true
    },
    vitals: {
      heartRate: 85, // bpm
      temperature: 38.5, // °C
      activity: "Walking",
      collarBattery: 88, // %
      bleSignal: -62, // dBm
      healthStatus: "NORMAL", // NORMAL, ELEVATED, CRITICAL
      lastSync: "Just now"
    },
    nutrition: {
      consumedCalories: 720,
      targetCalories: 1402,
      lastFedTime: "08:30 AM",
      dietType: "Mixed (70% Dry, 30% Wet)",
      feedingHistory: [
        { time: "08:30 AM", food: "Royal Canin Adult Dog", amountGrams: 150, calories: 577 },
        { time: "01:00 PM", food: "Healthy Salmon Treat", amountGrams: 35, calories: 143 }
      ]
    },
    memories: [
      {
        id: "mem_1",
        title: "Sunny Morning Fetch",
        type: "video",
        date: "2026-09-02",
        duration: "0:14",
        url: "https://images.unsplash.com/photo-1534361960057-19889db98a1e?auto=format&fit=crop&w=800&q=80",
        caption: "Buddy caught the frisbee mid-air in the park!"
      },
      {
        id: "mem_2",
        title: "Post-Walk Nap",
        type: "photo",
        date: "2026-09-03",
        duration: "Photo",
        url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
        caption: "Sleeping happily after a 4km trail hike."
      },
      {
        id: "mem_3",
        title: "Smart Collar Training Session",
        type: "video",
        date: "2026-09-04",
        duration: "0:12",
        url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
        caption: "Practicing recall with the new AR sound cue."
      }
    ]
  },
  {
    id: "pet_002",
    name: "Luna",
    species: "CAT",
    breed: "British Shorthair",
    age: 2,
    weightKg: 4.2,
    sex: "Female, spayed",
    collarId: "LN88-EF90",
    medicalInfo: "Indoor cat. Sensitive stomach, strictly grain-free diet.",
    activityLevel: "SEDENTARY",
    bcs: 5,
    specialConditions: "None",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    collarConnected: true,
    safeZoneRadiusMeters: 80,
    currentLocation: {
      lat: 50.1102,
      lng: 8.6815,
      name: "Living Room Balcony",
      distanceMeters: 15,
      direction: "South",
      headingDeg: 175,
      inSafeZone: true
    },
    vitals: {
      heartRate: 145,
      temperature: 38.8,
      activity: "Resting",
      collarBattery: 92,
      bleSignal: -48,
      healthStatus: "NORMAL",
      lastSync: "2 mins ago"
    },
    nutrition: {
      consumedCalories: 180,
      targetCalories: 235,
      lastFedTime: "07:45 AM",
      dietType: "Dry Formula (100%)",
      feedingHistory: [
        { time: "07:45 AM", food: "Purina Pro Plan Delicate", amountGrams: 45, calories: 180 }
      ]
    },
    memories: [
      {
        id: "mem_luna_1",
        title: "Window Bird Watching",
        type: "photo",
        date: "2026-09-01",
        duration: "Photo",
        url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
        caption: "Watching pigeons from the sunny window sill."
      },
      {
        id: "mem_luna_2",
        title: "Cardboard Box Adventure",
        type: "video",
        date: "2026-09-03",
        duration: "0:10",
        url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
        caption: "Luna claimed the delivery box in under 3 seconds."
      },
      {
        id: "mem_luna_3",
        title: "Evening Cuddles",
        type: "photo",
        date: "2026-09-04",
        duration: "Photo",
        url: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80",
        caption: "Purring warmly on the couch."
      }
    ]
  }
];
