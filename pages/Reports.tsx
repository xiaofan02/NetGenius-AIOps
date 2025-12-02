import React, { useState } from 'react';
import { FileText, Download, PieChart, Shield, Activity, Loader2 } from 'lucide-react';
import { Report } from '../types';

const INITIAL_REPORTS: Report[] = [
    { id: '1', title: 'Monthly Network Health Report', type: 'Health', generatedAt: '2023-10-01', status: 'Ready' },
    { id: '2', title: 'Q3 Security Audit & Compliance', type: 'Security', generatedAt: '2023-10-15', status: 'Ready' },
    { id: '3', title: 'Capacity Planning Forecast 2024', type: 'Capacity', generatedAt: '2023-10-20', status: 'Ready' },
];

const Reports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

    const handleGenerate = (type: 'Health' | 'Security' | 'Capacity' | 'Audit', title: string) => {
        const newId = Math.random().toString(36).substr(2, 9);
        const newReport: Report = {
            id: newId,
            title: title,
            type: type,
            generatedAt: 'Processing...',
            status: 'Generating'
        };
        
        setReports([newReport, ...reports]);

        // Simulate Generation
        setTimeout(() => {
            setReports(prev => prev.map(r => 
                r.id === newId 
                ? { ...r, status: 'Ready', generatedAt: new Date().toLocaleDateString() } 
                : r
            ));
        }, 3000);
    };

    const handleDownload = (report: Report) => {
        alert(`Downloading "${report.title}.pdf"...`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Report Center</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div 
                    onClick={() => handleGenerate('Health', 'On-Demand Network Health Report')}
                    className="bg-gradient-to-br from-blue-900/50 to-blue-800/20 border border-blue-700/30 p-6 rounded-lg cursor-pointer hover:border-blue-500 transition-colors group active:scale-95"
                >
                    <PieChart className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                    <h3 className="text-lg font-bold text-white">Operations Report</h3>
                    <p className="text-sm text-gray-400 mt-2">Generate summary of uptime, device availability, and incident MTTR.</p>
                </div>
                <div 
                    onClick={() => handleGenerate('Security', 'Instant Security Audit')}
                    className="bg-gradient-to-br from-purple-900/50 to-purple-800/20 border border-purple-700/30 p-6 rounded-lg cursor-pointer hover:border-purple-500 transition-colors group active:scale-95"
                >
                    <Shield className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                    <h3 className="text-lg font-bold text-white">Security Audit</h3>
                    <p className="text-sm text-gray-400 mt-2">Compliance checks, CVE vulnerabilities, and patching status.</p>
                </div>
                <div 
                    onClick={() => handleGenerate('Capacity', 'Traffic & Capacity Forecast')}
                    className="bg-gradient-to-br from-green-900/50 to-green-800/20 border border-green-700/30 p-6 rounded-lg cursor-pointer hover:border-green-500 transition-colors group active:scale-95"
                >
                    <Activity className="text-green-400 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                    <h3 className="text-lg font-bold text-white">Traffic Analysis</h3>
                    <p className="text-sm text-gray-400 mt-2">Bandwidth utilization, top talkers, and congestion points.</p>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 font-semibold text-white">Generated Reports</div>
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Report Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {reports.map(report => (
                            <tr key={report.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-gray-500" size={18}/>
                                        <span className="text-white font-medium">{report.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                                        report.type === 'Security' ? 'bg-red-400/10 text-red-400' :
                                        report.type === 'Health' ? 'bg-green-400/10 text-green-400' :
                                        'bg-blue-400/10 text-blue-400'
                                    }`}>
                                        {report.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{report.generatedAt}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    {report.status === 'Generating' ? (
                                        <span className="flex items-center gap-2 text-yellow-400">
                                            <Loader2 size={14} className="animate-spin" />
                                            Generating...
                                        </span>
                                    ) : 'Available'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDownload(report)}
                                        disabled={report.status !== 'Ready'}
                                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        title="Download PDF"
                                    >
                                        <Download size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;