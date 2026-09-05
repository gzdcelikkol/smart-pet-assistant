import React, { useState } from 'react';
import { usePet } from '../context/PetContext';
import { ViewHeader } from '../components/ViewHeader';
import { 
  Bluetooth, 
  BluetoothConnected, 
  BluetoothOff, 
  Radio, 
  Battery, 
  Heart, 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Signal,
  MapPin,
  Compass
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const CollarRecognitionView = ({ onOpenRegisterModal }) => {
  const { 
    activePet, 
    collarState, 
    disconnectCollar, 
    connectCollarManual, 
    setCurrentView 
  } = usePet();

  const [scanScenario, setScanScenario] = useState('FOUND'); // 'FOUND' | 'NOT_FOUND' | 'OFF'
  const [isScanningNearby, setIsScanningNearby] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState([]);

  const handleScanBLE = () => {
    setIsScanningNearby(true);
    sounds.playBeep();

    setTimeout(() => {
      setIsScanningNearby(false);
      if (scanScenario === 'FOUND') {
        setNearbyDevices([
          { id: activePet?.collarId || 'AB12-CD34', name: `${activePet?.name || 'Pet'}'s Smart Collar`, rssi: -58, matched: true },
          { id: 'BLE-D892-A1', name: 'Unknown BLE Beacon', rssi: -82, matched: false },
          { id: 'BLE-E401-B3', name: 'Smart Tag Pro', rssi: -89, matched: false }
        ]);
        sounds.playBluetooth();
      } else if (scanScenario === 'NOT_FOUND') {
        setNearbyDevices([]);
        sounds.playAlert();
      } else {
        // OFF
        setNearbyDevices([]);
        sounds.playAlert();
      }
    }, 1200);
  };

  const isConnected = collarState.status === 'CONNECTED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ViewHeader 
        title="Smart Collar Recognition" 
        subtitle="Bluetooth Low Energy (BLE) & Telemetry" 
        onOpenRegisterModal={onOpenRegisterModal} 
      />

      <div className="scrollable-body">
        {/* Connection Status Card */}
        <div className="glass-card" style={{
          border: isConnected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
          background: isConnected 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.85))' 
            : 'linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(15, 23, 42, 0.85))'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isConnected ? '#10b981' : '#f43f5e'
              }}>
                {isConnected ? <BluetoothConnected size={22} /> : <BluetoothOff size={22} />}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#fff' }}>
                  {isConnected ? 'Smart Collar Connected & Active' : 'Smart Collar Disconnected'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Paired Device ID: <strong>{activePet?.collarId}</strong>
                </div>
              </div>
            </div>

            <span className={`badge-status ${isConnected ? 'badge-normal' : 'badge-critical'}`}>
              {collarState.status}
            </span>
          </div>

          {/* Auto Reconnection Timer Badge (Non-functional requirement #17) */}
          {collarState.autoReconnectCountdown !== null && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '0.76rem',
              color: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <RefreshCw size={14} className="ar-radar-sweep" />
              <span>Auto-reconnecting within 5s (Requirement #17): <strong>{collarState.autoReconnectCountdown}s</strong></span>
            </div>
          )}

          {/* Telemetry Row */}
          {isConnected && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '10px',
              marginTop: '4px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Signal (RSSI)</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#38bdf8' }}>
                  {collarState.deviceRssi} dBm
                </div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Battery Level</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Battery size={13} />
                  <span>%{collarState.battery}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Live Heart Rate</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff0055', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Heart size={12} className="heart-pulse" />
                  <span>{activePet?.vitals?.heartRate} bpm</span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {isConnected ? (
              <button 
                onClick={disconnectCollar}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.78rem', color: '#fecdd3' }}
              >
                <BluetoothOff size={14} />
                <span>Disconnect (Test 5s Auto-Reconnect)</span>
              </button>
            ) : (
              <button 
                onClick={connectCollarManual}
                className="btn-primary"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                <Bluetooth size={14} />
                <span>Reconnect Collar</span>
              </button>
            )}
          </div>
        </div>

        {/* Nearby BLE Scanners / Devices List */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="#06b6d4" />
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                Nearby BLE Smart Devices
              </span>
            </div>
            <button 
              onClick={handleScanBLE} 
              disabled={isScanningNearby}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.72rem' }}
            >
              <RefreshCw size={12} className={isScanningNearby ? 'ar-radar-sweep' : ''} />
              <span>{isScanningNearby ? 'Scanning...' : 'Scan Devices'}</span>
            </button>
          </div>

          {nearbyDevices.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '24px 12px',
              color: '#94a3b8',
              fontSize: '0.8rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px'
            }}>
              {scanScenario === 'NOT_FOUND' ? (
                <div>
                  <AlertCircle size={24} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ color: '#fef3c7', fontWeight: 600 }}>No Collar Found (Out of Range)</div>
                  <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                    Move closer or check if the smart collar battery is charged.
                  </div>
                </div>
              ) : scanScenario === 'OFF' ? (
                <div>
                  <BluetoothOff size={24} color="#f43f5e" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ color: '#fecdd3', fontWeight: 600 }}>Smart Collar is Powered Off</div>
                  <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                    Hold the collar power button for 3 seconds to broadcast BLE signal.
                  </div>
                </div>
              ) : (
                <div>
                  Tap "Scan Devices" to search for nearby Bluetooth smart collars.
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {nearbyDevices.map((dev) => (
                <div 
                  key={dev.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: dev.matched ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: dev.matched ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                    borderRadius: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                        {dev.name}
                      </span>
                      {dev.matched && (
                        <span className="badge-status badge-normal" style={{ fontSize: '0.62rem' }}>
                          Paired Collar
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      ID: {dev.id} • RSSI: {dev.rssi} dBm
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playBluetooth();
                      connectCollarManual();
                    }}
                    style={{
                      background: dev.matched ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                      color: dev.matched ? '#000' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {dev.matched ? 'Pair' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick GPS Location preview & Link to Tracker */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Lost Pet Tracker & GPS Radar</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Location: {activePet?.currentLocation?.name || 'Park Perimeter'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => { sounds.playBeep(); setCurrentView('tracker'); }}
            className="btn-primary"
            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
          >
            <span>Open Radar</span>
            <Compass size={14} />
          </button>
        </div>

        {/* Testing Scenarios */}
        <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
            🧪 BLE Test Scenarios
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => { setScanScenario('FOUND'); handleScanBLE(); }}
              className={`sim-btn ${scanScenario === 'FOUND' ? 'active' : ''}`}
              style={{ fontSize: '0.7rem' }}
            >
              Collar Found
            </button>
            <button 
              onClick={() => { setScanScenario('NOT_FOUND'); handleScanBLE(); }}
              className={`sim-btn ${scanScenario === 'NOT_FOUND' ? 'active' : ''}`}
              style={{ fontSize: '0.7rem' }}
            >
              Out of Range
            </button>
            <button 
              onClick={() => { setScanScenario('OFF'); handleScanBLE(); }}
              className={`sim-btn ${scanScenario === 'OFF' ? 'active' : ''}`}
              style={{ fontSize: '0.7rem' }}
            >
              Collar Powered Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
