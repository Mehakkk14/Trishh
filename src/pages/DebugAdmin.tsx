import { useState } from "react";

const DebugAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('DebugAdmin: Component rendering, activeTab:', activeTab);

  const renderContent = () => {
    console.log('DebugAdmin: Rendering content for tab:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded">
                <h3 className="font-semibold">Total Sales</h3>
                <p className="text-2xl">$24,350</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <h3 className="font-semibold">Orders</h3>
                <p className="text-2xl">1,250</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded">
                <h3 className="font-semibold">Products</h3>
                <p className="text-2xl">85</p>
              </div>
              <div className="bg-purple-100 p-4 rounded">
                <h3 className="font-semibold">Customers</h3>
                <p className="text-2xl">642</p>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Products Management</h2>
            <p>Products interface loading successfully.</p>
          </div>
        );
      case 'emails':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Email Management</h2>
            <p>Email interface loading successfully.</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Admin</h2>
            <p>Debug: Active tab is "{activeTab}"</p>
          </div>
        );
    }
  };

  console.log('DebugAdmin: About to return JSX');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Simple Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-600">TRISHH Debug Admin</h1>
          </div>
          <nav className="mt-6">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'products', label: 'Products' },
              { id: 'orders', label: 'Orders' },
              { id: 'customers', label: 'Customers' },
              { id: 'emails', label: 'Emails' },
              { id: 'settings', label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  console.log('DebugAdmin: Clicked tab:', item.id);
                  setActiveTab(item.id);
                }}
                className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Debug Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">
                Testing admin functionality (Active: {activeTab})
              </p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DebugAdmin;