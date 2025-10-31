import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-900/95 backdrop-blur-lg text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-light mb-4">
              All Ride <span className="font-semibold text-gold-400">Rental</span>
            </h3>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Premium vehicle rental service offering luxury cars and bikes for discerning customers. 
              Experience unparalleled service and sophistication.
            </p>
            <div className="flex space-x-3">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-xs font-semibold text-gold-400">VISA</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-xs font-semibold text-gold-400">MasterCard</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gold-400">About</h4>
            <ul className="space-y-2">
              {['About Us', 'Career', 'Agent Panel'].map((item) => (
                <li key={item}>
                  <button className="text-slate-400 hover:text-gold-400 transition-colors text-sm">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Features</h4>
            <ul className="space-y-2">
              {['Blogs', 'Privacy Policy', 'Terms of Service', 'Cancellation Policy', 'Partner with us'].map((item) => (
                <li key={item}>
                  <button className="text-slate-400 hover:text-gold-400 transition-colors text-sm">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Install App Section */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Download App</h4>
            <p className="text-slate-400 mb-4 text-sm">Experience luxury on the go</p>
            <div className="space-y-3">
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-700">
                <div className="text-left">
                  <div className="text-slate-400 text-xs">Get it on</div>
                  <div className="font-semibold text-gold-400">Google Play</div>
                </div>
              </button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-slate-700">
                <div className="text-left">
                  <div className="text-slate-400 text-xs">Download on the</div>
                  <div className="font-semibold text-gold-400">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h5 className="text-md font-semibold mb-2 text-gold-400">Connect With Us</h5>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                  <button
                    key={social}
                    className="text-slate-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-slate-400 text-center md:text-right">
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