import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">
            Welcome to All Ride Rental. By using our services, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Rental Agreement</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Minimum age requirement: 21 years</li>
            <li>Valid driving license required</li>
            <li>Security deposit applicable</li>
            <li>Fuel policy: Same as received</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Vehicle Usage</h2>
          <p>Vehicles must be used in accordance with local laws and regulations. Any illegal activities are strictly prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;