
import React, { useState } from 'react';
import { Server, Activity, Terminal, Shield, MoreHorizontal, Search, Plus, RefreshCw, X, Save, Lock, Globe, Zap, Cpu, Hash } from 'lucide-react';
import { Device } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const INITIAL_DEVICES: Device[] = [
  { id: '1', hostname: 'Core-Switch-01', ip: '192.168.1.1', type: 'Switch', status: 'Online', location: 'Data Center A', lastSeen: 'Just now', osVersion: '17.3.4', serialNumber: 'FDO2134X01' },
  { id: '2', hostname: 'Core-Switch-02', ip: '192.168.1.2', type: 'Switch', status: 'Online', location: 'Data Center A', lastSeen: 'Just now', osVersion: '17.3.4', serialNumber: 'FDO2134X02' },
  { id: '3', hostname: 'Edge-Router-01', ip: '10.0.0.1', type: 'Router', status: 'Warning', location: 'HQ Edge', lastSeen: '2 mins ago', osVersion: '16.12.5', serialNumber: 'FJK9928A11' },
  { id: '4', hostname: 'FW-Main', ip: '10.0.0.254', type: 'Firewall', status: 'Online', location: 'HQ Perimeter', lastSeen: '1 min ago', osVersion: '9.14(2)', serialNumber: 'JAD8817332' },
  { id: '5', hostname: 'Access-SW-Floor1', ip: '192.168.20.10', type: 'Switch', status: 'Offline', location: 'Building 1', lastSeen: '2 days ago', osVersion: '15.2(4)E', serialNumber: 'FCW2211L09' },
];

const DEVICE_TYPES = [
    "Cisco IOS / IOS-XE Switch",
    "Cisco NX-OS Switch",
    "Cisco IOS Router",
    "Cisco ASA Firewall",
    "Cisco FTD",
    "Huawei VRP Switch",
    "Huawei VRP Router",
    "H3C Comware",
    "Juniper Junos Switch",
    "Juniper SRX Firewall",
    "Arista EOS",
    "Palo Alto PAN-OS",
    "Fortinet FortiGate",
    "F5 BIG-IP",
    "Linux Server (Ubuntu/RHEL)",
    "Windows Server",
    "VMware ESXi"
];

