import React from 'react';
import { MainLayout, DeploymentEventsDashboard } from '../components';
import { useTheme as useContextTheme } from '../context/ThemeContext';

const DeploymentEventsPage = () => {
  const { mode, toggleMode, color, setThemeColor } = useContextTheme();

  return (
    <MainLayout 
      onToggleTheme={toggleMode} 
      isDarkMode={mode === 'dark'}
      onChangeThemeColor={setThemeColor}
      currentTheme={color}
    >
      <DeploymentEventsDashboard />
    </MainLayout>
  );
};

export default DeploymentEventsPage;
