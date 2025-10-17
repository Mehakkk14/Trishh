import React from 'react';

const TestAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard Test</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg text-gray-700">
            If you can see this, the admin route is working properly.
          </p>
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p className="text-green-800">✅ Admin component is loading correctly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdmin;