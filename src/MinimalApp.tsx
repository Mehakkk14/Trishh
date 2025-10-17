import React from 'react';

const MinimalApp = () => {
  console.log('MinimalApp: Rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>TRISHH - App Test</h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ marginBottom: '10px' }}>✅ React is working</p>
        <p style={{ marginBottom: '10px' }}>✅ TypeScript is compiling</p>
        <p style={{ marginBottom: '10px' }}>✅ Vite development server is running</p>
        <p style={{ color: 'green', fontWeight: 'bold' }}>The basic app structure is functional!</p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Debug Information:</h3>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>Current URL: {window.location.href}</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MinimalApp;