const Devices: React.FC = () => {
  const { t } = useLanguage();
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspecting, setInspecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  
  const [newDevice, setNewDevice] = useState({
      hostname: '',
      ip: '',
      type: 'Cisco IOS / IOS-XE Switch',
      location: '',
      serialNumber: '',
      osVersion: '',
      protocol: 'SSH',
      port: 22,
      username: '',
      password: '',
      enablePassword: ''
  });

  const filteredDevices = devices.filter(d => 
    d.hostname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.ip.includes(searchTerm)
  );

  const handleInspect = (id: string) => {
    setInspecting(id);
    // Simulate API call
    setTimeout(() => {
        setInspecting(null);
        alert(`Inspection complete for device ID: ${id}. No critical issues found.`);
    }, 2000); 
  };

  const handleSync = () => {
      setSyncing(true);
      setTimeout(() => {
          setSyncing(false);
          // Randomly change a status to simulate live update
          setDevices(prev => prev.map(d => 
             d.id === '3' ? { ...d, status: 'Online', lastSeen: 'Just now' } : d
          ));
      }, 1500);
  };

  const handleFetchInfo = () => {
      if (!newDevice.ip || !newDevice.username || !newDevice.password) {
          alert(t('fillAllFields'));
          return;
      }
      setIsFetchingInfo(true);
      setFetchSuccess(false);
      
      // Simulate Network Connection & CLI scraping
      setTimeout(() => {
          setIsFetchingInfo(false);
          setFetchSuccess(true);
          
          // Generate realistic mock data
          const simulatedHostname = `Device-${newDevice.ip.split('.').pop()}`;
          // Cisco-style Serial Number (e.g., FDO23410X)
          const simulatedSerial = `FDO${Math.floor(Math.random() * 8999999) + 1000000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
          const simulatedVersion = "17.09.04";
          
          setNewDevice(prev => ({
              ...prev,
              hostname: simulatedHostname,
              serialNumber: simulatedSerial,
              osVersion: simulatedVersion,
              location: 'Detected: Auto-Discovery'
          }));
      }, 2000);
  };

  const saveNewDevice = () => {
      if (!newDevice.hostname || !newDevice.ip) {
          alert("Hostname and IP are required.");
          return;
      }

      const deviceTypeSimple = newDevice.type.includes('Switch') ? 'Switch' : 
                               newDevice.type.includes('Router') ? 'Router' : 
                               newDevice.type.includes('Firewall') ? 'Firewall' : 'Server';

      const deviceToAdd: Device = {
          id: Math.random().toString(36).substr(2, 9),
          hostname: newDevice.hostname,
          ip: newDevice.ip,
          type: deviceTypeSimple as any,
          status: 'Online',
          location: newDevice.location || 'Default',
          lastSeen: 'Just now',
          osVersion: newDevice.osVersion || 'Unknown',
          serialNumber: newDevice.serialNumber || 'N/A'
      };

      setDevices([...devices, deviceToAdd]);
      setIsModalOpen(false);
      // Reset form
      setNewDevice({
          hostname: '', ip: '', type: 'Cisco IOS / IOS-XE Switch', location: '', 
          serialNumber: '', osVersion: '', protocol: 'SSH', port: 22, username: '', password: '', enablePassword: ''
      });
      setFetchSuccess(false);
  };

  const handleCliAccess = (hostname: string) => {
      alert(`Opening SSH Web Terminal for ${hostname}... (Simulation)`);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('deviceManagement')}</h1>
          <p className="text-gray-400 text-sm">{t('deviceSubtitle')}</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors active:scale-95"
        >
          <Plus size={18} /> {t('addDevice')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder={t('searchDevice')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded border border-gray-700 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> {syncing ? t('syncing') : t('sync')}
          </button>
        </div>
      </div>

      {/* Device Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">{t('hostname')} / {t('ipAddress')}</th>
              <th className="px-6 py-3">{t('type')}</th>
              <th className="px-6 py-3">{t('location')}</th>
              <th className="px-6 py-3">{t('version')}</th>
              <th className="px-6 py-3">{t('status')}</th>
              <th className="px-6 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredDevices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-800 p-2 rounded text-blue-400">
                      <Server size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{device.hostname}</div>
                      <div className="text-xs text-gray-500 font-mono">{device.ip}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{device.type}</td>
                <td className="px-6 py-4 text-gray-400">{device.location}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{device.osVersion}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    device.status === 'Online' ? 'bg-green-400/10 text-green-400' :
                    device.status === 'Warning' ? 'bg-yellow-400/10 text-yellow-400' :
                    'bg-red-400/10 text-red-400'
                  }`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button 
                        title={t('inspect')}
                        onClick={() => handleInspect(device.id)}
                        className={`p-2 rounded hover:bg-gray-700 ${inspecting === device.id ? 'text-blue-400' : 'text-gray-400'}`}
                      >
                        {inspecting === device.id ? <RefreshCw size={16} className="animate-spin"/> : <Activity size={16} />}
                      </button>
                      <button 
                        title={t('cli')}
                        onClick={() => handleCliAccess(device.hostname)}
                        className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                      >
                        <Terminal size={16} />
                      </button>
                      <button title={t('audit')} className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white">
                        <Shield size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
            <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
                <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Server className="text-blue-500" /> {t('addNewDevice')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Connection Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-2">
                        {t('connectionDetails')}
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">{t('ipAddress')} *</label>
                            <div className="flex items-center bg-gray-950 border border-gray-700 rounded px-2 focus-within:border-blue-500">
                                <Globe size={14} className="text-gray-500 mr-2"/>
                                <input 
                                    type="text" 
                                    value={newDevice.ip}
                                    onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
                                    className="w-full bg-transparent py-2 text-white outline-none text-sm"
                                    placeholder="192.168.x.x"
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs text-gray-500 mb-1">{t('port')}</label>
                             <input 
                                type="number" 
                                value={newDevice.port}
                                onChange={(e) => setNewDevice({...newDevice, port: parseInt(e.target.value)})}
                                className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-sm focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('protocol')}</label>
                        <div className="flex bg-gray-950 rounded border border-gray-700 p-1">
                            {['SSH', 'Telnet'].map((proto) => (
                                <button
                                    key={proto}
                                    onClick={() => setNewDevice({...newDevice, protocol: proto})}
                                    className={`flex-1 py-1 text-xs rounded transition-colors ${newDevice.protocol === proto ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {proto}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                         <label className="block text-xs text-gray-500 mb-1">{t('username')} *</label>
                         <input 
                            type="text" 
                            value={newDevice.username}
                            onChange={(e) => setNewDevice({...newDevice, username: e.target.value})}
                            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-sm focus:border-blue-500"
                        />
                    </div>

                    <div>
                         <label className="block text-xs text-gray-500 mb-1">{t('password')} *</label>
                         <div className="flex items-center bg-gray-950 border border-gray-700 rounded px-2 focus-within:border-blue-500">
                             <Lock size={14} className="text-gray-500 mr-2"/>
                             <input 
                                type="password" 
                                value={newDevice.password}
                                onChange={(e) => setNewDevice({...newDevice, password: e.target.value})}
                                className="w-full bg-transparent py-2 text-white outline-none text-sm"
                            />
                         </div>
                    </div>

                    <div>
                         <label className="block text-xs text-gray-500 mb-1">{t('enablePassword')}</label>
                         <input 
                            type="password" 
                            value={newDevice.enablePassword}
                            onChange={(e) => setNewDevice({...newDevice, enablePassword: e.target.value})}
                            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-sm focus:border-blue-500"
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={handleFetchInfo}
                            disabled={isFetchingInfo}
                            className={`w-full py-2.5 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                                fetchSuccess 
                                ? 'bg-green-600/20 text-green-400 border border-green-500/50' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
                            } disabled:opacity-50`}
                        >
                            {isFetchingInfo ? (
                                <><RefreshCw size={16} className="animate-spin"/> {t('fetching')}</>
                            ) : fetchSuccess ? (
                                <><Zap size={16} fill="currentColor"/> Info Fetched Successfully</>
                            ) : (
                                <><Zap size={16}/> {t('autoFetch')}</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column: Device Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider border-b border-gray-800 pb-2">
                        {t('deviceDetails')}
                    </h3>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('deviceType')}</label>
                        <select 
                            value={newDevice.type}
                            onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-sm focus:border-purple-500"
                        >
                            {DEVICE_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`transition-all duration-500 ${fetchSuccess ? 'bg-green-500/5 border border-green-500/20 rounded p-3' : ''}`}>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('hostname')}</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={newDevice.hostname}
                                    onChange={(e) => setNewDevice({...newDevice, hostname: e.target.value})}
                                    className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-sm focus:border-purple-500 font-medium"
                                    placeholder={t('enterHostname')}
                                />
                                {fetchSuccess && <Zap size={14} className="absolute right-3 top-2.5 text-green-400" />}
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">{t('serialNumber')}</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={newDevice.serialNumber}
                                        readOnly={fetchSuccess}
                                        onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                                        className={`w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-xs font-mono ${fetchSuccess ? 'text-green-300' : ''}`}
                                        placeholder="Auto-fetch"
                                    />
                                    {fetchSuccess && <Hash size={12} className="absolute right-3 top-2.5 text-green-500/50" />}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">{t('version')}</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={newDevice.osVersion}
                                        readOnly={fetchSuccess}
                                        onChange={(e) => setNewDevice({...newDevice, osVersion: e.target.value})}
                                        className={`w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-xs font-mono ${fetchSuccess ? 'text-green-300' : ''}`}
                                        placeholder="Auto-fetch"
                                    />
                                    {fetchSuccess && <Cpu size={12} className="absolute right-3 top-2.5 text-green-500/50" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('location')}</label>
                        <input 
                            type="text" 
                            value={newDevice.location}
                            onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white outline-none text-sm focus:border-purple-500"
                            placeholder={t('enterLocation')}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors text-sm"
                >
                    {t('cancel')}
                </button>
                <button 
                    onClick={saveNewDevice}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium flex items-center gap-2 text-sm shadow-lg shadow-blue-900/20"
                >
                    <Save size={16} /> {t('confirmAdd')}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
