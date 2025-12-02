import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { UploadCloud, Activity, AlertTriangle } from 'lucide-react';
import { analyzePcapData } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const data = [
  { time: '10:00', in: 4000, out: 2400 },
  { time: '10:05', in: 3000, out: 1398 },
  { time: '10:10', in: 2000, out: 9800 },
  { time: '10:15', in: 2780, out: 3908 },
  { time: '10:20', in: 1890, out: 4800 },
  { time: '10:25', in: 2390, out: 3800 },
  { time: '10:30', in: 3490, out: 4300 },
];

const Traffic: React.FC = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [pcapAnalysis, setPcapAnalysis] = useState<string | null>(null);

    const handlePcapUpload = async () => {
        setAnalyzing(true);
        // Simulate processing
        setTimeout(async () => {
            const mockSummary = `
                Total Packets: 15,000
                TCP Syn: 45% (High)
                HTTP: 20%
                SSH: 5% (Source: 192.168.1.50 - Failed Auth)
                Unknown UDP: 10% (Dest Port: 6667)
            `;
            const result = await analyzePcapData(mockSummary);
            setPcapAnalysis(result);
            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="text-purple-400"/> Traffic Analysis & Forensics
            </h1>

            {/* Bandwidth Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-80">
                <h3 className="text-lg font-medium text-white mb-4">Core Switch Throughput (Mbps)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
                        <Area type="monotone" dataKey="in" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIn)" />
                        <Area type="monotone" dataKey="out" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorOut)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Talkers */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Top Talkers (Last Hour)</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 border-b border-gray-800">
                            <tr>
                                <th className="pb-2">Source IP</th>
                                <th className="pb-2">Destination</th>
                                <th className="pb-2">Protocol</th>
                                <th className="pb-2 text-right">Bytes</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            <tr className="border-b border-gray-800/50">
                                <td className="py-2">192.168.1.105</td>
                                <td>8.8.8.8</td>
                                <td>HTTPS</td>
                                <td className="text-right">1.2 GB</td>
                            </tr>
                            <tr className="border-b border-gray-800/50">
                                <td className="py-2">192.168.1.200</td>
                                <td>10.0.0.5</td>
                                <td>SMB</td>
                                <td className="text-right">850 MB</td>
                            </tr>
                            <tr className="border-b border-gray-800/50">
                                <td className="py-2">10.0.0.50</td>
                                <td>192.168.1.5</td>
                                <td>SSH</td>
                                <td className="text-right">45 MB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* PCAP Analyzer */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
                    <h3 className="text-lg font-medium text-white mb-4">AI PCAP Inspector</h3>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-950 mb-4 cursor-pointer hover:border-blue-500 transition-colors" onClick={handlePcapUpload}>
                        <UploadCloud size={32} className="text-gray-400 mb-2"/>
                        <p className="text-sm text-gray-400">Click to upload .pcap / .cap file</p>
                        <p className="text-xs text-gray-600">Max size: 50MB</p>
                    </div>
                    
                    {analyzing && (
                        <div className="flex items-center gap-2 text-blue-400 text-sm animate-pulse mb-2">
                            <Activity size={16}/> Extracting packet headers and analyzing flows...
                        </div>
                    )}

                    {pcapAnalysis && !analyzing && (
                        <div className="bg-gray-950 p-4 rounded border border-gray-800 flex-1 overflow-y-auto">
                            <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2">
                                <AlertTriangle size={14}/> Threat Analysis
                            </h4>
                            <div className="prose prose-invert prose-xs">
                                <ReactMarkdown>{pcapAnalysis}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Traffic;