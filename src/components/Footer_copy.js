import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-4">
              All Ride Rental
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for vehicle rentals. Quality service, affordable prices, and unforgettable journeys.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm font-semibold">VISA</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm font-semibold">MasterCard</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">About</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate("/about")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/career")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Career
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/partner")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Agent Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Features</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate("/blogs")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Blogs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/privacy")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/terms")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/cancellation")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/partner")}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Partner with us
                </button>
              </li>
            </ul>
          </div>

          {/* Install App Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Install App</h4>
            <p className="text-gray-400 mb-4">From App Store or Google Play</p>
            <div className="space-y-3">
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h5 className="text-lg font-semibold mb-2">Follow Us</h5>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <button
                    key={social}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© {new Date().getFullYear()} ALL RIDE RENTAL PVT LTD</p>
              <p className="text-sm mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;