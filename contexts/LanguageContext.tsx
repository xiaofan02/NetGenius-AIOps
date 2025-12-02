
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Layout
    dashboard: "Dashboard",
    topology: "Topology",
    devices: "Device Manager",
    ipam: "IP Address Mgr",
    automation: "AI Automation",
    configs: "Config Mgmt",
    traffic: "Traffic & PCAP",
    logs: "Log Analysis",
    security: "Security & Audit",
    reports: "Reports",
    settings: "Settings",
    search: "Global search (IP, Device, Log)...",
    systemNormal: "System: Normal",
    aiReady: "AI Agent: Ready",
    
    // Devices
    deviceManagement: "Device Management",
    deviceSubtitle: "Inventory, Status, and Automated Inspection",
    addDevice: "Add Device",
    searchDevice: "Search by Hostname or IP...",
    sync: "Sync",
    syncing: "Syncing...",
    hostname: "Hostname",
    ipAddress: "IP Address",
    type: "Type",
    location: "Location",
    version: "Version",
    status: "Status",
    actions: "Actions",
    inspect: "Inspect",
    cli: "CLI",
    audit: "Audit",
    
    // Add Device Modal
    addNewDevice: "Add New Device",
    connectionDetails: "Connection Details",
    deviceDetails: "Device Details",
    protocol: "Protocol",
    port: "Port",
    username: "Username",
    password: "Password",
    enablePassword: "Enable Password (Optional)",
    autoFetch: "Test Connect & Fetch Info",
    fetching: "Connecting...",
    enterHostname: "Hostname (Auto-fetch or Manual)",
    enterIp: "Enter IP address",
    deviceType: "Device Platform",
    enterLocation: "Enter location",
    serialNumber: "Serial Number",
    cancel: "Cancel",
    confirmAdd: "Confirm Add",
    fillAllFields: "Please fill in IP and Credentials to fetch info.",

    // Settings
    platformSettings: "Platform Settings",
    generalConfig: "General Configuration",
    systemLanguage: "System Language",
    refreshRate: "Dashboard Refresh Rate",
    deploymentInfo: "Deployment & Environment",
    saveChanges: "Save Changes",
    saved: "Saved",
  },
  zh: {
    // Layout
    dashboard: "仪表盘",
    topology: "网络拓扑",
    devices: "设备管理",
    ipam: "IP地址管理",
    automation: "智能运维",
    configs: "配置管理",
    traffic: "流量分析",
    logs: "日志分析",
    security: "安全审计",
    reports: "报表中心",
    settings: "系统设置",
    search: "全局搜索 (IP, 设备, 日志)...",
    systemNormal: "系统状态: 正常",
    aiReady: "AI Agent: 就绪",

    // Devices
    deviceManagement: "设备管理中心",
    deviceSubtitle: "资产清单、状态监控与自动巡检",
    addDevice: "新增设备",
    searchDevice: "搜索主机名或IP地址...",
    sync: "同步状态",
    syncing: "同步中...",
    hostname: "主机名",
    ipAddress: "IP地址",
    type: "设备类型",
    location: "部署位置",
    version: "系统版本",
    status: "运行状态",
    actions: "操作",
    inspect: "巡检",
    cli: "终端",
    audit: "审计",

    // Add Device Modal
    addNewDevice: "添加新设备",
    connectionDetails: "连接信息",
    deviceDetails: "设备详情",
    protocol: "远程协议",
    port: "端口",
    username: "用户名",
    password: "密码",
    enablePassword: "Enable密码 (可选)",
    autoFetch: "测试连接并获取信息",
    fetching: "正在连接设备...",
    enterHostname: "主机名 (自动获取或手动)",
    enterIp: "输入IP地址",
    deviceType: "设备平台",
    enterLocation: "输入部署位置",
    serialNumber: "序列号",
    cancel: "取消",
    confirmAdd: "确认添加",
    fillAllFields: "请先填写IP和凭据以获取信息",

    // Settings
    platformSettings: "平台设置",
    generalConfig: "通用配置",
    systemLanguage: "系统语言",
    refreshRate: "仪表盘刷新频率",
    deploymentInfo: "部署环境信息",
    saveChanges: "保存设置",
    saved: "已保存",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
