import React, { useState } from 'react';
import { Search, FileText, AlertTriangle, Wand2 } from 'lucide-react';
import { analyzeDeviceLogs, getGeminiClient } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Logs: React.FC = () => {
    const [rawLogs, setRawLogs] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if(!rawLogs.trim()) return;
        if (!getGeminiClient()) {
            alert("API Key required in settings");
            return;
        }

        setLoading(true);
        try {
            const result = await analyzeDeviceLogs(rawLogs);
            setAnalysis(result);
        } catch (error) {
            setAnalysis("Error analyzing logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Column */}
            <div className="flex flex-col gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FileText size={18} className="text-blue-400"/> Raw Device Logs
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Paste 'show logging', 'show tech-support' or syslog output here.</p>
                    <textarea 
                        className="w-full h-96 bg-gray-950 border border-gray-700 rounded p-4 text-xs font-mono text-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Jan 24 10:23:41.123: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down..."
                        value={rawLogs}
                        onChange={(e) => setRawLogs(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                        >
                            <Wand2 size={16} />
                            {loading ? 'Analyzing with AI...' : 'Analyze Logs'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Result */}
            <div className="flex flex-col gap-4">
                 <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 h-full overflow-y-auto">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-yellow-400"/> AI Root Cause Analysis
                    </h2>
                    {analysis ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-600 flex-col gap-2">
                            <Wand2 size={40} className="text-gray-700" />
                            <p>Waiting for analysis...</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default Logs;