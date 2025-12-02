
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Topology from './pages/Topology';
import Automation from './pages/Automation';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Devices from './pages/Devices';
import Security from './pages/Security';
import Traffic from './pages/Traffic';
import ConfigManagement from './pages/ConfigManagement';
import Ipam from './pages/Ipam';
import Reports from './pages/Reports';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'topology':
        return <Topology />;
      case 'automation':
        return <Automation />;
      case 'logs':
        return <Logs />;
      case 'devices':
        return <Devices />;
      case 'traffic':
        return <Traffic />;
      case 'configs':
        return <ConfigManagement />;
      case 'ipam':
        return <Ipam />;
      case 'security':
        return <Security />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
