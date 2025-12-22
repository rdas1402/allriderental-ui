import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import howItWorksImg from "../assets/2.PNG";
import howItWorksImg1 from "../assets/3.PNG";
import roadImg from "../assets/road.png";
import roadnatureImg from "../assets/road_nature.png";
import roadslice1Img from "../assets/road_slice_1.png";
import roadslice2Img from "../assets/road_slice_2.png";
import roadslice3Img from "../assets/road_slice_3.png";
import roadslice4Img from "../assets/road_slice_4.png";
import riderImg from "../assets/rider.png";
import allRideRentalImage from "../assets/AllRideRental.jpg";

export default function MonthlySubscriptionPage() {
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("09:00");
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    // Reset scroll position immediately
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Smooth scroll after render
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
    
    // Set minimum date and time
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    setMinDate(today);
    
    // Format current time for time input (HH:MM)
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    setMinTime(currentTime);
    
    // Set initial delivery time to next available slot
    if (currentTime > "09:00") {
      setDeliveryTime("10:00");
    } else {
      setDeliveryTime("09:00");
    }
    
    return () => clearTimeout(timer);
  }, []);

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDeliveryDate(selectedDate);
    
    // If selected date is today, adjust time to current time or later
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate === today) {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // If current time is after selected delivery time, adjust delivery time
      const [selectedHours] = deliveryTime.split(':').map(Number);
      if (selectedHours < currentHours || (selectedHours === currentHours && currentMinutes > 0)) {
        // Set to next hour
        const nextHour = (currentHours + 1) % 24;
        setDeliveryTime(`${nextHour.toString().padStart(2, '0')}:00`);
      }
    }
  };

  // Handle time change
  const handleTimeChange = (e) => {
    setDeliveryTime(e.target.value);
  };

  const handleSearch = () => {
    if (!deliveryDate) {
      alert("Please select a delivery date");
      return;
    }
    
    // Validate if selected time is in the past for today
    const today = new Date().toISOString().split('T')[0];
    if (deliveryDate === today) {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
      if (deliveryTime < currentTime) {
        alert("Please select a time that is after the current time");
        return;
      }
    }
    
    navigate(`/subscription/vehicles?date=${deliveryDate}&time=${deliveryTime}`);
  };

  // Generate time slots (every hour from 06:00 to 22:00)
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="w-full flex flex-col">

