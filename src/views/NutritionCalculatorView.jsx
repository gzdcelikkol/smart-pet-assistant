import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  Calculator, 
  Flame, 
  Scale, 
  Activity, 
  PieChart, 
  Save, 
  CheckCircle2, 
  Sliders, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const NutritionCalculatorView = ({ onOpenRegisterModal }) => {
  const { activePet, updateActivePet, setCurrentView } = usePet();

  // Input states initialized from current pet
  const [weightKg, setWeightKg] = useState(activePet?.weightKg || 25);
  const [lifeStage, setLifeStage] = useState('NEUTERED_ADULT'); // 'NEUTERED_ADULT' (1.6), 'INTACT_ADULT' (1.8), 'SENIOR' (1.4), 'PUPPY' (3.0)
  const [activity, setActivity] = useState(activePet?.activityLevel || 'MODERATE'); // 'SEDENTARY' (1.0), 'MODERATE' (1.3), 'ACTIVE' (1.5), 'WORKING' (2.0)
  const [bcsScore, setBcsScore] = useState(activePet?.bcs || 5); // 1-9
  const [specialCondition, setSpecialCondition] = useState('NONE'); // 'NONE', 'DIABETES', 'SURGERY', 'PREGNANCY'
  
  // Mixed feeding slider (Wet % vs Dry %) - Alternative Flow B
  const [dryPercent, setDryPercent] = useState(70);
  const wetPercent = 100 - dryPercent;

  // Formula Calculations (Section 3.8 of Project Report)
  // Step 2: RER = 70 * (weight in kg)^0.75
  const rer = Math.round(70 * Math.pow(Number(weightKg) || 1, 0.75));

  // Step 3: Life stage factors
  const lifeStageFactors = {
    NEUTERED_ADULT: 1.6,
    INTACT_ADULT: 1.8,
    SENIOR: 1.4,
    PUPPY: 3.0
  };
  const currentLifeFactor = lifeStageFactors[lifeStage] || 1.6;

  // Step 4: Activity multipliers
  const activityFactors = {
    SEDENTARY: 1.0,
    MODERATE: 1.3,
    ACTIVE: 1.5,
    WORKING: 2.0
  };
  const currentActivityFactor = activityFactors[activity] || 1.3;

  // Step 5: MER = RER * Life Stage * Activity
  let rawMer = rer * currentLifeFactor * currentActivityFactor;

  // Step 6: BCS adjustments
  let bcsMultiplier = 1.0;
  if (bcsScore <= 3) bcsMultiplier = 1.15; // Underweight: +15%
  else if (bcsScore >= 8) bcsMultiplier = 0.70; // Obese: -30%
  else if (bcsScore >= 6) bcsMultiplier = 0.85; // Overweight: -15%

  // Step 7: Special condition adjustments
  let conditionMultiplier = 1.0;
  if (specialCondition === 'DIABETES') conditionMultiplier = 0.90; // -10%
  if (specialCondition === 'SURGERY') conditionMultiplier = 1.25; // +25%
  if (specialCondition === 'PREGNANCY') conditionMultiplier = 1.35; // +35%

  // Final Total Daily Calorie Requirement
  const totalDailyKcal = Math.round(rawMer * bcsMultiplier * conditionMultiplier);
  const weightLossKcal = Math.round(totalDailyKcal * 0.8);
  const perMealKcal = Math.round(totalDailyKcal / 2);

  // Mixed Feeding Breakdown
  const dryKcal = Math.round((totalDailyKcal * dryPercent) / 100);
  const wetKcal = Math.round((totalDailyKcal * wetPercent) / 100);

  // Compare with current consumed calories (Figure 3.8.4 Calorie Status)
  const consumedToday = activePet?.nutrition?.consumedCalories || 0;
  const intakeRatio = totalDailyKcal > 0 ? (consumedToday / totalDailyKcal) * 100 : 0;
  
  let calorieStatus = 'OPTIMAL';
  let statusText = 'Optimal Level';
  let statusColor = '#10b981';

  if (intakeRatio < 90) {
    calorieStatus = 'TOO_LITTLE';
    statusText = 'Underfed / Too Little';
    statusColor = '#38bdf8';
  } else if (intakeRatio > 110) {
    calorieStatus = 'OVERFED';
    statusText = 'Overfed / High Intake';
    statusColor = '#f59e0b';
  }

  const handleSavePlan = () => {
    sounds.playSuccess();
    updateActivePet({
      weightKg: Number(weightKg),
      activityLevel: activity,
      bcs: Number(bcsScore),
      nutrition: {
        ...activePet.nutrition,
        targetCalories: totalDailyKcal,
        dietType: `Mixed Feeding (${dryPercent}% Dry, ${wetPercent}% Wet)`
      }
    });
    alert(`Daily caloric target of ${totalDailyKcal} kcal saved for ${activePet?.name}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <ViewHeader 
        title="Nutrition Calculator" 
        subtitle="RER & MER Scientific Metabolism Engine" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body">
        {/* Main Final Calculation Result Card (Section 3.8 Step 8) */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge-status badge-normal">Daily Caloric Requirement</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{totalDailyKcal}</span>
                <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600 }}>kcal / day</span>
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4'
            }}>
              <Flame size={24} />
            </div>
          </div>

          {/* Breakdown summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>RER Resting</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{rer} kcal</div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Weight Loss</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f59e0b' }}>{weightLossKcal} kcal</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Per Meal (2x)</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#10b981' }}>{perMealKcal} kcal</div>
            </div>
          </div>

          {/* Calorie Status bar against today's intake */}
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8' }}>Consumed Today: <strong>{consumedToday} kcal</strong></span>
              <span style={{ color: statusColor, fontWeight: 700 }}>{statusText} ({Math.round(intakeRatio)}%)</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, intakeRatio)}%`,
                height: '100%',
                background: statusColor,
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>

        {/* Form Inputs for Customizing Pet Parameters */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={16} color="#06b6d4" />
            <span>Pet Biometric Parameters</span>
          </div>

          {/* Weight */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Body Weight: {weightKg} kg</label>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Formula: 70 × (kg)^0.75</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              style={{ accentColor: '#06b6d4', cursor: 'pointer' }}
            />
          </div>

          {/* Life stage factor */}
          <div className="form-group">
            <label>Life Stage Factor</label>
            <select 
              value={lifeStage} 
              onChange={(e) => setLifeStage(e.target.value)}
              className="form-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="NEUTERED_ADULT">Neutered Adult (×1.6)</option>
              <option value="INTACT_ADULT">Intact Adult (×1.8)</option>
              <option value="SENIOR">Senior (&gt;7 Years) (×1.4)</option>
              <option value="PUPPY">Puppy / Growth (×3.0)</option>
            </select>
          </div>

          {/* Activity multiplier */}
          <div className="form-group">
            <label>Activity Multiplier</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { id: 'SEDENTARY', label: 'Sedentary', mul: '×1.0' },
                { id: 'MODERATE', label: 'Moderate', mul: '×1.3' },
                { id: 'ACTIVE', label: 'Active', mul: '×1.5' },
                { id: 'WORKING', label: 'Working Dog', mul: '×2.0' }
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActivity(act.id)}
                  style={{
                    background: activity === act.id ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.05)',
                    border: activity === act.id ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '6px 2px',
                    color: activity === act.id ? '#38bdf8' : '#94a3b8',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <div>{act.label}</div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>{act.mul}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Body Condition Score (BCS 1-9) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Body Condition Score (BCS): {bcsScore} / 9</label>
              <span style={{ fontSize: '0.7rem', color: bcsScore === 5 ? '#10b981' : '#f59e0b' }}>
                {bcsScore <= 3 ? 'Underweight (+15%)' : bcsScore >= 8 ? 'Obese (-30%)' : bcsScore >= 6 ? 'Overweight (-15%)' : 'Ideal Weight (0%)'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="9" 
              value={bcsScore}
              onChange={(e) => setBcsScore(e.target.value)}
              style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          {/* Special Health Condition */}
          <div className="form-group">
            <label>Special Condition Adjustment</label>
            <select 
              value={specialCondition} 
              onChange={(e) => setSpecialCondition(e.target.value)}
              className="form-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="NONE">Standard Health / None (0%)</option>
              <option value="DIABETES">Diabetes (-10%)</option>
              <option value="SURGERY">Surgery Recovery (+25%)</option>
              <option value="PREGNANCY">Pregnancy / Lactation (+35%)</option>
            </select>
          </div>
        </div>

        {/* Alternative Flow B: Mixed Feeding Slider (Wet vs Dry Food) */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PieChart size={16} color="#a855f7" />
              <span>Mixed Feeding Ratio (Dry vs Wet)</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#fff', marginBottom: '6px' }}>
            <span style={{ color: '#38bdf8' }}>Dry Kibble: {dryPercent}% ({dryKcal} kcal)</span>
            <span style={{ color: '#a855f7' }}>Wet Food: {wetPercent}% ({wetKcal} kcal)</span>
          </div>

          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            value={dryPercent}
            onChange={(e) => setDryPercent(e.target.value)}
            style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
          />
        </div>

        {/* Save & Apply Plan Button */}
        <button 
          onClick={handleSavePlan}
          className="btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          <Save size={16} />
          <span>Save as Active Feeding Plan</span>
        </button>
      </div>
    </div>
  );
};
