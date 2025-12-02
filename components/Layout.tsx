
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Server, 
  Activity, 
  FileTerminal, 
  ShieldAlert, 
  Settings, 
  Bot, 
  FileText,
  Menu,
  X,
  Search,
  FileCode,
  Grid,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const MenuItem = ({ 
  icon: Icon, 
  label, 
  id, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  id: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors duration-200 ${
      active 
        ? 'bg-blue-600 text-white border-r-4 border-blue-300' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium whitespace-nowrap">{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'topology', label: t('topology'), icon: Network },
    { id: 'devices', label: t('devices'), icon: Server },
    { id: 'ipam', label: t('ipam'), icon: Grid },
    { id: 'automation', label: t('automation'), icon: Bot },
    { id: 'configs', label: t('configs'), icon: FileCode },
    { id: 'traffic', label: t('traffic'), icon: Activity },
    { id: 'logs', label: t('logs'), icon: FileText },
    { id: 'security', label: t('security'), icon: ShieldAlert },
    { id: 'reports', label: t('reports'), icon: ClipboardList },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 border-r border-gray-800 flex-shrink-0 transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">NetGenius</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={sidebarOpen ? item.label : ''}
              active={activePage === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-500">NetOps Team</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center bg-gray-800 rounded-md px-3 py-2 w-96">
                <Search size={18} className="text-gray-400 mr-2"/>
                <input 
                    type="text" 
                    placeholder={t('search')} 
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                />
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">{t('systemNormal')}</span>
                <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{t('aiReady')}</span>
            </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
