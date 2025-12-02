import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Network Intent Parsing
export const parseNetworkIntent = async (query: string): Promise<{ commands: string[], ip: string | null, explanation: string }> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a Network Automation Assistant. Parse the user's intent.
    Extract:
    1. The specific IOS commands needed.
    2. The target IP address (if any).
    3. A brief explanation of what will be done.

    User Query: "${query}"

    Response Format (JSON):
    {
      "commands": ["cmd1", "cmd2"],
      "ip": "1.2.3.4" or null,
      "explanation": "Checking interface status..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Intent Parsing Error:", error);
    return { commands: [], ip: null, explanation: "Failed to parse intent." };
  }
};

export const generateAutomationScript = async (
  userRequest: string, 
  contextData: string = ""
): Promise<string> => {
  const model = "gemini-2.5-flash"; 
  const prompt = `
    You are an expert Network Automation Engineer. 
    Generate a Python script using 'netmiko' based on the request.
    
    Context: ${contextData}
    Request: "${userRequest}"

    Requirements:
    1. Use 'netmiko' ConnectHandler.
    2. Use standard error handling.
    3. Return ONLY the python code.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text?.trim() || "";
    return text.replace(/```python/g, "").replace(/```/g, "");
  } catch (error) {
    return `# Error generating script: ${error}`;
  }
};

export const analyzeDeviceLogs = async (logs: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Analyze these network logs. Identify root causes and suggest fixes.
    Logs:
    ${logs}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    return `Analysis failed: ${error}`;
  }
};

export const performSecurityAudit = async (config: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Perform a security audit on the following Cisco IOS configuration.
    Identify:
    1. Weak passwords or encryption.
    2. Unsecured services (Telnet, HTTP).
    3. Missing ACLs or control plane policing.
    4. Compliance violations (CIS Benchmark).
    
    Provide a score (0-100) and list of specific vulnerabilities with remediation commands.

    Config:
    ${config}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Audit failed.";
  } catch (error) {
    return `Error: ${error}`;
  }
};

export const simulateScriptExecution = async (script: string): Promise<string> => {
   const prompt = `
    Act as a Cisco IOS Switch CLI.
    Simulate the realistic output of this Netmiko script.
    
    If the script connects to a specific IP or Hostname (e.g., Core-Switch-01), customize the prompt hostname in the output.
    Simulate realistic data (interfaces, errors, versions) based on the context of the script.
    
    Script:
    ${script}
   `;

   const response = await ai.models.generateContent({
     model: "gemini-2.5-flash",
     contents: prompt,
   });
   return response.text || "Execution finished.";
};

export const analyzeAgentResult = async (originalQuery: string, commandOutput: string): Promise<string> => {
    const prompt = `
      You are an intelligent Network Operations Agent.
      
      User Question: "${originalQuery}"
      
      Raw Command Output from Device:
      ${commandOutput}
      
      Task:
      1. Interpret the raw output.
      2. Answer the user's question directly and concisely in natural language.
      3. If there is a problem (e.g., interface down, high CPU), highlight it.
    `;
 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "I processed the command but couldn't generate a summary.";
 };

export const analyzePcapData = async (summary: string): Promise<string> => {
    const prompt = `
      You are a Network Security Analyst. Analyze this PCAP summary data.
      Identify:
      1. Potential DDoS patterns.
      2. Clear text credentials.
      3. Abnormal port usage.
      
      Data Summary:
      ${summary}
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text || "Analysis complete.";
};

export const compareConfigs = async (config1: string, config2: string): Promise<string> => {
    const prompt = `
      Compare these two network configurations. 
      Summarize the operational impact of the changes.
      
      Config A (Old):
      ${config1}
      
      Config B (New):
      ${config2}
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text || "Comparison complete.";
};

export const getGeminiClient = () => true;