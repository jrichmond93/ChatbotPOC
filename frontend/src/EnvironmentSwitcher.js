import React from 'react';
import API_CONFIG from './apiConfig';

const EnvironmentSwitcher = () => {
  const currentEnv = API_CONFIG.isLocal ? 'Local Flask' : 'Vercel Serverless';
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: API_CONFIG.isLocal ? '#4CAF50' : '#2196F3',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 9999,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      🌍 {currentEnv}
      {API_CONFIG.isDebug && (
        <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.9 }}>
          Debug Mode ON
        </div>
      )}
    </div>
  );
};

export default EnvironmentSwitcher;