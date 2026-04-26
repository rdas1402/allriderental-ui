import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleAppButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSocialMediaClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to handle LinkedIn job postings navigation
  const handleLinkedInJobs = () => {
    // Direct LinkedIn job search for "All Ride Rental" positions
    const linkedInJobsUrl = "https://www.linkedin.com/jobs/search/?keywords=All%20Ride%20Rental&location=&position=1&pageNum=0";
    window.open(linkedInJobsUrl, '_blank', 'noopener,noreferrer');
  };

  const socialMediaLinks = {
    Facebook: "https://www.facebook.com/ALLREIDERENTAL",
    Instagram: "https://www.instagram.com/ALLRIDERENTAL",
    Twitter: "https://www.twitter.com/ALLRIDERENTAL",
    LinkedIn: "https://www.linkedin.com/company/ALLRIDERENTAL"
  };

  return (
    <>
      <footer className="bg-black backdrop-blur-lg text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <h3 className="text-lg font-light mb-4">
                All Ride <span className="font-semibold text-gold-500">Rental</span>
              </h3>
              <p className="text-slate-300 mb-6 text-xs leading-relaxed">
                Premium vehicle rental service offering luxury cars and bikes for discerning customers. 
                Experience unparalleled service and sophistication.
              </p>
              <div className="flex space-x-3">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <div className="text-xs font-semibold text-gold-500">VISA</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <div className="text-xs font-semibold text-gold-500">MasterCard</div>
                </div>
              </div>
            </div>

            {/* About Section - UPDATED Career button */}
            <div className="col-span-1">
              <h4 className="text-base font-semibold mb-4 text-gold-500">About</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNavigation("/about")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleLinkedInJobs}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs flex items-center"
                  >
                    Career
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/login")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    Agent Panel
                  </button>
                </li>
              </ul>
            </div>

            {/* Features Section */}
            <div className="col-span-1">
              <h4 className="text-base font-semibold mb-4 text-gold-500">Features</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNavigation("/blogs")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    Blogs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/privacy")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/terms")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/cancellation")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    Cancellation Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/partner")}
                    className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                  >
                    Partner with us
                  </button>
                </li>
              </ul>
            </div>

            {/* Install App Section */}
            <div className="col-span-1">
              <h4 className="text-base font-semibold mb-4 text-gold-500">Download App</h4>
              <p className="text-slate-300 mb-4 text-xs">Experience luxury on the go</p>
              <div className="space-y-3">
                <button 
                  onClick={handleAppButtonClick}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-700 text-xs"
                >
                  <div className="text-left">
                    <div className="text-slate-300 text-xs">Get it on</div>
                    <div className="font-semibold text-gold-500 text-sm">Google Play</div>
                  </div>
                </button>
                <button 
                  onClick={handleAppButtonClick}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-700 text-xs"
                >
                  <div className="text-left">
                    <div className="text-slate-300 text-xs">Download on the</div>
                    <div className="font-semibold text-gold-500 text-sm">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h5 className="text-sm font-semibold mb-2 text-gold-500">Connect With Us</h5>
                <div className="flex space-x-4">
                  {Object.entries(socialMediaLinks).map(([social, url]) => (
                    <button
                      key={social}
                      onClick={() => handleSocialMediaClick(url)}
                      className="text-slate-300 hover:text-gold-500 transition-colors text-xs"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-slate-400 text-center md:text-right text-xs">
                <p className="text-xs">© {new Date().getFullYear()} ALL RIDE RENTAL PVT LTD</p>
                <p className="text-xs mt-1 text-slate-500">Premium Luxury Mobility Services</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto shadow-xl">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Coming Soon</h3>
              <p className="text-slate-600 mb-6 text-sm">
                Our mobile app will be available soon. Stay tuned for updates!
              </p>
              <button
                onClick={closePopup}
                className="bg-gold-500 hover:bg-gold-600 text-white py-2 px-6 rounded-lg transition-colors text-sm font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;