<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Right Background Image - Inverted */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "left center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>

      {/* ---------- SECTION 9 — HERO / CTA ---------- */}
      <section className="w-full relative overflow-hidden">
        <div 
          className="w-full h-[600px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${roadslice1Img})` }}
        >
          {/* Rider Image positioned on the road */}
          <div className="absolute bottom-16 lg:right-96 w-1/3 lg:w-1/4 max-w-[500px]">
            <img 
              src={riderImg} 
              alt="Rider" 
              className="w-full h-auto object-contain"
            />
          </div>
          
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
              {/* Text + Date Time Search */}
              <div className="p-6 max-w-2xl">
                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-4 text-gray-800">
                  MONTHLY RENTALS <br /> STARTING AT JUST <span className="text-3xl md:text-5xl">₹153/DAY</span>
                </h1>
                <p className="text-gray-600 mb-8 text-sm">(Taxes Included)</p>

                <div className="bg-white/90 rounded-lg p-5 w-full max-w-md">
                  <label className="block text-xs font-semibold mb-2">Delivery Date & Time</label>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="date"
                      className="border rounded-md p-3 flex-1 text-sm"
                      value={deliveryDate}
                      min={minDate}
                      onChange={handleDateChange}
                    />
                    <select
                      className="border rounded-md p-3 w-32 text-sm"
                      value={deliveryTime}
                      onChange={handleTimeChange}
                    >
                      {timeSlots.map((time) => {
                        const isToday = deliveryDate === minDate;
                        const isTimeInPast = isToday && time < minTime;
                        
                        return (
                          <option 
                            key={time} 
                            value={time}
                            disabled={isTimeInPast}
                            className={isTimeInPast ? 'text-gray-400' : ''}
                          >
                            {time}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSearch}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-3 rounded-md flex-1 transition-colors text-sm"
                    >
                      SEARCH AVAILABLE VEHICLES
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {deliveryDate === minDate && (
                      <p>Times before {minTime} are unavailable for today</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 8 — BENEFITS ---------- */}
      <section className="w-full relative overflow-hidden">
        <div 
          className="w-full h-[600px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${roadslice2Img})` }}
        >
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="flex flex-col md:flex-row items-center gap-10 w-full">
              <div className="w-full md:w-1/2"></div>
              <div className="w-full md:w-1/2 bg-white/80 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-6">Benefits of ARR Monthly Subscription</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Benefit 
                    title="Free Doorstep Delivery" 
                    text="Vehicle delivered right to you" 
                    icon="🚚"
                  />
                  <Benefit 
                    title="Pay Monthly as you go" 
                    text="Only pre-pay for the next month" 
                    icon="💰"
                  />
                  <Benefit 
                    title="All Inclusive Pricing" 
                    text="Includes maintenance, helmet & insurance" 
                    icon="🛡️"
                  />
                  <Benefit 
                    title="Vehicle Guarantee" 
                    text="Free replacement if vehicle doesn't meet expectations" 
                    icon="✅"
                  />
                  <Benefit 
                    title="24/7 Roadside Assistance" 
                    text="Round-the-clock support" 
                    icon="🆘"
                  />
                  <Benefit 
                    title="Easy Early Termination" 
                    text="End subscription anytime" 
                    icon="🔓"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 7 — WHY ARR ---------- */}
      <section className="w-full relative overflow-hidden">
        <div 
          className="w-full h-[600px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${roadslice3Img})` }}
        >
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="w-full bg-white/80 rounded-lg p-8 max-w-6xl mx-auto">
              {/* Main Title */}
              <h2 className="text-3xl font-bold text-center mb-12">ARR Monthly Subscription</h2>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
                <WhyItem title="24/7 RSA" icon="🛡️" />
                <WhyItem title="Maintenance is Free" icon="🔧" />
                <WhyItem title="Own a vehicle without Buying" icon="🏍️" />
                <WhyItem title="No long-term Commitment" icon="📝" />
                <WhyItem title="Change models anytime" icon="🔄" />
              </div>

              {/* Divider with VS Text */}
              <div className="relative flex items-center justify-center mb-12">
                <div className="border-t border-gray-300 w-full absolute top-1/2"></div>
                <div className="bg-white px-6 py-2 relative z-10">
                  <span className="text-lg font-bold text-gray-700">V/S Purchasing a Bike/Car</span>
                </div>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ComparisonItem title="Hope you packed a toolbox" />
                <ComparisonItem title="Hello, Mechanic Bills" />
                <ComparisonItem title="Money Down, Stress Up" />
                <ComparisonItem title="Can't break up easily" />
                <ComparisonItem title="Stuck with just one!" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 6 — HOW IT WORKS ---------- */}
      <section className="w-full container mx-auto px-6 py-4">
        <img
          src={howItWorksImg1}
          alt="How It Works"
          className="w-full h-auto max-h-[650px] object-contain"
        />
      </section>

      {/* ---------- SECTION 5 — FAQ ---------- */}
      <section className="w-full relative overflow-hidden">
        <div 
          className="w-full h-[600px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${roadslice4Img})` }}
        >
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="w-full bg-white/80 rounded-lg p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
              <div className="text-center text-gray-600 text-sm">
                <p>FAQ content will go here...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------
   Helper Components
   ------------------------- */

const Benefit = ({ title, text, icon }) => (
  <div className="flex gap-3 p-3 border rounded-lg bg-white/90 text-sm">
    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-base">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-gray-600 text-xs">{text}</p>
    </div>
  </div>
);

const WhyItem = ({ title, icon }) => (
  <div className="text-center p-4">
    <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-3 text-green-600 text-xl">
      {icon}
    </div>
    <div className="font-semibold text-sm">{title}</div>
  </div>
);

const ComparisonItem = ({ title }) => (
  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
    <div className="text-red-600 mb-2 text-base">✗</div>
    <div className="text-xs font-medium text-gray-700">{title}</div>
  </div>
);