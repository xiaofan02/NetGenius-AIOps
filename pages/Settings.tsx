
import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, Server, Globe, Monitor, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [refreshRate, setRefreshRate] = useState('30');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <SettingsIcon /> {t('platformSettings')}
            </h1>
            
            {/* System Configuration */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-6">{t('generalConfig')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('systemLanguage')}</label>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="en">English (US)</option>
                            <option value="zh">中文 (简体)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('refreshRate')}</label>
                        <select 
                            value={refreshRate}
                            onChange={(e) => setRefreshRate(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="10">10s</option>
                            <option value="30">30s</option>
                            <option value="60">1m</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Deployment Information */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                 <h3 className="text-lg font-medium text-white mb-6">{t('deploymentInfo')}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/40 p-4 rounded border border-gray-700 flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded text-blue-400">
                            <Server size={20}/>
                        </div>
                        <div>
                            <span className="text-sm text-gray-300 font-medium block">Backend Engine</span>
                            <span className="text-xs text-gray-500">Python 3.11 / Netmiko 4.0</span>
                        </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded border border-gray-700 flex items-start gap-3">
                        <div className="p-2 bg-purple-500/10 rounded text-purple-400">
                            <Globe size={20}/>
                        </div>
                        <div>
                            <span className="text-sm text-gray-300 font-medium block">Container Orch</span>
                            <span className="text-xs text-gray-500">Docker Swarm / K8s Ready</span>
                        </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded border border-gray-700 flex items-start gap-3">
                        <div className="p-2 bg-green-500/10 rounded text-green-400">
                            <Monitor size={20}/>
                        </div>
                        <div>
                            <span className="text-sm text-gray-300 font-medium block">Client OS</span>
                            <span className="text-xs text-gray-500">Cross-Platform (Web)</span>
                        </div>
                    </div>
                 </div>
                 <div className="mt-4 bg-blue-900/20 border border-blue-800 rounded p-4 text-xs text-blue-200">
                    <p className="font-bold mb-1">Deployment Note:</p>
                    <p>To deploy on Windows, ensure Docker Desktop is running in Linux Container mode. The <code>docker-compose.yml</code> file in the root directory handles all service dependencies including the PostgreSQL database and Redis cache.</p>
                 </div>
            </div>

            <div className="flex justify-end">
                 <button 
                    onClick={handleSave}
                    className={`bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium flex items-center gap-2 transition-all ${saved ? 'bg-green-600 hover:bg-green-500' : ''}`}
                 >
                    {saved ? <Check size={18}/> : <Save size={18}/>} 
                    {saved ? t('saved') : t('saveChanges')}
                 </button>
            </div>
        </div>
    );
};

export default Settings;
