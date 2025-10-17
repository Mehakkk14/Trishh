import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test component
const TestHome = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>TRISHH - Basic App Test</h1>
    <p>✅ React Router is working</p>
    <p>✅ Home page is rendering</p>
  </div>
);

const TestAuth = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Auth Page Test</h1>
    <p>✅ Auth route is working</p>
  </div>
);

const BasicApp = () => {
  console.log('BasicApp: Starting render');
  
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/auth" element={<TestAuth />} />
          <Route path="*" element={<div>404 - Page not found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default BasicApp;