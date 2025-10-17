import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Test 1: Try importing QueryClient
let QueryClientTest;
try {
  const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");
  const queryClient = new QueryClient();
  QueryClientTest = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} catch (error) {
  console.error('QueryClient import failed:', error);
  QueryClientTest = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

// Test 2: Try importing UI components
let ToastTest;
try {
  const { Toaster } = require("@/components/ui/toaster");
  ToastTest = () => <Toaster />;
} catch (error) {
  console.error('Toast import failed:', error);
  ToastTest = () => null;
}

const TestPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>TRISHH - Step by Step Test</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ color: '#666' }}>✅ Component Tests:</h3>
        <p>✅ React is working</p>
        <p>✅ React Router is working</p>
        <p>✅ TypeScript compilation successful</p>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
        <p><strong>Next Step:</strong> If you can see this page, we'll gradually add back components</p>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Test Time:</strong> {new Date().toLocaleString()}</p>
      </div>

      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={() => window.location.href = '/auth'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Auth Route
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Test
        </button>
      </div>
    </div>
  </div>
);

const StepByStepApp = () => {
  console.log('StepByStepApp: Starting render');
  
  return (
    <QueryClientTest>
      <BrowserRouter>
        <ToastTest />
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/auth" element={<TestPage />} />
          <Route path="*" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientTest>
  );
};

export default StepByStepApp;