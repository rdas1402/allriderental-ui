import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-blue-100 backdrop-blur-lg text-slate-800 border-t border-blue-200"> {/* Changed to lighter blue */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-light mb-4">
              All Ride <span className="font-semibold text-gold-500">Rental</span> {/* Changed gold color */}
            </h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed"> {/* Changed text color */}
              Premium vehicle rental service offering luxury cars and bikes for discerning customers. 
              Experience unparalleled service and sophistication.
            </p>
            <div className="flex space-x-3">
              <div className="bg-blue-200 p-3 rounded-lg border border-blue-300"> {/* Changed background */}
                <div className="text-xs font-semibold text-gold-500">VISA</div> {/* Changed gold color */}
              </div>
              <div className="bg-blue-200 p-3 rounded-lg border border-blue-300"> {/* Changed background */}
                <div className="text-xs font-semibold text-gold-500">MasterCard</div> {/* Changed gold color */}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gold-500">About</h4> {/* Changed gold color */}
            <ul className="space-y-2">
              {['About Us', 'Career', 'Agent Panel'].map((item) => (
                <li key={item}>
                  <button className="text-slate-600 hover:text-gold-500 transition-colors text-sm"> {/* Changed colors */}
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Features</h4> {/* Changed gold color */}
            <ul className="space-y-2">
              {['Blogs', 'Privacy Policy', 'Terms of Service', 'Cancellation Policy', 'Partner with us'].map((item) => (
                <li key={item}>
                  <button className="text-slate-600 hover:text-gold-500 transition-colors text-sm"> {/* Changed colors */}
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Install App Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Download App</h4> {/* Changed gold color */}
            <p className="text-slate-600 mb-4 text-sm">Experience luxury on the go</p> {/* Changed text color */}
            <div className="space-y-3">
              <button className="w-full bg-blue-200 hover:bg-blue-300 text-slate-800 py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-blue-300"> {/* Changed colors */}
                <div className="text-left">
                  <div className="text-slate-600 text-xs">Get it on</div> {/* Changed text color */}
                  <div className="font-semibold text-gold-500">Google Play</div> {/* Changed gold color */}
                </div>
              </button>
              <button className="w-full bg-blue-200 hover:bg-blue-300 text-slate-800 py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-blue-300"> {/* Changed colors */}
                <div className="text-left">
                  <div className="text-slate-600 text-xs">Download on the</div> {/* Changed text color */}
                  <div className="font-semibold text-gold-500">App Store</div> {/* Changed gold color */}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-300 mt-8 pt-8"> {/* Changed border color */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h5 className="text-md font-semibold mb-2 text-gold-500">Connect With Us</h5> {/* Changed gold color */}
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                  <button
                    key={social}
                    className="text-slate-600 hover:text-gold-500 transition-colors text-sm"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-slate-600 text-center md:text-right"> {/* Changed text color */}
              <p className="text-sm">© {new Date().getFullYear()} ALL RIDE RENTAL PVT LTD</p>
              <p className="text-xs mt-1 text-slate-500">Premium Luxury Mobility Services</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;