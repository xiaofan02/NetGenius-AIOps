import React, { useState } from 'react';
import { FileCode, GitCompare, Save, RefreshCw, Eye } from 'lucide-react';
import { ConfigBackup } from '../types';
import { compareConfigs } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const INITIAL_BACKUPS: ConfigBackup[] = [
    { id: '1', deviceId: 'Core-SW-01', hostname: 'Core-Switch-01', version: 'v12', timestamp: '2023-10-25 04:00', content: 'hostname Core-Switch-01\ninterface Gi0/1\n ip address 192.168.1.1 255.255.255.0\n!' },
    { id: '2', deviceId: 'Core-SW-01', hostname: 'Core-Switch-01', version: 'v11', timestamp: '2023-10-24 04:00', content: 'hostname Core-Switch-01\ninterface Gi0/1\n shutdown\n!' },
    { id: '3', deviceId: 'Edge-Rtr-01', hostname: 'Edge-Router-01', version: 'v5', timestamp: '2023-10-25 04:00', content: 'hostname Edge-Router-01\nrouter bgp 65000\n neighbor 1.1.1.1 remote-as 65001\n!' },
];

const ConfigManagement: React.FC = () => {
    const [backups, setBackups] = useState<ConfigBackup[]>(INITIAL_BACKUPS);
    const [selectedBackup, setSelectedBackup] = useState<ConfigBackup | null>(null);
    const [compareMode, setCompareMode] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleCompare = async () => {
        if (!selectedBackup) return;
        // Mock comparison with previous version
        const previous = backups.find(b => b.hostname === selectedBackup.hostname && b.id !== selectedBackup.id);
        
        if (previous) {
            setAnalyzing(true);
            const result = await compareConfigs(previous.content, selectedBackup.content);
            setComparisonResult(result);
            setAnalyzing(false);
            setCompareMode(true);
        } else {
            alert("No previous version found to compare.");
        }
    };

    const handleBackup = () => {
        setSaving(true);
        // Simulate backup delay
        setTimeout(() => {
            const newBackup: ConfigBackup = {
                id: Math.random().toString(36).substr(2, 9),
                deviceId: 'Core-SW-01',
                hostname: 'Core-Switch-01',
                version: `v${backups.length + 10}`,
                timestamp: new Date().toISOString().replace('T', ' ').substr(0, 16),
                content: 'hostname Core-Switch-01\ninterface Gi0/1\n description BACKUP_NOW_GENERATED\n ip address 192.168.1.1 255.255.255.0\n!'
            };
            setBackups([newBackup, ...backups]);
            setSaving(false);
        }, 1200);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileCode className="text-blue-400"/> Configuration Management
                </h1>
                <div className="flex gap-2">
                    <button 
                        onClick={handleBackup}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} className={saving ? 'animate-bounce' : ''} /> {saving ? 'Backing up...' : 'Backup Now'}
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded border border-gray-700">
                        <RefreshCw size={16}/>
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Backup List */}
                <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-lg flex flex-col">
                    <div className="p-4 border-b border-gray-800 font-semibold text-white">Recent Backups</div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {backups.map(backup => (
                            <div 
                                key={backup.id}
                                onClick={() => { setSelectedBackup(backup); setCompareMode(false); }}
                                className={`p-3 rounded cursor-pointer border transition-colors ${selectedBackup?.id === backup.id ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-white font-medium">{backup.hostname}</span>
                                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">{backup.version}</span>
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{backup.timestamp}</span>
                                    <span>{backup.content.length} bytes</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="col-span-8 bg-gray-900 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
                    {selectedBackup ? (
                        <>
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                                <div className="text-white">
                                    <span className="font-bold">{selectedBackup.hostname}</span>
                                    <span className="mx-2 text-gray-600">|</span>
                                    <span className="text-sm text-gray-400">{selectedBackup.timestamp}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCompare}
                                        className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded flex items-center gap-1"
                                    >
                                        <GitCompare size={14}/> Compare w/ Previous
                                    </button>
                                    <button 
                                        onClick={() => setCompareMode(false)}
                                        className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded flex items-center gap-1 border border-gray-600"
                                    >
                                        <Eye size={14}/> Raw View
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 bg-gray-950 p-0 overflow-hidden relative">
                                {compareMode ? (
                                    <div className="h-full flex flex-col p-6 overflow-y-auto">
                                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                                            <GitCompare size={18}/> AI Change Analysis
                                        </h3>
                                        {analyzing ? (
                                            <div className="text-gray-500 animate-pulse">Analyzing differences...</div>
                                        ) : (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown>{comparisonResult || "No differences found."}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <pre className="h-full p-4 overflow-auto text-xs font-mono text-gray-300">
                                        {selectedBackup.content}
                                    </pre>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                            Select a backup to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfigManagement;