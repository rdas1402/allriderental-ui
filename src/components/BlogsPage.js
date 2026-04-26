import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import allRideRentalImage from "../assets/AllRideRental.jpg";
import majuliIslandImage from "../assets/majuli_island.jpg";
import dzuko_ValleyImage from "../assets/Dzüko_Valley.avif";
import meghalayaImage from "../assets/Double-Decker-Living-Root-B.jpg";
import hornbillFestivalImage from "../assets/hornbill-festival.webp";
import dawkiImage from "../assets/dawki.jpg";
import nathulaPassImage from "../assets/nathula_pass.jpg";

const BlogsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [navigate]);

  const blogs = [
    {
      id: 1,
      slug: "meghalaya-living-root-bridges-road-trip",
      title: "Exploring Meghalaya's Living Root Bridges: Your Ultimate Road Trip Guide",
      excerpt: "Discover how to navigate Meghalaya's winding roads to reach Cherrapunji's living root bridges and Mawlynnong - Asia's cleanest village. Rent a sturdy SUV from All Ride Rental for the best experience.",
      category: "Road Trips",
      readTime: "8 min read",
      image: meghalayaImage,
      destination: "Meghalaya",
      duration: "5 Days",
      budget: "₹25,000 - ₹35,000"
    },
    {
      id: 2,
      slug: "hornbill-festival-nagaland-vehicle-guide",
      title: "Hornbill Festival Nagaland: The Complete Vehicle Rental Guide",
      excerpt: "Experience Nagaland's vibrant Hornbill Festival in Kohima district. Learn why renting a comfortable car from All Ride Rental is essential for festival hopping between Kisama Heritage Village and local attractions.",
      category: "Cultural Travel",
      readTime: "7 min read",
      image: hornbillFestivalImage,
      destination: "Nagaland",
      duration: "7 Days",
      budget: "₹30,000 - ₹45,000"
    },
    {
      id: 3,
      slug: "dzuko-valley-trek-manipur-nagaland",
      title: "Dzüko Valley Trek: From Imphal to the Valley of Flowers",
      excerpt: "Start your Dzüko Valley adventure from Manipur with a reliable 4x4 from All Ride Rental. Navigate the challenging terrain to reach this floral paradise bordering Nagaland and Manipur.",
      category: "Adventure",
      readTime: "9 min read",
      image: dzuko_ValleyImage,
      destination: "Manipur/Nagaland",
      duration: "4 Days",
      budget: "₹18,000 - ₹25,000"
    },
    {
      id: 4,
      slug: "majuli-island-assam-bike-tour",
      title: "Majuli Island Assam: River Island Exploration by Bike",
      excerpt: "Rent a Royal Enfield from All Ride Rental to explore Majuli - the world's largest river island. Visit satras (Vaishnavite monasteries) and witness traditional mask-making on two wheels.",
      category: "Bike Tours",
      readTime: "6 min read",
      image: majuliIslandImage,
      destination: "Assam",
      duration: "3 Days",
      budget: "₹12,000 - ₹18,000"
    },
    {
      id: 5,
      slug: "shillong-dawki-scenic-drive",
      title: "Shillong to Dawki: The Scenic Drive You Can't Miss",
      excerpt: "Drive from Shillong to Dawki's crystal-clear Umngot River in a premium SUV from All Ride Rental. Tips for border road permits and the best photography stops along this breathtaking route.",
      category: "Luxury Travel",
      readTime: "5 min read",
      image: dawkiImage,
      destination: "Meghalaya",
      duration: "2 Days",
      budget: "₹8,000 - ₹12,000"
    },
    {
      id: 6,
      slug: "northeast-india-circuit-multi-state-roadtrip",
      title: "Northeast India Circuit: Multi-State Road Trip Planning",
      excerpt: "How to plan a 14-day Northeast India circuit covering Assam, Meghalaya, Nagaland, and Manipur using All Ride Rental's flexible pick-up and drop services across multiple cities.",
      category: "Travel Planning",
      readTime: "10 min read",
      image: nathulaPassImage,
      destination: "Multi-State",
      duration: "14 Days",
      budget: "₹65,000 - ₹90,000"
    }
  ];

  const handleCardClick = (blogSlug) => {
    console.log("Navigating to blog:", blogSlug); // Add this for debugging
    navigate(`/blog/${blogSlug}`);
  };

  const handleButtonClick = (e, blogSlug) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Button clicked for blog:", blogSlug);
    navigate(`/blog/${blogSlug}`);
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${allRideRentalImage})`,
            backgroundPosition: "left center",
            filter: "invert(100%)"
          }}
        ></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-light text-slate-800 mb-6">
            Premium <span className="font-semibold text-gold-500">Travel Guides</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Complete itineraries with vehicle rental details, costs, and budget planning for Northeast India
          </p>
          <div className="mt-6 inline-flex flex-wrap justify-center gap-2">
            <span className="bg-gold-500/10 text-gold-600 text-sm px-4 py-1 rounded-full">With Itinerary</span>
            <span className="bg-gold-500/10 text-gold-600 text-sm px-4 py-1 rounded-full">Cost Breakdown</span>
            <span className="bg-gold-500/10 text-gold-600 text-sm px-4 py-1 rounded-full">Vehicle Options</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => handleCardClick(blog.slug)}
              className="bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-8px] group cursor-pointer"
            >
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${blog.image})` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-sm">{blog.readTime}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">🚗 All Ride Rental</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-gold-500 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3 text-sm">
                  {blog.excerpt}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Destination</div>
                    <div className="text-sm font-medium text-slate-700">{blog.destination}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Duration</div>
                    <div className="text-sm font-medium text-slate-700">{blog.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Estimated Budget</div>
                    <div className="text-sm font-medium text-gold-600">{blog.budget}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={(e) => handleButtonClick(e, blog.slug)}
                    className="text-gold-500 font-semibold flex items-center text-sm group-hover:translate-x-2 transition-transform duration-300"
                  >
                    View Complete Itinerary <span className="ml-2">→</span>
                  </button>
                  <span className="text-xs text-slate-500">Includes cost breakdown</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-blue-200 shadow-lg mt-16">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">What You'll Find in Each Itinerary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 hover:bg-gold-50 rounded-xl transition-all hover:shadow-md">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-semibold text-slate-800 mb-2">Vehicle Recommendations</h3>
              <p className="text-slate-600 text-sm">Detailed suggestions for SUV, sedan, or bike rentals based on terrain</p>
            </div>
            <div className="text-center p-6 hover:bg-gold-50 rounded-xl transition-all hover:shadow-md">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-slate-800 mb-2">Cost Breakdown</h3>
              <p className="text-slate-600 text-sm">Rental costs, fuel, accommodation, permits & total budget planning</p>
            </div>
            <div className="text-center p-6 hover:bg-gold-50 rounded-xl transition-all hover:shadow-md">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold text-slate-800 mb-2">Day-by-Day Itinerary</h3>
              <p className="text-slate-600 text-sm">Hourly schedules, routes, stops, and All Ride Rental pickup points</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-12 border border-blue-200 shadow-lg text-center mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Need a Custom Itinerary?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto text-sm">
            Contact us for personalized travel planning with All Ride Rental vehicles
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm"
          >
            Request Custom Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;