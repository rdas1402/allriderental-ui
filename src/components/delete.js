# Query: 
# ContextLines: 1

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hiluxImage from "../assets/hilux.jpg"
import royalenfieldimg from "../assets/royalenfieldimg.png"
import innovacrystaImage from "../assets/innove_crysta.png"
import tharImage from "../assets/Tharimg.png";
import selfDriveImage from "../assets/selfDriveImage.png";
import allRideRentalImage from "../assets/AllRideRental.jpg";
import { vehiclesAPI } from "../services/apiService";

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(1);
  const [saveBigVehicles, setSaveBigVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch discounted vehicles from API
  useEffect(() => {
    const fetchDiscountedVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const discountedVehicles = await vehiclesAPI.getTopDiscountedVehicles();
        
        const transformedVehicles = discountedVehicles.map(vehicle => ({
          name: vehicle.name,
          image: vehicle.image,
          prices: generatePricePlans(vehicle)
        }));
        
        setSaveBigVehicles(transformedVehicles);
      } catch (err) {
        console.error("Error fetching discounted vehicles:", err);
        setError(err.message || "Failed to load discounted vehicles. Please try again later.");
        setSaveBigVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedVehicles();
  }, []);

  const generatePricePlans = (vehicle) => {
    try {
      const basePriceStr = vehicle.rentPrice?.replace('₹', '').replace('/day', '').trim() || '0';
      const basePrice = parseFloat(basePriceStr) || 1000;
      
      const discountMultiplier = 1 - ((vehicle.discountPercentage || 0) / 100);
      const discountedPricePerDay = basePrice * discountMultiplier;
      
      const durations = [7, 15, 30];
      const pricePlans = [];
      
      durations.forEach(days => {
        if (pricePlans.length < 3 && Math.random() > 0.3) {
          const totalPrice = discountedPricePerDay * days;
          const variation = 0.9 + (Math.random() * 0.2);
          const finalPrice = Math.round(totalPrice * variation);
          
          pricePlans.push({
            days: days,
            price: `₹${finalPrice}`
          });
        }
      });
      
      while (pricePlans.length < 2) {
        const days = durations[pricePlans.length];
        const totalPrice = discountedPricePerDay * days;
        pricePlans.push({
          days: days,
          price: `₹${Math.round(totalPrice)}`
        });
      }
      
      return pricePlans;
    } catch (error) {
      console.error("Error generating price plans:", error);
      return [];
    }
  };

  const handleRentCars = () => {
    navigate("/rent?type=car");
  };

  const handleRentBikes = () => {
    navigate("/rent?type=bike");
  };

  const servicesOffered = [
    {
      title: "Bike Rentals",
      description: "Explore the city on two wheels",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "/rent?type=bike",
      category: "bike",
      icon: "🏍️"
    },
    {
      title: "Car Rentals",
      description: "Comfortable rides for your journey",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      link: "/rent?type=car",
      category: "car",
      icon: "🚗"
    },
    {
      title: "Monthly Subscriptions",
      description: "Long-term rental solutions",
      image: "http://localhost:3000/allriderental-ui/static/media/royalenfieldimg.feefeaaf2d5cf51d3d33.png",
      link: "/rent?subscription=true",
      category: "subscription",
      icon: "📅"
    },
    {
      title: "Outstation Rentals",
      description: "Go beyond city limits",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "/rent?type=outstation",
      category: "outstation",
      icon: "🗺️"
    },
    {
      title: "Luxury Vehicles",
      description: "Premium travel experience",
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "/rent?type=luxury",
      category: "luxury",
      icon: "⭐"
    },
    {
      title: "Self Drive",
      description: "Drive at your convenience",
      image: selfDriveImage,
      link: "/rent?type=selfdrive",
      category: "selfdrive",
      icon: "👨‍💼"
    }
  ];

  const testimonials = [
    {
      id: 1,
      rating: 46,
      text: "I have just made a booking, because of connecting flights being late, I needed to shift the whole booking by a day. First of all the app and it website are good. I found the app especially user friendly and the inventory is good too. On top when I needed the mechanism of the booking I was indeed exceptionally sad by Devil in customer care. He understood the delay, helped cancel the last booking with no penalties. This took away the stress associated with such situations.",
      author: "Gaurav Kumar",
      platform: "Apple app store",
      position: "top"
    },
    {
      id: 2,
      rating: 5,
      text: "Vehicle was in very good condition and all the staff was very humble. Our vehicle got punctuated but we got full assistance and after contacting their staff. We also got the full refund. Absolutely reliable in Bangalore.",
      author: "Akshay Kumar",
      platform: "Google play store",
      position: "middle"
    },
    {
      id: 3,
      rating: 5,
      text: "Hello all. I had booked a bike for 16th Oct. Just then I noticed I booked for the wrong date and my visit starts on this time. It was indeed one of those day you know you have messed up. I reached out to my dad before he see if there is anyhow I can get this float. Thanks to my savior Denzel from RB, in a flash he let my concern fixed and ready to move on. I was assisted in cancelling a bike one day prior to scheduled time. Thank you Denzel & RB - you guys are doing great stuff!",
      author: "Yasil Premial",
      platform: "Google play store",
      position: "bottom"
    },
    {
      id: 4,
      rating: 5,
      text: "Hello all. I had booked a bike for 16th Oct. Just then I noticed I booked for the wrong date and my visit starts on this time. It was indeed one of those day you know you have messed up. I reached out to my dad before he see if there is anyhow I can get this float. Thanks to my savior Denzel from RB, in a flash he let my concern fixed and ready to move on. I was assisted in cancelling a bike one day prior to scheduled time. Thank you Denzel & RB - you guys are doing great stuff!",
      author: "Yasil Premial",
      platform: "Google play store",
      position: "bottom"
    },
    {
      id: 5,
      rating: 5,
      text: "Hello all. I had booked a bike for 16th Oct. Just then I noticed I booked for the wrong date and my visit starts on this time. It was indeed one of those day you know you have messed up. I reached out to my dad before he see if there is anyhow I can get this float. Thanks to my savior Denzel from RB, in a flash he let my concern fixed and ready to move on. I was assisted in cancelling a bike one day prior to scheduled time. Thank you Denzel & RB - you guys are doing great stuff!",
      author: "Yasil Premial",
      platform: "Google play store",
      position: "bottom"
    },
    {
      id: 6,
      rating: 5,
      text: "Hello all. I had booked a bike for 16th Oct. Just then I noticed I booked for the wrong date and my visit starts on this time. It was indeed one of those day you know you have messed up. I reached out to my dad before he see if there is anyhow I can get this float. Thanks to my savior Denzel from RB, in a flash he let my concern fixed and ready to move on. I was assisted in cancelling a bike one day prior to scheduled time. Thank you Denzel & RB - you guys are doing great stuff!",
      author: "Yasil Premial",
      platform: "Google play store",
      position: "bottom"
    }
  ];

  const services = [
    {
      title: "DAILY RENTALS",
      description: "Flexible rental options for your daily needs",
      features: [
        { 
          icon: "🔄", 
          title: "FLEXIBLE", 
          description: "Choose your preferred pickup and drop-off" 
        },
        { 
          icon: "💰", 
          title: "PRICING", 
          description: "Pay only for hours used" 
        },
        { 
          icon: "📦", 
          title: "PACKAGES", 
          description: "Lower rates for 7+, 15+, or 30+ days" 
        },
        { 
          icon: "🛡️", 
          title: "PRICING INCLUSIONS", 
          description: "24/7 Roadside Assistance" 
        }
      ],
      buttonText: "RENT NOW",
      image: hiluxImage,
      reverse: false,
      isCar: true,
      accentColor: "from-blue-50 to-blue-100"
    },
    {
      title: "ARR MONTHLY SUBSCRIPTION",
      description: "Long-term rental solutions with maximum benefits",
      features: [
        { 
          icon: "📅", 
          title: "DURATION", 
          description: "Rent for 3, 6, 9, or 12 months" 
        },
        { 
          icon: "💳", 
          title: "EASY PAYMENTS", 
          description: "Pay monthly as you go" 
        },
        { 
          icon: "🎁", 
          title: "PRICING INCLUSIONS", 
          description: "Maintenance, 1 Helmet, & 24/7 Roadside Assistance" 
        },
        { 
          icon: "🚪", 
          title: "CONVENIENT", 
          description: "Doorstep delivery" 
        }
      ],
      buttonText: "SUBSCRIBE NOW",
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      reverse: true,
      isCar: false,
      accentColor: "from-gold-50 to-gold-100"
    }
  ];

  const stats = [
    { number: "300+", label: "BIKES ON ROAD" },
    { number: "10", label: "YEARS OF EXCELLENCE" },
    { number: "6+", label: "SPREAD ACROSS CITIES" },
    { number: "1.2 Lakhs+", label: "HAPPY USERS" }
  ];

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
  };

  const getTestimonialIndex = (offset) => {
    return (currentTestimonial + offset + testimonials.length) % testimonials.length;
  };

  // Background image section component
  const BackgroundImageSection = ({ children, className = "" }) => (
    <div className={`relative ${className}`}>
      {/* Split Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
  <div className="flex h-full gap-4 -mx-2"> {/* Add gap and negative margin */}
    {/* Left half of the image - moved to extreme left */}
    <div 
      className="w-1/2 h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${allRideRentalImage})`,
        backgroundPosition: "left center"
      }}
    ></div>
    
    {/* Right half of the image - moved to extreme right */}
    <div 
      className="w-1/2 h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${allRideRentalImage})`,
        backgroundPosition: "right center"
      }}
    ></div>
  </div>
