import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Lock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { performSecurityAudit } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

// Mock Config for Simulation
const MOCK_CONFIG = `
version 17.3
hostname Core-Switch-01
!
enable password cisco
!
username admin privilege 15 password 0 cisco123
!
interface GigabitEthernet1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
line vty 0 4
 password cisco
 login
 transport input telnet
!
end
`;

const Security: React.FC = () => {
    const [auditResult, setAuditResult] = useState<string | null>(null);
    const [auditing, setAuditing] = useState(false);

    const runAudit = async () => {
        setAuditing(true);
        try {
            const result = await performSecurityAudit(MOCK_CONFIG);
            setAuditResult(result);
        } catch (e) {
            setAuditResult("Audit failed.");
        } finally {
            setAuditing(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Security Center & Audit</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Overall Security Score</p>
                        <p className="text-3xl font-bold text-yellow-400">72/100</p>
                    </div>
                    <ShieldAlert size={40} className="text-yellow-500" />
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Open Vulnerabilities</p>
                        <p className="text-3xl font-bold text-red-400">5</p>
                    </div>
                    <AlertTriangle size={40} className="text-red-500" />
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Compliant Devices</p>
                        <p className="text-3xl font-bold text-green-400">92%</p>
                    </div>
                    <ShieldCheck size={40} className="text-green-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                {/* Audit Input/Source */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-blue-400" /> Target Configuration
                    </h3>
                    <div className="flex-1 bg-gray-950 rounded border border-gray-800 p-4 overflow-auto font-mono text-xs text-gray-400 relative group">
                        <pre>{MOCK_CONFIG}</pre>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700 text-white">Edit</button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button 
                            onClick={runAudit}
                            disabled={auditing}
                            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {auditing ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                    Auditing with AI...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Run Compliance Check
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Audit Results */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col overflow-hidden">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-purple-400" /> Audit Findings
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {auditResult ? (
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{auditResult}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                <CheckCircle size={48} className="mb-4 opacity-20" />
                                <p>Ready to audit configuration.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;