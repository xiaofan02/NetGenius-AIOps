import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, AlertCircle, Loader2, Copy, BrainCircuit, Terminal, Check, ToggleLeft, ToggleRight, Bot, Zap } from 'lucide-react';
import { generateAutomationScript, simulateScriptExecution, parseNetworkIntent, analyzeAgentResult } from '../services/geminiService';
import { AiScriptMessage } from '../types';

const Automation: React.FC = () => {
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [messages, setMessages] = useState<AiScriptMessage[]>([
    {
      role: 'system',
      content: 'NetGenius AIOps initialized. Select a mode to begin.',
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || executing) return;

    const userMsg: AiScriptMessage = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (isAgentMode) {
        await handleAgentFlow(userMsg.content);
    } else {
        await handleManualScriptFlow(userMsg.content);
    }
  };

  // --- MODE 1: Manual Script Generation (Existing) ---
  const handleManualScriptFlow = async (query: string) => {
    try {
      // Step 1: Parse Intent
      const intent = await parseNetworkIntent(query);
      
      const analysisMsg: AiScriptMessage = {
          role: 'assistant',
          content: `Logic:\n• Target IP: ${intent.ip || 'None'}\n• Commands: ${intent.commands.join(', ')}\n• Intent: ${intent.explanation}`,
          type: 'analysis'
      };
      setMessages(prev => [...prev, analysisMsg]);

      // Step 2: Generate Script
      const scriptCode = await generateAutomationScript(query, JSON.stringify(intent));
      
      const scriptMsg: AiScriptMessage = { 
        role: 'assistant', 
        content: scriptCode, 
        type: 'code',
        codeLanguage: 'python'
      };
      
      setMessages(prev => [...prev, scriptMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error processing request.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  // --- MODE 2: Autonomous Agent (New) ---
  const handleAgentFlow = async (query: string) => {
      try {
        // 1. Thought Process (Visible to user)
        const intent = await parseNetworkIntent(query);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Agent Plan: I will connect to ${intent.ip || 'the device'} and run: [${intent.commands.join(', ')}].`,
            type: 'analysis'
        }]);

        // 2. Execution (Simulated Automatic)
        setLoading(false); // Stop loading spinner, show execution UI
        setExecuting(true);
        
        // Create a temporary script to "run"
        const tempScript = `
# Agent Auto-Execution
connect_to('${intent.ip}')
results = []
for cmd in ${JSON.stringify(intent.commands)}:
    output = device.send_command(cmd)
    results.append(output)
print(results)
        `;

        // Simulate the delay and output
        const rawOutput = await simulateScriptExecution(tempScript);
        
        setMessages(prev => [...prev, {
            role: 'system',
            content: `> Executing commands on ${intent.ip}...\n> ${intent.commands.join(', ')}\n> Data received (${rawOutput.length} bytes)`,
            type: 'text' // Small log message
        }]);

        // 3. Synthesis (Natural Language Response)
        const finalAnswer = await analyzeAgentResult(query, rawOutput);
        
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: finalAnswer,
            type: 'text',
            meta: { isAgentResponse: true }
        }]);

      } catch (error) {
          setMessages(prev => [...prev, { role: 'assistant', content: "Agent failed to complete the task.", type: 'text' }]);
      } finally {
          setExecuting(false);
          setLoading(false);
      }
  };

  const handleExecute = async (code: string) => {
    setExecuting(true);
    setMessages(prev => [...prev, { role: 'system', content: "Initializing Netmiko session...", type: 'text' }]);
    
    try {
      const result = await simulateScriptExecution(code);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs.pop(); // Remove loading msg
        return [...newMsgs, { role: 'assistant', content: result, type: 'execution_result' }];
      });
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Execution failed: ${error}`, type: 'execution_result' }]);
    } finally {
      setExecuting(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
      navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div>
                <h2 className="text-white font-semibold flex items-center gap-2">
                    <BrainCircuit size={18} className={isAgentMode ? "text-purple-400" : "text-blue-400"} />
                    {isAgentMode ? 'Autonomous AI Agent' : 'Script Generator'}
                </h2>
                <p className="text-xs text-gray-400">
                    {isAgentMode ? 'Intent → Execution → Natural Language' : 'Intent → Python Code → Manual Execution'}
                </p>
            </div>
            
            {/* Mode Toggle */}
            <div 
                onClick={() => setIsAgentMode(!isAgentMode)}
                className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full p-1 cursor-pointer hover:border-gray-500 transition-colors"
                title="Toggle Agent Mode"
            >
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!isAgentMode ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
                    Manual Script
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isAgentMode ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
                    Auto Agent
                </div>
            </div>
        </div>

        <button 
            onClick={() => setMessages([{role:'system', content: isAgentMode ? 'Agent Mode Ready. Ask me to perform a task.' : 'Script Mode Ready. Ask me to write code.', type: 'text'}])}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          Clear History
        </button>
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl w-full ${
                msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/30' : 
                msg.type === 'analysis' ? 'bg-gray-800/50 border border-gray-700/50 dashed' :
                msg.meta?.isAgentResponse ? 'bg-purple-900/20 border border-purple-500/30' :
                'bg-gray-800 border border-gray-700'
            } rounded-lg p-4`}>
              
              {/* Header for role */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-600/50">
                <span className={`text-xs font-bold uppercase flex items-center gap-1 ${
                    msg.role === 'user' ? 'text-blue-400' : 
                    msg.meta?.isAgentResponse ? 'text-purple-400' :
                    msg.type === 'analysis' ? 'text-gray-500' :
                    'text-green-400'
                }`}>
                  {msg.role === 'user' ? 'User Request' : 
                   msg.meta?.isAgentResponse ? <><Bot size={14}/> Agent Response</> : 
                   msg.type === 'analysis' ? <><BrainCircuit size={12}/> AI Thought Process</> : 
                   msg.type === 'execution_result' ? <><Terminal size={12}/> Output</> :
                   'Assistant'}
                </span>
                <span className="text-xs text-gray-500 ml-auto">{new Date().toLocaleTimeString()}</span>
              </div>

              {/* Content Rendering */}
              {msg.type === 'code' ? (
                <div className="relative group">
                  <pre className="bg-black/50 p-4 rounded text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
                    {msg.content}
                  </pre>
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => handleExecute(msg.content)}
                      disabled={executing}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {executing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                      Execute Script
                    </button>
                    <button 
                        onClick={() => handleCopy(msg.content, idx)}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />} 
                      {copiedIndex === idx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ) : msg.type === 'execution_result' ? (
                <div className="flex flex-col gap-1">
                    <div className="bg-black text-gray-300 font-mono text-xs p-4 rounded border-l-4 border-green-500 whitespace-pre-wrap shadow-inner">
                        {msg.content}
                    </div>
                </div>
              ) : msg.type === 'analysis' ? (
                  <div className="text-gray-400 text-sm font-mono flex items-center gap-2">
                       <Zap size={12} /> {msg.content}
                  </div>
              ) : (
                <div className={`whitespace-pre-wrap ${msg.meta?.isAgentResponse ? 'text-gray-100 text-base leading-relaxed' : 'text-gray-200'}`}>
                    {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
             <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                <Loader2 className="animate-spin text-purple-400" size={20} />
                <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-medium">
                        {isAgentMode ? 'Agent is working...' : 'Generating Script...'}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {isAgentMode ? 'Analyzing intent & preparing execution' : 'Parsing natural language to Python'}
                    </span>
                </div>
             </div>
          </div>
        )}
        
        {executing && isAgentMode && (
           <div className="flex justify-start">
             <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                <Terminal className="animate-pulse text-green-400" size={20} />
                <div className="flex flex-col">
                    <span className="text-gray-300 text-sm font-medium">Running Commands...</span>
                    <span className="text-gray-500 text-xs">Interacting with device CLI</span>
                </div>
             </div>
           </div> 
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder={isAgentMode 
                ? "Agent Mode: Ask me to 'Check status of Core-Switch-01' or 'Find why interface Gi0/1 is down'" 
                : "Script Mode: 'Generate a script to backup all switches'"}
            className={`w-full bg-gray-900 text-white border rounded-lg pl-4 pr-12 py-3 focus:outline-none resize-none h-14 ${isAgentMode ? 'border-purple-500/50 focus:border-purple-500' : 'border-gray-600 focus:border-blue-500'}`}
          />
          <button 
            onClick={handleSend}
            disabled={loading || executing || !input.trim()}
            className={`absolute right-2 top-2 p-2 text-white rounded-md disabled:opacity-50 transition-colors ${isAgentMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1">
            {isAgentMode ? <Bot size={12} className="text-purple-400"/> : <Terminal size={12} className="text-blue-400"/>} 
            {isAgentMode ? 'AI Agent will execute commands automatically.' : 'AI will generate code for your review.'}
          </span>
          <span>Model: Gemini 2.5 Flash</span>
        </div>
      </div>
    </div>
  );
};

export default Automation;