</div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white mobile-container">
      {/* Hero Section */}
      <div className="relative bg-white hero-section">
        <div 
          className="h-[500px] sm:h-[600px] md:h-[800px] bg-cover bg-center bg-no-repeat rounded-b-3xl overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${hiluxImage})`,
            backgroundPosition: "center 30%"
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 leading-tight mobile-hero-title">
                Welcome to <span className="font-semibold text-gold-400">All Ride Rental</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed mobile-hero-subtitle">
                Experience luxury travel with our premium fleet of cars and bikes. 
                Your journey begins with us.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button 
                  onClick={handleRentCars}
                  className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg mobile-button"
                >
                  🚗 Explore Cars
                </button>
                <button 
                  onClick={handleRentBikes}
                  className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 border border-gray-300 mobile-button"
                >
                  🏍️ Discover Bikes
                </button>
              </div>
            </div>

            {/* Vehicle Cards Inside Hero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full mt-6 sm:mt-8">
              <div 
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 cursor-pointer hover:bg-opacity-30 transition-all duration-500 border border-white border-opacity-30 hover:scale-105 group"
                onClick={handleRentCars}
              >
                <div className="w-full h-32 sm:h-40 mb-3 sm:mb-4 rounded-xl overflow-hidden flex items-center justify-center bg-transparent">
                  <img 
                    src={innovacrystaImage} 
                    alt="Premium Cars"
                    className="h-40 sm:h-48 md:h-60 object-contain object-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      maxWidth: '100%',
                      minWidth: '80%'
                    }}
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Premium Cars</h2>
                <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4">Luxury sedans, SUVs, and sports cars for every occasion</p>
                <div className="text-gold-300 font-medium flex items-center text-xs sm:text-sm group-hover:translate-x-2 transition-transform duration-300">
                  Discover our fleet <span className="ml-2">→</span>
                </div>
              </div>
              
              <div 
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 cursor-pointer hover:bg-opacity-30 transition-all duration-500 border border-white border-opacity-30 hover:scale-105 group"
                onClick={handleRentBikes}
              >
                <div className="w-full h-32 sm:h-40 mb-3 sm:mb-4 rounded-xl overflow-hidden flex items-center justify-center bg-transparent">
                  <img 
                    src={royalenfieldimg} 
                    alt="Adventure Bikes"
                    className="h-32 sm:h-40 md:h-48 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                    style={{
                      transform: 'scale(1.2)'
                    }}
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Adventure Bikes</h2>
                <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4">Premium motorcycles for your thrilling adventures</p>
                <div className="text-gold-300 font-medium flex items-center text-xs sm:text-sm group-hover:translate-x-2 transition-transform duration-300">
                  Start your journey <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Services Offered Section with Background */}
        <BackgroundImageSection className="mb-8 sm:mb-12">
          <section className="services_offered">
            <div className="title text-center mb-8 sm:mb-16">
              <div className="inline-block mb-3 sm:mb-4">
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mx-auto"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-800 mb-4 sm:mb-6">
                Services We Offer
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Discover our comprehensive range of premium rental services designed for your convenience
              </p>
            </div>
            
            <div className="images">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mobile-services-grid">
                {servicesOffered.map((service, index) => (
                  <div key={index} className="group">
                    <a 
                      href={service.link} 
                      className="block"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(service.link);
                      }}
                    >
                      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group-hover:translate-y-[-8px] sm:group-hover:translate-y-[-12px] border border-gray-100 relative">
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center text-xl sm:text-2xl">
                            {service.icon}
                          </div>
                        </div>
                        
                        <div className="h-40 sm:h-56 overflow-hidden relative">
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        <div className="p-4 sm:p-6 md:p-8 text-center relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gold-500 rounded-full"></div>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                            {service.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {service.description}
                          </p>
                          <div className="mt-3 sm:mt-4 text-gold-500 font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs sm:text-sm">
                            Explore Service <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </BackgroundImageSection>

        {/* Our Rental Plans Section with Background */}
        <BackgroundImageSection className="mb-8 sm:mb-12">
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block mb-3 sm:mb-4">
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-800 mb-4 sm:mb-6">
                Our Rental Plans
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Choose from our carefully crafted rental plans designed to suit every need and budget
              </p>
            </div>
            
            {/* Classic Two Panel Layout */}
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
              {/* Daily Rentals Panel */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Side - Content */}
                  <div className="lg:w-1/2 p-4 sm:p-6 md:p-8">
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">DAILY RENTALS</h3>
                      <p className="text-sm text-slate-600 mb-2">Flexible rental options for your daily needs</p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">🔄</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">FLEXIBLE</h4>
                          <p className="text-slate-600 text-xs">Choose your preferred pickup and drop-off</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">💰</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">PRICING</h4>
                          <p className="text-slate-600 text-xs">Pay only for hours used</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">📦</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">PACKAGES</h4>
                          <p className="text-slate-600 text-xs">Lower rates for 7+, 15+, or 30+ days</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">🛡️</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-1">PRICING INCLUSIONS</h4>
                          <p className="text-slate-600 text-xs">24/7 Roadside Assistance</p>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="w-full bg-amber-400 hover:bg-amber-600 text-slate-800 py-2 sm:py-3 rounded-lg font-bold text-sm transition-all duration-300">
                      RENT NOW
                    </button>
                  </div>

                  {/* Right Side - Vehicle Image */}
                  <div className="lg:w-1/2 bg-transparent flex items-start justify-center p-4 pt-0">
                    <div className="w-full max-w-2xl -mt-4">
                      <img 
                        src={royalenfieldimg}
                        alt="Premium Car"
                        className="w-full h-80 sm:h-96 md:h-[500px] object-contain transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ARR Monthly Subscription Panel */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col lg:flex-row-reverse">
                  {/* Right Side - Content */}
                  <div className="lg:w-1/2 p-4 sm:p-6 md:p-8">
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-slate-700 mb-2 sm:mb-3">ARR MONTHLY SUBSCRIPTION</h3>
                      <p className="text-sm text-slate-600 mb-2">Long-term rental solutions with maximum benefits</p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">📅</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-1">DURATION</h4>
                          <p className="text-slate-600 text-xs">Rent for 3, 6, 9, or 12 months</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">💳</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-1">EASY PAYMENTS</h4>
                          <p className="text-slate-600 text-xs">Pay monthly as you go</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">🎁</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-1">PRICING INCLUSIONS</h4>
                          <p className="text-slate-600 text-xs">Maintenance, 1 Helmet, & 24/7 Roadside Assistance</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm sm:text-lg text-white">🚪</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-1">CONVENIENT</h4>
                          <p className="text-slate-600 text-xs">Doorstep delivery</p>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button 
                      onClick={() => navigate('/subscription')}
                      className="w-full bg-amber-400 hover:bg-amber-600 text-slate-800 py-2 sm:py-3 rounded-lg font-bold text-sm transition-all duration-300"
                    >
                      SUBSCRIBE NOW
                    </button>
                  </div>

                  {/* Left Side - Vehicle Image */}
                  <div className="lg:w-1/2 bg-transparent flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl">
                      <img 
                        src={tharImage}
                        alt="Premium Bike"
                        className="w-full h-80 sm:h-96 md:h-[500px] object-contain transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BackgroundImageSection>

        {/* Save Big Section with Background */}
        <BackgroundImageSection className="mb-8 sm:mb-16">
          <div>
            <div className="text-center mb-8 sm:mb-16">
              <div className="inline-block mb-3 sm:mb-4">
                <div className="w-16 sm:w-20 h-1 sm:h-2 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mx-auto"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text mb-3 sm:mb-4">
                SAVE BIG!!
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 font-light">
                Exclusive deals for extended rentals
              </p>
              <div className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">
                Rent for 7+, 15+ and 30+ days
              </div>
            </div>
            
            {loading && (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gold-500"></div>
                <span className="ml-2 sm:ml-3 text-slate-600 text-xs sm:text-sm">Loading discounted vehicles...</span>
              </div>
            )}
            
            {error && !loading && (
              <div className="text-center py-6 sm:py-8 bg-red-50 rounded-xl sm:rounded-2xl border border-red-200 mx-2 sm:mx-8">
                <div className="text-red-500 text-base sm:text-lg font-semibold mb-2">Unable to Load Discounted Vehicles</div>
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-3 sm:mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-colors duration-300 text-xs sm:text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!loading && !error && saveBigVehicles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-24 max-w-8xl mx-auto px-2 sm:px-0">
                {saveBigVehicles.map((vehicle, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-slate-400 to-slate-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] border border-slate-200 overflow-visible relative min-h-[280px] sm:min-h-[340px]"
                  >
                    <div className="absolute -bottom-16 -left-24 sm:-bottom-20 sm:-left-36 w-60 h-48 sm:w-80 sm:h-60 rounded-2xl overflow-hidden z-10">
                      <img 
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-contain p-2" 
                      />
                    </div>

                    <div className="w-full pt-4 pr-4 pb-4 pl-20 sm:pl-24">
                      <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4 text-center">
                        {vehicle.name}
                      </h4>
                      
                      <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                        {vehicle.prices.map((price, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-xs sm:text-sm text-slate-600 font-medium mb-1">
                              {price.days} Days
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-gold-600">
                              {price.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-2 sm:top-3 -left-8 sm:-left-12">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg">
                        HOT DEAL
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && saveBigVehicles.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 mx-2 sm:mx-8">
                <div className="text-gray-500 text-base sm:text-lg font-semibold mb-2">No Discounted Vehicles Available</div>
                <p className="text-gray-600 text-xs sm:text-sm">Check back later for special offers and discounts.</p>
              </div>
            )}
          </div>
        </BackgroundImageSection>

        {/* Stats Section with Background */}
        <BackgroundImageSection className="mb-8 sm:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-4px] sm:hover:translate-y-[-8px] group"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-gold-600 to-gold-300 bg-clip-text mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-semibold text-xs sm:text-xs uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </BackgroundImageSection>

        {/* Testimonials Section with Background */}
        <BackgroundImageSection className="mb-8 sm:mb-16">
          <div>
            <div className="text-center mb-8 sm:mb-20">
              <div className="inline-block mb-3 sm:mb-4">
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mx-auto"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-800 mb-4 sm:mb-6">
                What Our Users Say
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Hear from our satisfied customers about their experiences
              </p>
            </div>
            
            <div className="relative max-w-6xl mx-auto">
              {/* Navigation Arrows */}
              <button 
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-20 bg-white rounded-full p-2 sm:p-4 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-12 z-20 bg-white rounded-full p-2 sm:p-4 shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Testimonials Container */}
              <div className="overflow-hidden px-4 sm:px-8 md:px-12">
                <div className="flex gap-4 sm:gap-6 md:gap-8 items-center justify-center">
                  {/* Left Testimonial */}
                  <div className={`transition-all duration-500 ease-in-out ${
                    getTestimonialIndex(-1) === currentTestimonial
                      ? 'scale-110 sm:scale-125 shadow-xl sm:shadow-3xl border-2 border-gold-300 z-10 min-w-[280px] sm:min-w-[350px] md:min-w-[450px]'
                      : 'scale-100 opacity-80 min-w-[200px] sm:min-w-[280px] md:min-w-[350px]'
                  }`}>
                    <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg sm:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text mb-4 sm:mb-6 text-center">
                        {testimonials[getTestimonialIndex(-1)].rating}
                      </div>
                      <div className="flex-grow mb-4 sm:mb-6 md:mb-8">
                        <p className="text-slate-600 leading-relaxed text-xs sm:text-sm text-center italic">
                          "{testimonials[getTestimonialIndex(-1)].text}"
                        </p>
                      </div>
                      <div className="border-t border-gray-200 my-4 sm:my-6"></div>
                      <div className="text-center">
                        <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-1 sm:mb-2">
                          {testimonials[getTestimonialIndex(-1)].author}
                        </h4>
                        <p className="text-slate-500 text-xs sm:text-xs font-semibold uppercase tracking-wide">
                          {testimonials[getTestimonialIndex(-1)].platform}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Testimonial */}
                  <div className={`transition-all duration-500 ease-in-out ${
                    getTestimonialIndex(0) === currentTestimonial
                      ? 'scale-110 sm:scale-125 shadow-xl sm:shadow-3xl border-2 border-gold-300 z-10 min-w-[280px] sm:min-w-[350px] md:min-w-[450px]'
                      : 'scale-100 opacity-80 min-w-[200px] sm:min-w-[280px] md:min-w-[350px]'
                  }`}>
                    <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg sm:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text mb-4 sm:mb-6 text-center">
                        {testimonials[getTestimonialIndex(0)].rating}
                      </div>
                      <div className="flex-grow mb-4 sm:mb-6 md:mb-8">
                        <p className="text-slate-600 leading-relaxed text-xs sm:text-sm text-center italic">
                          "{testimonials[getTestimonialIndex(0)].text}"
                        </p>
                      </div>
                      <div className="border-t border-gray-200 my-4 sm:my-6"></div>
                      <div className="text-center">
                        <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-1 sm:mb-2">
                          {testimonials[getTestimonialIndex(0)].author}
                        </h4>
                        <p className="text-slate-500 text-xs sm:text-xs font-semibold uppercase tracking-wide">
                          {testimonials[getTestimonialIndex(0)].platform}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Testimonial */}
                  <div className={`transition-all duration-500 ease-in-out ${
                    getTestimonialIndex(1) === currentTestimonial
                      ? 'scale-110 sm:scale-125 shadow-xl sm:shadow-3xl border-2 border-gold-300 z-10 min-w-[280px] sm:min-w-[350px] md:min-w-[450px]'
                      : 'scale-100 opacity-80 min-w-[200px] sm:min-w-[280px] md:min-w-[350px]'
                  }`}>
                    <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-lg sm:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text mb-4 sm:mb-6 text-center">
                        {testimonials[getTestimonialIndex(1)].rating}
                      </div>
                      <div className="flex-grow mb-4 sm:mb-6 md:mb-8">
                        <p className="text-slate-600 leading-relaxed text-xs sm:text-sm text-center italic">
                          "{testimonials[getTestimonialIndex(1)].text}"
                        </p>
                      </div>
                      <div className="border-t border-gray-200 my-4 sm:my-6"></div>
                      <div className="text-center">
                        <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-1 sm:mb-2">
                          {testimonials[getTestimonialIndex(1)].author}
                        </h4>
                        <p className="text-slate-500 text-xs sm:text-xs font-semibold uppercase tracking-wide">
                          {testimonials[getTestimonialIndex(1)].platform}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicators */}
              <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-gold-500 w-6 sm:w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </BackgroundImageSection>

        {/* Why Choose Us Section with Background */}
        <BackgroundImageSection className="relative max-w-6xl mx-auto">
          {/* Animated Background Road - Compact */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-amber-50/50 to-green-50/60"></div>
            
            {/* Moving Road Lines */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30 animate-pulse"></div>
            <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-20 animate-pulse delay-75"></div>
          </div>

          <div className="relative bg-gradient-to-br from-white/95 via-blue-50/90 to-amber-50/90 rounded-2xl p-6 sm:p-8 border border-gray-100/80 shadow-xl overflow-hidden backdrop-blur-sm">
            
            {/* Animated Moving Vehicles - Smaller */}
            <div className="absolute -left-16 top-1/4 w-32 h-20 opacity-70 animate-bounce-float">
              <img 
                src={royalenfieldimg} 
                alt="Bike" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            
            <div className="absolute -right-16 bottom-1/3 w-40 h-24 opacity-80 animate-bounce-float delay-1000">
              <img 
                src={hiluxImage} 
                alt="Car" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            {/* Compact Main Content */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-green-500 rounded-full mx-2"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping delay-300"></div>
                <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-amber-500 rounded-full mx-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping delay-700"></div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                Why Ride With <span className="text-transparent bg-gradient-to-r from-blue-600 via-amber-500 to-green-600 bg-clip-text">Us</span>?
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                Experience premium service with our exceptional fleet
              </p>
            </div>

            {/* Compact Features Grid with All Designs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
              {/* Premium Quality Card */}
              <div className="group relative bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Animated Vehicle Background */}
                <div className="absolute inset-0 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <img 
                    src={innovacrystaImage} 
                    alt="Luxury Car" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                  />
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                <div className="relative z-10">
                  {/* Animated Icon */}
                  <div className="relative mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-lg mx-auto">
                      <span className="text-xl text-white">⭐</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors text-center">
                    Premium Quality
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-center">
                    Immaculately maintained luxury vehicles
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-3 flex justify-center space-x-2">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">Premium</span>
                  </div>
                </div>
                
                {/* Interactive Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-amber-500 group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Best Value Card */}
              <div className="group relative bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Animated Bike Background */}
                <div className="absolute inset-0 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <img 
                    src={royalenfieldimg} 
                    alt="Premium Bike" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                  />
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                <div className="relative z-10">
                  {/* Animated Icon */}
                  <div className="relative mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-lg mx-auto">
                      <span className="text-xl text-white">💰</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors text-center">
                    Best Value
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-center">
                    Competitive pricing, no hidden costs
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-3 flex justify-center space-x-2">
                    <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-semibold">Affordable</span>
                  </div>
                </div>
                
                {/* Interactive Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-green-500 group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* 24/7 Support Card */}
              <div className="group relative bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Animated Service Background */}
                <div className="absolute inset-0 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <img 
                    src={selfDriveImage} 
                    alt="Service Vehicle" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                  />
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                <div className="relative z-10">
                  {/* Animated Icon */}
                  <div className="relative mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-lg mx-auto">
                      <span className="text-xl text-white">🔧</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors text-center">
                    24/7 Support
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-center">
                    Round-the-clock assistance
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-3 flex justify-center space-x-2">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">24/7</span>
                  </div>
                </div>
                
                {/* Interactive Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* Compact CTA Section */}
            <div className="text-center mt-8 relative z-10">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50/80 to-amber-50/80 rounded-xl px-6 py-4 border border-blue-200/50 shadow-lg backdrop-blur-sm">
                <span className="text-slate-700 text-sm font-semibold mr-4">Ready to ride?</span>
                <button 
                  onClick={() => navigate('/rent')}
                  className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </BackgroundImageSection>
      </div>
    </div>
  );
};

export default HomePage;