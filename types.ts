export interface Device {
  id: string;
  hostname: string;
  ip: string;
  type: 'Switch' | 'Router' | 'Firewall' | 'Server';
  status: 'Online' | 'Offline' | 'Warning';
  location: string;
  lastSeen: string;
  osVersion: string;
  serialNumber: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Error' | 'Critical';
  device: string;
  message: string;
}

export interface AiScriptMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'code' | 'execution_result' | 'analysis';
  codeLanguage?: string;
  meta?: any;
}

export interface TopologyNode {
  id: string;
  group: number;
  ip: string;
}

export interface TopologyLink {
  source: string;
  target: string;
  value: number;
}

export interface SecurityAudit {
  id: string;
  deviceId: string;
  timestamp: string;
  score: number;
  vulnerabilities: {
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    cve?: string;
    description: string;
    remediation: string;
  }[];
}

export interface ConfigBackup {
  id: string;
  deviceId: string;
  hostname: string;
  timestamp: string;
  content: string;
  version: string;
}

export interface IpAddress {
  address: string;
  status: 'Active' | 'Free' | 'Reserved' | 'DHCP';
  device?: string;
  lastSeen?: string;
  mac?: string;
}

export interface TrafficFlow {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  bytes: number;
  packets: number;
}

export interface Report {
  id: string;
  title: string;
  type: 'Health' | 'Security' | 'Audit' | 'Capacity';
  generatedAt: string;
  status: 'Ready' | 'Generating';
}