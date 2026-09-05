import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { FOOD_DATABASE } from '../data/sampleFoods';
import { 
  Barcode, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Utensils, 
  Plus, 
  RefreshCw, 
  Keyboard, 
  Info,
  ChevronRight,
  Flame
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const NutritionScannerView = ({ onOpenRegisterModal }) => {
  const { activePet, logFoodIntake, setCurrentView } = usePet();

  const [selectedFood, setSelectedFood] = useState(FOOD_DATABASE[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [portionGrams, setPortionGrams] = useState(150);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanScenario, setScanScenario] = useState('NORMAL'); // 'NORMAL' | 'DAMAGED' | 'MULTIPLE' | 'TOXIC'
  const [multipleBarcodesList, setMultipleBarcodesList] = useState(null);

  const handleTriggerScan = (foodItem = selectedFood) => {
    setIsScanning(true);
    sounds.playBeep();
    setMultipleBarcodesList(null);

    setTimeout(() => {
      setIsScanning(false);

      if (scanScenario === 'DAMAGED') {
        // Alternative Flow A: Damaged barcode
        sounds.playAlert();
        setManualInputMode(true);
      } else if (scanScenario === 'MULTIPLE') {
        // Alternative Flow B: Multiple barcodes detected
        setMultipleBarcodesList([FOOD_DATABASE[0], FOOD_DATABASE[1]]);
        sounds.playBeep();
      } else {
        setSelectedFood(foodItem);
        if (!foodItem.isSafe) {
          sounds.playAlert();
        } else {
          sounds.playBeep();
        }
      }
    }, 1000);
  };

  const handleFeedPet = () => {
    if (!selectedFood || !selectedFood.isSafe) return;
    logFoodIntake(selectedFood, Number(portionGrams));
  };

  const isSpeciesSafe = selectedFood.suitableSpecies.includes(activePet?.species);
  const isToxic = !selectedFood.isSafe || (!isSpeciesSafe && selectedFood.suitableSpecies.length === 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <ViewHeader 
        title="Smart Nutrition Scanner" 
        subtitle="Laser AR Barcode Reader & Toxicity Safety" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body">
        {/* AR Camera Viewfinder with Laser */}
        <div style={{
          position: 'relative',
          height: '210px',
          borderRadius: '18px',
          overflow: 'hidden',
          background: '#000',
          border: '1.5px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
        }}>
          <img 
            src={selectedFood.imageUrl} 
            alt="Food Package"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* AR HUD Overlay */}
          <div className="ar-hud-overlay">
            <div className="ar-corner-tl" />
            <div className="ar-corner-tr" />
            <div className="ar-corner-bl" />
            <div className="ar-corner-br" />

            {/* Red Laser Alignment Line (Requirement 3.7 Step 4) */}
            <div className="ar-scan-laser" />

            {/* Viewfinder Target Reticle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '190px',
              height: '90px',
              border: '2px solid rgba(255, 0, 85, 0.8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 0, 85, 0.05)',
              boxShadow: '0 0 20px rgba(255, 0, 85, 0.3)'
            }}>
              <Barcode size={42} color="#ff0055" />
            </div>

            {/* Scanning Status Badge */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              padding: '6px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#fff'
            }}>
              <span>Format: <strong>{selectedFood.format}</strong></span>
              <span style={{ color: '#00ffaa' }}>Barcode: {selectedFood.barcode}</span>
            </div>
          </div>
        </div>

        {/* Alternative Flow A: Damaged Barcode Fallback (Manual Keypad Input) */}
        {manualInputMode && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            borderRadius: '14px',
            padding: '12px',
            animation: 'fadeIn 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fef3c7', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <Keyboard size={16} />
              <span>Damaged / Unreadable Barcode (Manual Barcode Entry)</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter barcode digits..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="form-input"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              />
              <button
                onClick={() => {
                  setManualInputMode(false);
                  handleTriggerScan(FOOD_DATABASE[0]);
                }}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              >
                Query
              </button>
            </div>
          </div>
        )}

        {/* Alternative Flow B: Multiple Barcodes Found Selection */}
        {multipleBarcodesList && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            borderRadius: '14px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
              Multiple Barcodes Detected in Frame! Select one:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {multipleBarcodesList.map((item) => (
                <button
                  key={item.barcode}
                  onClick={() => {
                    setSelectedFood(item);
                    setMultipleBarcodesList(null);
                    sounds.playBeep();
                  }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <strong>{item.name}</strong> ({item.barcode})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TOXIC / DANGEROUS SUBSTANCE WARNING (Sequence Diagram 3.7.2 line 53) */}
        {isToxic && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.35), rgba(15, 23, 42, 0.95))',
            border: '2px solid #ff0055',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 8px 30px rgba(255, 0, 85, 0.4)',
            animation: 'pulse 1.5s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={28} color="#ff0055" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff' }}>
                  DANGEROUS & TOXIC SUBSTANCE DETECTED!
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fecdd3', marginTop: '2px' }}>
                  {selectedFood.warning || `This food item is toxic for pets (${activePet?.species})! DO NOT FEED!`}
                </div>
              </div>
            </div>

            {selectedFood.dangerousIngredients.length > 0 && (
              <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '8px', fontSize: '0.72rem', color: '#fecdd3' }}>
                Identified Toxins: <strong>{selectedFood.dangerousIngredients.join(', ')}</strong>
              </div>
            )}
          </div>
        )}

        {/* Product Details Card (Step 10 GUI Prototype) */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>{selectedFood.brand}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{selectedFood.name}</h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Category: {selectedFood.category} • {selectedFood.packageSize}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', justifyContent: 'flex-end' }}>
                <Flame size={14} />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{selectedFood.caloriesPer100g}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>kcal / 100g</div>
            </div>
          </div>

          {/* Nutritional Breakdown Progress Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Protein</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>%{selectedFood.proteinPercent}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Fat</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>%{selectedFood.fatPercent}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Carbohydrates</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>%{selectedFood.carbPercent}</div>
            </div>
          </div>

          {/* Portion & Feeding Controls */}
          {!isToxic && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Feeding Portion:</label>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                  {portionGrams} grams = <strong style={{ color: '#06b6d4' }}>{Math.round((selectedFood.caloriesPer100g * portionGrams) / 100)} kcal</strong>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={portionGrams}
                onChange={(e) => setPortionGrams(e.target.value)}
                style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={handleFeedPet}
                  className="btn-primary"
                  style={{ flex: 2, padding: '10px', fontSize: '0.82rem' }}
                >
                  <Utensils size={15} />
                  <span>Feed {activePet?.name} & Log Intake</span>
                </button>
                <button
                  onClick={() => setCurrentView('calculator')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.76rem' }}
                >
                  <span>Calorie Plan</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Barcode Presets for Easy Demo/Testing */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            🧪 Quick Food Selection & Barcode Presets:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {FOOD_DATABASE.map((f) => (
              <button
                key={f.barcode}
                onClick={() => {
                  setScanScenario(f.isSafe ? 'NORMAL' : 'TOXIC');
                  handleTriggerScan(f);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: selectedFood.barcode === f.barcode ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedFood.barcode === f.barcode ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.74rem'
                }}
              >
                <span>{f.name}</span>
                <span style={{ color: f.isSafe ? '#10b981' : '#f43f5e', fontWeight: 700, fontSize: '0.68rem' }}>
                  {f.isSafe ? 'Safe Food' : '⚠️ TOXIC WARNING'}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            <button
              onClick={() => { setScanScenario('DAMAGED'); handleTriggerScan(); }}
              className="sim-btn"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.68rem' }}
            >
              Damaged Barcode Test
            </button>
            <button
              onClick={() => { setScanScenario('MULTIPLE'); handleTriggerScan(); }}
              className="sim-btn"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.68rem' }}
            >
              Multiple Barcodes Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
