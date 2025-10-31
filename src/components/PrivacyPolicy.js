import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">
            At All Ride Rental, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Personal identification information</li>
            <li>Vehicle rental preferences</li>
            <li>Payment information</li>
            <li>Location data</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, process payments, and communicate with you about your rentals.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;