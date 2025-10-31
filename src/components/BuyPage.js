import React from "react";

const BuyPage = () => {
  const vehiclesForSale = [
    {
      id: 1,
      type: "Car",
      name: "Mercedes-Benz S-Class",
      year: 2022,
      price: "₹85,00,000",
      mileage: "15,000 km",
      fuel: "Petrol",
      location: "Bangalore",
      features: ["Luxury Sedan", "Premium Package", "Panoramic Roof", "Massage Seats"],
      image: "https://images.unsplash.com/photo-1563720223485-8d84e6af6c7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      type: "Car",
      name: "BMW 7 Series",
      year: 2021,
      price: "₹78,00,000",
      mileage: "20,000 km",
      fuel: "Diesel",
      location: "Delhi",
      features: ["Executive Sedan", "M Sport Package", "Laser Lights", "Bowers & Wilkins"],
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      type: "Bike",
      name: "Ducati Panigale V4",
      year: 2023,
      price: "₹28,00,000",
      mileage: "2,000 km",
      fuel: "Petrol",
      location: "Mumbai",
      features: ["Superbike", "1103cc", "Race ABS", "Quick Shifter"],
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-white mb-6">
            Premium <span className="font-semibold text-gold-400">Vehicle Sales</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Own a piece of luxury from our meticulously maintained premium fleet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehiclesForSale.map((vehicle) => (
            <div key={vehicle.id} className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] group">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${vehicle.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    vehicle.type === "Car" 
                      ? "bg-blue-500/90 text-white" 
                      : "bg-green-500/90 text-white"
                  }`}>
                    {vehicle.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-300 transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-white/60">Year: {vehicle.year}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-white/60 mb-4">
                  <div>💰 {vehicle.price}</div>
                  <div>🛣️ {vehicle.mileage}</div>
                  <div>⛽ {vehicle.fuel}</div>
                  <div>📍 {vehicle.location}</div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Premium Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs border border-white/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gold-500 hover:bg-gold-600 text-slate-900 py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    View Details
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-white/20">
                    Schedule Test Drive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 shadow-2xl text-center mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-4">Interested in Premium Ownership?</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Contact our luxury vehicle specialists for personalized consultation and exclusive offers
          </p>
          <button className="bg-gold-500 hover:bg-gold-600 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
            Contact Sales Executive
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;