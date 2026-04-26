import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import meghalayaImage from "../assets/Double-Decker-Living-Root-B.jpg";
import hornbillFestivalImage from "../assets/hornbill-festival.webp";
import majuliIslandImage from "../assets/majuli_island.jpg";
import dzuko_ValleyImage from "../assets/Dzüko_Valley.avif";
import dawkiImage from "../assets/dawki.jpg";
import nathulaPassImage from "../assets/nathula_pass.jpg";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  // Complete blog data for ALL slugs
  const blogData = {
    "meghalaya-living-root-bridges-road-trip": {
      id: 1,
      title: "Exploring Meghalaya's Living Root Bridges: Your Ultimate Road Trip Guide",
      excerpt: "Complete 5-day itinerary with vehicle rental details and cost breakdown",
      category: "Road Trips",
      readTime: "8 min read",
      image: meghalayaImage,
      destination: "Meghalaya",
      duration: "5 Days 4 Nights",
      budget: "₹25,000 - ₹35,000",
      groupSize: "2-4 People",
      bestSeason: "October to April",
      startPoint: "Guwahati Airport/Railway Station",
      endPoint: "Shillong",
      mapImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      
      itinerary: [
        {
          day: 1,
          title: "Arrival & Vehicle Pickup",
          activities: [
            "Arrive at Guwahati Airport/Railway Station",
            "Pick up rented SUV from All Ride Rental counter (Toyota Innova/Mahindra Scorpio)",
            "Drive to Shillong (100 km, 3 hours)",
            "Check into hotel in Shillong",
            "Evening walk at Ward's Lake"
          ],
          accommodation: "Hotel Pinewood/Similar (₹1,800-₹2,500/night)",
          meals: "Dinner at local restaurant",
          drivingDistance: "100 km",
          vehicleRequired: "SUV (₹2,500/day)",
          highlights: ["Vehicle pickup process", "First drive through hills"],
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 2,
          title: "Shillong to Cherrapunji",
          activities: [
            "Breakfast at hotel",
            "Drive to Cherrapunji (54 km, 2 hours)",
            "Visit Seven Sisters Falls viewpoint",
            "Explore Nohkalikai Falls",
            "Visit Mawsmai Cave",
            "Check into Cherrapunji hotel"
          ],
          accommodation: "Cherrapunji Resort/Similar (₹2,000-₹3,000/night)",
          meals: "All meals included",
          drivingDistance: "108 km round trip",
          vehicleRequired: "SUV with good ground clearance",
          highlights: ["Waterfalls", "Limestone caves", "Cloudy landscapes"],
          image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 3,
          title: "Living Root Bridges Trek",
          activities: [
            "Early breakfast",
            "Drive to Tyrna village (20 km)",
            "Trek to Double Decker Living Root Bridge (3,000 steps round trip)",
            "Picnic lunch near the bridge",
            "Visit local village",
            "Return to Cherrapunji"
          ],
          accommodation: "Cherrapunji Resort",
          meals: "Breakfast and packed lunch",
          drivingDistance: "40 km",
          vehicleRequired: "Same SUV",
          highlights: ["UNESCO site", "Natural wonder", "Cultural interaction"],
          image: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80"
        },
        {
          day: 4,
          title: "Mawlynnong & Dawki",
          activities: [
            "Drive to Mawlynnong - Asia's cleanest village (40 km)",
            "Explore the village and sky view point",
            "Drive to Dawki for Umngot River (30 km)",
            "Boating in crystal clear river",
            "Return to Shillong"
          ],
          accommodation: "Hotel Pinewood, Shillong",
          meals: "Local Khasi cuisine for lunch",
          drivingDistance: "140 km",
          vehicleRequired: "Same SUV",
          highlights: ["Cleanest village", "Crystal clear river", "India-Bangladesh border"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 5,
          title: "Departure",
          activities: [
            "Visit Shillong Peak for sunrise",
            "Explore Police Bazar for souvenirs",
            "Return vehicle to All Ride Rental Shillong office",
            "Depart from Guwahati"
          ],
          accommodation: "N/A",
          meals: "Breakfast only",
          drivingDistance: "100 km to Guwahati",
          vehicleRequired: "SUV return",
          highlights: ["Panoramic views", "Shopping", "Vehicle return process"],
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      costBreakdown: [
        { category: "Vehicle Rental (SUV)", amount: "₹12,500", details: "5 days × ₹2,500/day" },
        { category: "Fuel", amount: "₹4,500", details: "Approx 500 km × ₹9/km" },
        { category: "Driver (Optional)", amount: "₹7,500", details: "₹1,500/day × 5 days" },
        { category: "Accommodation", amount: "₹10,000", details: "4 nights × ₹2,500 avg" },
        { category: "Food & Dining", amount: "₹5,000", details: "₹1,000/day per person" },
        { category: "Permits & Entry Fees", amount: "₹500", details: "Inner Line Permit if required" },
        { category: "Activities", amount: "₹2,000", details: "Entry fees, boating, guides" },
        { category: "Miscellaneous", amount: "₹1,500", details: "Emergency, tips, snacks" }
      ],

      totalCost: "₹25,000 - ₹35,000 per person",

      vehicleOptions: [
        {
          type: "SUV (Recommended)",
          models: ["Toyota Innova", "Mahindra Scorpio", "Toyota Fortuner"],
          price: "₹2,200 - ₹3,500/day",
          features: ["4×4 available", "Spacious", "Good ground clearance", "AC"],
          bestFor: "Mountain roads, group travel",
          image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Compact SUV",
          models: ["Hyundai Creta", "Kia Seltos"],
          price: "₹1,800 - ₹2,500/day",
          features: ["Fuel efficient", "Easy to drive", "Comfortable"],
          bestFor: "Couples, small families",
          image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80"
        },
        {
          type: "Bikes",
          models: ["Royal Enfield Himalayan", "KTM Adventure"],
          price: "₹1,200 - ₹2,000/day",
          features: ["Adventure ready", "Fuel efficient", "Easy parking"],
          bestFor: "Solo travelers, adventure seekers",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      bookingTips: [
        "Book vehicles at least 15 days in advance during peak season",
        "Request a vehicle with GPS and emergency kit",
        "Check insurance coverage details",
        "Verify fuel policy (usually full-to-full)",
        "Ask about multi-city drop-off options"
      ],

      allRideRentalServices: [
        "24/7 Roadside Assistance",
        "Free GPS Navigation",
        "Comprehensive Insurance",
        "Multiple Pickup/Drop Locations",
        "English/Hindi Speaking Drivers (Optional)",
        "Child Seats Available"
      ],

      routeMap: [
        { from: "Guwahati", to: "Shillong", distance: "100 km", time: "3 hours" },
        { from: "Shillong", to: "Cherrapunji", distance: "54 km", time: "2 hours" },
        { from: "Cherrapunji", to: "Tyrna Village", distance: "20 km", time: "1 hour" },
        { from: "Cherrapunji", to: "Mawlynnong", distance: "40 km", time: "1.5 hours" },
        { from: "Mawlynnong", to: "Dawki", distance: "30 km", time: "1 hour" },
        { from: "Dawki", to: "Shillong", distance: "70 km", time: "2.5 hours" }
      ]
    },

    "hornbill-festival-nagaland-vehicle-guide": {
      id: 2,
      title: "Hornbill Festival Nagaland: The Complete Vehicle Rental Guide",
      excerpt: "Experience Nagaland's vibrant Hornbill Festival in Kohima district",
      category: "Cultural Travel",
      readTime: "7 min read",
      image: hornbillFestivalImage,
      destination: "Nagaland",
      duration: "7 Days 6 Nights",
      budget: "₹30,000 - ₹45,000",
      groupSize: "2-6 People",
      bestSeason: "December (1st-10th for Festival)",
      startPoint: "Dimapur Airport",
      endPoint: "Kohima",
      mapImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      
      itinerary: [
        {
          day: 1,
          title: "Arrival & Vehicle Pickup at Dimapur",
          activities: [
            "Arrive at Dimapur Airport",
            "Pick up rented SUV from All Ride Rental counter",
            "Drive to Kohima (74 km, 3 hours)",
            "Check into hotel in Kohima",
            "Evening explore local markets"
          ],
          accommodation: "Hotel Vivor/Similar (₹2,000-₹3,000/night)",
          meals: "Dinner with Naga cuisine",
          drivingDistance: "74 km",
          vehicleRequired: "SUV (₹2,800/day)",
          highlights: ["First taste of Naga culture", "Vehicle pickup process"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 2,
          title: "Kisama Heritage Village - Hornbill Festival Day 1",
          activities: [
            "Breakfast at hotel",
            "Drive to Kisama Heritage Village (12 km)",
            "Morning: Traditional dance performances",
            "Afternoon: Food stalls and craft exhibitions",
            "Evening: Music concert at festival ground",
            "Return to Kohima"
          ],
          accommodation: "Hotel Vivor, Kohima",
          meals: "Breakfast and festival food",
          drivingDistance: "24 km round trip",
          vehicleRequired: "Same SUV",
          highlights: ["Traditional dances", "Naga warrior displays", "Local crafts"],
          image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 3,
          title: "Festival Day 2 & Local Villages",
          activities: [
            "Morning: Hornbill Festival cultural competitions",
            "Afternoon: Visit Khonoma Green Village",
            "Evening: Traditional Naga wrestling",
            "Night: Return to Kohima"
          ],
          accommodation: "Hotel Vivor, Kohima",
          meals: "All meals at festival",
          drivingDistance: "50 km",
          vehicleRequired: "Same SUV",
          highlights: ["Cultural competitions", "Green village tour", "Traditional sports"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 4,
          title: "Kohima War Cemetery & State Museum",
          activities: [
            "Visit Kohima War Cemetery",
            "Explore Nagaland State Museum",
            "Local Naga tribe village visit",
            "Evening shopping at local markets"
          ],
          accommodation: "Hotel Vivor, Kohima",
          meals: "Breakfast and lunch included",
          drivingDistance: "20 km",
          vehicleRequired: "Same SUV",
          highlights: ["Historical sites", "Cultural artifacts", "Local shopping"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 5,
          title: "Festival Final Day & Farewell Dinner",
          activities: [
            "Final day of Hornbill Festival",
            "Prize distribution ceremony",
            "Traditional Naga feast experience",
            "Farewell dinner with cultural performances"
          ],
          accommodation: "Hotel Vivor, Kohima",
          meals: "Traditional Naga feast",
          drivingDistance: "24 km round trip",
          vehicleRequired: "Same SUV",
          highlights: ["Festival finale", "Traditional feast", "Cultural performances"],
          image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 6,
          title: "Optional: Dzüko Valley Day Trip",
          activities: [
            "Optional day trip to Dzüko Valley",
            "Trekking in valley of flowers",
            "Picnic lunch",
            "Return to Kohima"
          ],
          accommodation: "Hotel Vivor, Kohima",
          meals: "Packed lunch",
          drivingDistance: "100 km",
          vehicleRequired: "4x4 recommended",
          highlights: ["Valley trekking", "Floral paradise", "Nature photography"],
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 7,
          title: "Departure",
          activities: [
            "Morning shopping for souvenirs",
            "Return vehicle to All Ride Rental Kohima office",
            "Drive to Dimapur Airport",
            "Departure"
          ],
          accommodation: "N/A",
          meals: "Breakfast only",
          drivingDistance: "74 km",
          vehicleRequired: "SUV return",
          highlights: ["Souvenir shopping", "Vehicle return", "Departure"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      costBreakdown: [
        { category: "Vehicle Rental (SUV)", amount: "₹19,600", details: "7 days × ₹2,800/day" },
        { category: "Fuel", amount: "₹3,000", details: "Approx 300 km" },
        { category: "Driver (Recommended)", amount: "₹12,600", details: "₹1,800/day × 7 days" },
        { category: "Accommodation", amount: "₹18,000", details: "6 nights × ₹3,000 avg" },
        { category: "Food & Dining", amount: "₹8,400", details: "₹1,200/day per person" },
        { category: "Festival Pass", amount: "₹1,500", details: "7-day festival pass" },
        { category: "Permits", amount: "₹1,000", details: "Inner Line Permit required" },
        { category: "Activities", amount: "₹3,000", details: "Cultural shows, village visits" }
      ],

      totalCost: "₹30,000 - ₹45,000 per person",

      vehicleOptions: [
        {
          type: "SUV (Recommended)",
          models: ["Toyota Innova", "Mahindra XUV700", "Toyota Fortuner"],
          price: "₹2,800 - ₹4,000/day",
          features: ["Comfort for long waits", "Space for groups", "AC"],
          bestFor: "Festival travel, group touring",
          image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Compact Car",
          models: ["Maruti Suzuki Swift", "Hyundai i20"],
          price: "₹1,800 - ₹2,500/day",
          features: ["Easy parking", "Fuel efficient", "Maneuverable"],
          bestFor: "Couples, solo travelers",
          image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80"
        },
        {
          type: "Tempo Traveler",
          models: ["Force Traveller", "Mahindra Supro"],
          price: "₹4,500 - ₹6,000/day",
          features: ["Large group capacity", "Comfortable seating", "Luggage space"],
          bestFor: "Large groups, families",
          image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80"
        }
      ],

      bookingTips: [
        "Book vehicles 2-3 months in advance for Hornbill Festival period",
        "Request a driver familiar with Naga traditions",
        "Ensure vehicle has good heating for December cold",
        "Carry cash for festival entry and local purchases",
        "Book accommodation early as hotels fill quickly"
      ],

      allRideRentalServices: [
        "24/7 Roadside Assistance",
        "Local Driver-Guides Available",
        "Festival Pass Assistance",
        "Permit Processing Help",
        "Multiple Language Support",
        "Hotel Booking Assistance"
      ],

      routeMap: [
        { from: "Dimapur Airport", to: "Kohima", distance: "74 km", time: "3 hours" },
        { from: "Kohima", to: "Kisama Heritage Village", distance: "12 km", time: "30 mins" },
        { from: "Kohima", to: "Khonoma Village", distance: "20 km", time: "1 hour" },
        { from: "Kohima", to: "Dzüko Valley", distance: "50 km", time: "2 hours + trek" },
        { from: "Kohima", to: "Dimapur Airport", distance: "74 km", time: "3 hours" }
      ]
    },

    "dzuko-valley-trek-manipur-nagaland": {
      id: 3,
      title: "Dzüko Valley Trek: From Imphal to the Valley of Flowers",
      excerpt: "Adventure trek to Dzüko Valley with All Ride Rental 4x4 vehicles",
      category: "Adventure",
      readTime: "9 min read",
      image: dzuko_ValleyImage,
      destination: "Manipur/Nagaland",
      duration: "4 Days 3 Nights",
      budget: "₹18,000 - ₹25,000",
      groupSize: "4-8 People",
      bestSeason: "May to September (for flowers)",
      startPoint: "Imphal Airport",
      endPoint: "Kohima",
      mapImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      
      itinerary: [
        {
          day: 1,
          title: "Arrival in Imphal & Vehicle Pickup",
          activities: [
            "Arrive at Imphal Airport",
            "Pick up 4x4 vehicle from All Ride Rental",
            "Drive to Senapati (60 km, 2 hours)",
            "Check into hotel and rest",
            "Evening briefing about trek"
          ],
          accommodation: "Hotel in Senapati (₹1,500-₹2,000/night)",
          meals: "Dinner included",
          drivingDistance: "60 km",
          vehicleRequired: "4x4 SUV (₹3,500/day)",
          highlights: ["Vehicle pickup", "First views of hills", "Trek briefing"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 2,
          title: "Drive to Trek Start Point & Trek to Dzüko Valley",
          activities: [
            "Early breakfast",
            "Drive to trek starting point (40 km, 2 hours)",
            "Start trek to Dzüko Valley (5-6 hours trek)",
            "Set up camp in valley",
            "Evening bonfire"
          ],
          accommodation: "Camping in Dzüko Valley",
          meals: "All meals included",
          drivingDistance: "40 km",
          vehicleRequired: "4x4 for rough terrain",
          highlights: ["Scenic drive", "Trekking adventure", "Valley camping"],
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 3,
          title: "Explore Dzüko Valley & Return Trek",
          activities: [
            "Sunrise photography",
            "Explore valley flowers and streams",
            "Picnic lunch",
            "Trek back to starting point",
            "Drive to Kohima"
          ],
          accommodation: "Hotel in Kohima (₹2,000-₹3,000/night)",
          meals: "All meals included",
          drivingDistance: "80 km",
          vehicleRequired: "Same 4x4",
          highlights: ["Valley exploration", "Flower photography", "Return trek"],
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 4,
          title: "Departure",
          activities: [
            "Morning at leisure in Kohima",
            "Visit local market",
            "Return vehicle to All Ride Rental",
            "Depart from Kohima/Dimapur"
          ],
          accommodation: "N/A",
          meals: "Breakfast only",
          drivingDistance: "As per departure",
          vehicleRequired: "Vehicle return",
          highlights: ["Local shopping", "Vehicle return", "Departure"],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      costBreakdown: [
        { category: "4x4 Vehicle Rental", amount: "₹14,000", details: "4 days × ₹3,500/day" },
        { category: "Fuel", amount: "₹3,000", details: "Approx 200 km rough terrain" },
        { category: "Trek Guide & Porter", amount: "₹6,000", details: "For group of 4-8" },
        { category: "Accommodation", amount: "₹6,000", details: "3 nights accommodation" },
        { category: "Food & Camping", amount: "₹4,000", details: "All meals and camping gear" },
        { category: "Permits", amount: "₹1,000", details: "Required permits for trek" },
        { category: "Equipment Rental", amount: "₹2,000", details: "Trekking poles, sleeping bags" }
      ],

      totalCost: "₹18,000 - ₹25,000 per person",

      vehicleOptions: [
        {
          type: "4x4 SUV (Essential)",
          models: ["Mahindra Thar", "Toyota Fortuner 4x4", "Isuzu V-Cross"],
          price: "₹3,500 - ₹5,000/day",
          features: ["4WD capability", "High ground clearance", "Off-road tires", "Winch"],
          bestFor: "Mountain and rough terrain",
          image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Adventure Bike",
          models: ["Royal Enfield Himalayan", "KTM 390 Adventure"],
          price: "₹1,500 - ₹2,500/day",
          features: ["Off-road capable", "Lightweight", "Easy on rough roads"],
          bestFor: "Solo adventurers, experienced riders",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      bookingTips: [
        "Book 4x4 vehicles at least 1 month in advance",
        "Ensure vehicle has proper off-road equipment",
        "Hire local guide familiar with Dzüko Valley",
        "Check weather conditions before booking",
        "Pack appropriate trekking gear"
      ],

      allRideRentalServices: [
        "4x4 Vehicle Rentals",
        "Trek Guide Arrangements",
        "Camping Equipment Rental",
        "Permit Processing",
        "24/7 Emergency Support",
        "Route Planning Assistance"
      ],

      routeMap: [
        { from: "Imphal Airport", to: "Senapati", distance: "60 km", time: "2 hours" },
        { from: "Senapati", to: "Trek Start Point", distance: "40 km", time: "2 hours" },
        { from: "Trek Start", to: "Dzüko Valley", distance: "12 km", time: "5-6 hours trek" },
        { from: "Trek End", to: "Kohima", distance: "80 km", time: "3-4 hours" }
      ]
    },

    "majuli-island-assam-bike-tour": {
      id: 4,
      title: "Majuli Island Assam: River Island Exploration by Bike",
      excerpt: "Bike tour of Majuli Island with Royal Enfield rentals",
      category: "Bike Tours",
      readTime: "6 min read",
      image: majuliIslandImage,
      destination: "Assam",
      duration: "3 Days 2 Nights",
      budget: "₹12,000 - ₹18,000",
      groupSize: "1-2 People",
      bestSeason: "October to March",
      startPoint: "Jorhat Town",
      endPoint: "Majuli Island",
      mapImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      
      itinerary: [
        {
          day: 1,
          title: "Arrival & Bike Pickup in Jorhat",
          activities: [
            "Arrive at Jorhat Railway Station/Airport",
            "Pick up Royal Enfield from All Ride Rental",
            "Ride to Nimati Ghat (15 km)",
            "Ferry crossing to Majuli Island",
            "Check into eco-cottage",
            "Evening cycle around local village"
          ],
          accommodation: "Eco-cottage in Majuli (₹1,500-₹2,500/night)",
          meals: "Dinner with Assamese cuisine",
          ridingDistance: "15 km + ferry",
          vehicleRequired: "Royal Enfield (₹1,200/day)",
          highlights: ["Bike pickup", "Ferry experience", "Island arrival"],
          image: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 2,
          title: "Majuli Island Bike Exploration",
          activities: [
            "Sunrise ride to riverbank",
            "Visit Satras (Vaishnavite monasteries)",
            "Explore traditional mask-making centers",
            "Lunch at local Mishing tribe village",
            "Evening cultural performance",
            "Night ride under stars"
          ],
          accommodation: "Eco-cottage in Majuli",
          meals: "All meals included",
          ridingDistance: "60 km around island",
          vehicleRequired: "Same bike",
          highlights: ["Monastery visits", "Cultural immersion", "Night riding"],
          image: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 3,
          title: "Departure",
          activities: [
            "Morning bird watching",
            "Visit pottery village",
            "Ferry back to mainland",
            "Return bike to All Ride Rental Jorhat",
            "Departure"
          ],
          accommodation: "N/A",
          meals: "Breakfast only",
          ridingDistance: "15 km + ferry",
          vehicleRequired: "Bike return",
          highlights: ["Bird watching", "Pottery village", "Ferry return"],
          image: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      costBreakdown: [
        { category: "Bike Rental (Royal Enfield)", amount: "₹3,600", details: "3 days × ₹1,200/day" },
        { category: "Fuel", amount: "₹1,000", details: "Approx 100 km riding" },
        { category: "Ferry Charges", amount: "₹500", details: "Round trip for bike and rider" },
        { category: "Accommodation", amount: "₹4,000", details: "2 nights eco-cottage" },
        { category: "Food & Dining", amount: "₹3,000", details: "All meals included" },
        { category: "Guide Services", amount: "₹2,000", details: "Local guide for 2 days" },
        { category: "Cultural Experiences", amount: "₹1,500", details: "Performances, workshops" }
      ],

      totalCost: "₹12,000 - ₹18,000 per person",

      vehicleOptions: [
        {
          type: "Royal Enfield Classic",
          models: ["Classic 350", "Bullet 350"],
          price: "₹1,200 - ₹1,800/day",
          features: ["Iconic design", "Comfortable for long rides", "Reliable"],
          bestFor: "Heritage experience, photography",
          image: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Adventure Bike",
          models: ["Royal Enfield Himalayan", "KTM Adventure"],
          price: "₹1,500 - ₹2,200/day",
          features: ["Better suspension", "Off-road capability", "Comfortable"],
          bestFor: "Rough roads, adventure seekers",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Scooter",
          models: ["Honda Activa", "TVS Jupiter"],
          price: "₹600 - ₹900/day",
          features: ["Easy to ride", "Fuel efficient", "Automatic"],
          bestFor: "Beginners, short distances",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      bookingTips: [
        "Book bikes 2 weeks in advance",
        "Check ferry timings for bike transport",
        "Pack light for bike travel",
        "Carry rain gear (especially in monsoon)",
        "Learn basic Assamese phrases"
      ],

      allRideRentalServices: [
        "Bike Rentals with Helmet",
        "Ferry Ticket Assistance",
        "Local Guide Arrangements",
        "Accommodation Booking",
        "24/7 Mechanic Support",
        "Route Maps and Navigation"
      ],

      routeMap: [
        { from: "Jorhat", to: "Nimati Ghat", distance: "15 km", time: "30 mins" },
        { from: "Nimati Ghat", to: "Majuli Ferry", distance: "Crossing", time: "1 hour" },
        { from: "Majuli Ferry Point", to: "Kamalabari", distance: "5 km", time: "15 mins" },
        { from: "Kamalabari", to: "Garamur", distance: "15 km", time: "30 mins" },
        { from: "Garamur", to: "Auniati Satra", distance: "10 km", time: "20 mins" }
      ]
    },

    "shillong-dawki-scenic-drive": {
      id: 5,
      title: "Shillong to Dawki: The Scenic Drive You Can't Miss",
      excerpt: "Scenic drive through Meghalaya's beautiful landscapes",
      category: "Luxury Travel",
      readTime: "5 min read",
      image: dawkiImage,
      destination: "Meghalaya",
      duration: "2 Days 1 Night",
      budget: "₹8,000 - ₹12,000",
      groupSize: "2-4 People",
      bestSeason: "Year-round (avoid monsoon)",
      startPoint: "Shillong",
      endPoint: "Dawki",
      mapImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      
      itinerary: [
        {
          day: 1,
          title: "Shillong to Dawki Scenic Drive",
          activities: [
            "Pick up luxury SUV from All Ride Rental Shillong",
            "Drive through lush green hills",
            "Photo stop at Umshiang Double-Decker Bridge",
            "Lunch at local dhaba with view",
            "Arrive at Dawki",
            "Boating in crystal clear Umngot River",
            "Sunset photography at border point"
          ],
          accommodation: "Riverside camp/resort (₹3,000-₹4,000/night)",
          meals: "Lunch and dinner included",
          drivingDistance: "85 km",
          vehicleRequired: "Luxury SUV (₹3,500/day)",
          highlights: ["Scenic drive", "Crystal river boating", "Border sunset"],
          image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          day: 2,
          title: "Dawki Exploration & Return",
          activities: [
            "Morning walk along riverbank",
            "Visit local markets",
            "Optional zip-lining experience",
            "Drive back to Shillong via different route",
            "Stop at waterfalls en route",
            "Return vehicle in Shillong"
          ],
          accommodation: "N/A",
          meals: "Breakfast and lunch included",
          drivingDistance: "95 km",
          vehicleRequired: "Same luxury SUV",
          highlights: ["River activities", "Market visit", "Waterfall stops"],
          image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      costBreakdown: [
        { category: "Luxury SUV Rental", amount: "₹7,000", details: "2 days × ₹3,500/day" },
        { category: "Fuel", amount: "₹2,000", details: "Approx 180 km" },
        { category: "Accommodation", amount: "₹3,500", details: "1 night riverside stay" },
        { category: "Food & Dining", amount: "₹2,500", details: "All meals included" },
        { category: "Activities", amount: "₹3,000", details: "Boating, zip-lining, entry fees" },
        { category: "Driver (Optional)", amount: "₹3,000", details: "₹1,500/day × 2 days" }
      ],

      totalCost: "₹8,000 - ₹12,000 per person",

      vehicleOptions: [
        {
          type: "Luxury SUV",
          models: ["Toyota Fortuner", "Mercedes GLC", "BMW X3"],
          price: "₹3,500 - ₹6,000/day",
          features: ["Premium interior", "Panoramic sunroof", "Advanced safety", "Entertainment system"],
          bestFor: "Comfortable scenic drives",
          image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Convertible",
          models: ["Mercedes C-Class Cabriolet", "BMW Z4"],
          price: "₹5,000 - ₹8,000/day",
          features: ["Open-top driving", "Sporty experience", "Premium sound system"],
          bestFor: "Ultimate scenic experience",
          image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
      ],

      bookingTips: [
        "Book luxury vehicles 1 month in advance",
        "Request vehicles with panoramic roofs",
        "Check border permit requirements",
        "Pack camera gear for photography",
        "Book boating in advance during peak season"
      ],

      allRideRentalServices: [
        "Premium Vehicle Fleet",
        "Professional Chauffeurs",
        "Border Permit Assistance",
        "Activity Bookings",
        "Luxury Accommodation Arrangements",
        "Photography Guide Services"
      ],

      routeMap: [
        { from: "Shillong", to: "Umshiang Bridge", distance: "30 km", time: "1 hour" },
        { from: "Umshiang Bridge", to: "Dawki", distance: "55 km", time: "1.5 hours" },
        { from: "Dawki", to: "India-Bangladesh Border", distance: "2 km", time: "10 mins" },
        { from: "Dawki", to: "Shillong (return)", distance: "95 km", time: "2.5 hours" }
      ]
    },

    "northeast-india-circuit-multi-state-roadtrip": {
      id: 6,
      title: "Northeast India Circuit: Multi-State Road Trip Planning",
      excerpt: "Multi-state adventure through Northeast India",
      category: "Travel Planning",
      readTime: "10 min read",
      image: nathulaPassImage,
      destination: "Multi-State",
      duration: "14 Days 13 Nights",
      budget: "₹65,000 - ₹90,000",
      groupSize: "4-6 People",
      bestSeason: "October to April",
      startPoint: "Guwahati",
      endPoint: "Imphal",
      mapImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      
      itinerary: [
        {
          day: 1,
          title: "Guwahati Arrival & Vehicle Pickup",
          activities: [
            "Arrive at Guwahati Airport",
            "Pick up premium SUV from All Ride Rental",
            "Visit Kamakhya Temple",
            "Evening cruise on Brahmaputra River",
            "Check into hotel"
          ],
          accommodation: "Hotel in Guwahati (₹3,000-₹4,000/night)",
          meals: "Welcome dinner",
          drivingDistance: "50 km",
          vehicleRequired: "Premium SUV (₹4,000/day)",
          highlights: ["Temple visit", "River cruise", "Vehicle pickup"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 2,
          title: "Guwahati to Kaziranga",
          activities: [
            "Early breakfast",
            "Drive to Kaziranga National Park (200 km)",
            "Check into jungle resort",
            "Evening elephant safari"
          ],
          accommodation: "Jungle resort (₹4,000-₹5,000/night)",
          meals: "All meals included",
          drivingDistance: "200 km",
          vehicleRequired: "Same SUV",
          highlights: ["Scenic drive", "Jungle resort", "Elephant safari"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 3,
          title: "Kaziranga Jeep Safari",
          activities: [
            "Morning jeep safari in national park",
            "Rhino spotting",
            "Afternoon visit to tea gardens",
            "Cultural evening with local tribes"
          ],
          accommodation: "Jungle resort",
          meals: "All meals included",
          drivingDistance: "40 km in park",
          vehicleRequired: "Park jeep arranged",
          highlights: ["Rhino sighting", "Tea gardens", "Cultural show"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 4,
          title: "Kaziranga to Shillong",
          activities: [
            "Drive to Shillong (150 km)",
            "Stop at Umiam Lake",
            "Check into Shillong hotel",
            "Evening at Police Bazar"
          ],
          accommodation: "Hotel in Shillong (₹2,500-₹3,500/night)",
          meals: "Lunch and dinner included",
          drivingDistance: "150 km",
          vehicleRequired: "Same SUV",
          highlights: ["Umiam Lake", "Hill station arrival", "Local market"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 5,
          title: "Shillong Exploration",
          activities: [
            "Visit Elephant Falls",
            "Explore Shillong Peak",
            "Lunch at local cafe",
            "Visit Don Bosco Museum",
            "Free evening"
          ],
          accommodation: "Hotel in Shillong",
          meals: "Breakfast and lunch included",
          drivingDistance: "40 km",
          vehicleRequired: "Same SUV",
          highlights: ["Waterfalls", "Panoramic views", "Museum visit"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 6,
          title: "Shillong to Cherrapunji",
          activities: [
            "Drive to Cherrapunji (54 km)",
            "Visit Nohkalikai Falls",
            "Explore Mawsmai Caves",
            "Check into resort"
          ],
          accommodation: "Resort in Cherrapunji (₹3,000-₹4,000/night)",
          meals: "All meals included",
          drivingDistance: "54 km",
          vehicleRequired: "Same SUV",
          highlights: ["World's wettest place", "Waterfalls", "Caves"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 7,
          title: "Living Root Bridges & Return to Shillong",
          activities: [
            "Trek to Living Root Bridges",
            "Picnic lunch",
            "Drive back to Shillong",
            "Free evening"
          ],
          accommodation: "Hotel in Shillong",
          meals: "Breakfast and picnic lunch",
          drivingDistance: "108 km",
          vehicleRequired: "Same SUV",
          highlights: ["UNESCO site", "Natural wonder", "Trekking"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 8,
          title: "Shillong to Kohima",
          activities: [
            "Long drive to Kohima (150 km)",
            "Cross state border",
            "Check into Kohima hotel",
            "Evening rest"
          ],
          accommodation: "Hotel in Kohima (₹2,500-₹3,500/night)",
          meals: "Lunch and dinner included",
          drivingDistance: "150 km",
          vehicleRequired: "Same SUV",
          highlights: ["State crossing", "Mountain roads", "Nagaland arrival"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 9,
          title: "Kohima Exploration",
          activities: [
            "Visit Kohima War Cemetery",
            "Explore State Museum",
            "Visit local Naga village",
            "Traditional Naga dinner"
          ],
          accommodation: "Hotel in Kohima",
          meals: "All meals included",
          drivingDistance: "30 km",
          vehicleRequired: "Same SUV",
          highlights: ["Historical sites", "Cultural immersion", "Naga cuisine"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 10,
          title: "Kohima to Imphal",
          activities: [
            "Drive to Imphal (140 km)",
            "Cross Manipur border",
            "Check into Imphal hotel",
            "Visit Kangla Fort"
          ],
          accommodation: "Hotel in Imphal (₹2,500-₹3,500/night)",
          meals: "Lunch and dinner included",
          drivingDistance: "140 km",
          vehicleRequired: "Same SUV",
          highlights: ["Manipur arrival", "Historical fort", "Border crossing"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 11,
          title: "Imphal Sightseeing",
          activities: [
            "Visit Loktak Lake",
            "See floating phumdis",
            "Visit INA Museum",
            "Evening at market"
          ],
          accommodation: "Hotel in Imphal",
          meals: "All meals included",
          drivingDistance: "60 km",
          vehicleRequired: "Same SUV",
          highlights: ["Floating islands", "Historical museum", "Local market"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 12,
          title: "Imphal to Moreh Border",
          activities: [
            "Drive to India-Myanmar border (110 km)",
            "Visit border market",
            "Return to Imphal",
            "Farewell dinner"
          ],
          accommodation: "Hotel in Imphal",
          meals: "All meals included",
          drivingDistance: "220 km round trip",
          vehicleRequired: "Same SUV",
          highlights: ["International border", "Border market", "Farewell"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 13,
          title: "Free Day in Imphal",
          activities: [
            "Optional activities",
            "Shopping for souvenirs",
            "Spa and relaxation",
            "Cultural show"
          ],
          accommodation: "Hotel in Imphal",
          meals: "Breakfast included",
          drivingDistance: "Optional",
          vehicleRequired: "Available if needed",
          highlights: ["Relaxation", "Shopping", "Cultural experience"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        },
        {
          day: 14,
          title: "Departure",
          activities: [
            "Last minute shopping",
            "Return vehicle to All Ride Rental Imphal",
            "Transfer to Imphal Airport",
            "Departure"
          ],
          accommodation: "N/A",
          meals: "Breakfast only",
          drivingDistance: "To airport",
          vehicleRequired: "Vehicle return",
          highlights: ["Final shopping", "Vehicle return", "Departure"],
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
        }
      ],

      costBreakdown: [
        { category: "Premium SUV Rental", amount: "₹56,000", details: "14 days × ₹4,000/day" },
        { category: "Fuel", amount: "₹15,000", details: "Approx 1,200 km journey" },
        { category: "Driver (Recommended)", amount: "₹21,000", details: "₹1,500/day × 14 days" },
        { category: "Accommodation", amount: "₹45,000", details: "13 nights × ₹3,500 avg" },
        { category: "Food & Dining", amount: "₹25,000", details: "All meals included" },
        { category: "Activities & Entry Fees", amount: "₹15,000", details: "Safaris, guides, permits" },
        { category: "Multi-State Permits", amount: "₹5,000", details: "All required permits" }
      ],

      totalCost: "₹65,000 - ₹90,000 per person",

      vehicleOptions: [
        {
          type: "Premium SUV",
          models: ["Toyota Fortuner", "Ford Endeavour", "Mahindra Alturas G4"],
          price: "₹4,000 - ₹6,000/day",
          features: ["Spacious comfort", "Luggage capacity", "AC throughout", "Entertainment"],
          bestFor: "Long multi-state journeys",
          image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
          type: "Luxury Minivan",
          models: ["Toyota Innova Crysta", "Mercedes V-Class"],
          price: "₹4,500 - ₹7,000/day",
          features: ["Extra space", "Captain seats", "Privacy partitions", "Entertainment"],
          bestFor: "Family groups, maximum comfort",
          image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80"
        }
      ],

      bookingTips: [
        "Book 2-3 months in advance for peak season",
        "Arrange all state permits in advance",
        "Hire experienced driver for mountain roads",
        "Pack for varying climates",
        "Carry multiple payment methods"
      ],

      allRideRentalServices: [
        "Multi-City Pickup/Drop",
        "All Permit Processing",
        "Multi-Lingual Drivers",
        "Hotel Booking Assistance",
        "24/7 Support Across States",
        "Emergency Medical Assistance"
      ],

      routeMap: [
        { from: "Guwahati", to: "Kaziranga", distance: "200 km", time: "5 hours" },
        { from: "Kaziranga", to: "Shillong", distance: "150 km", time: "4 hours" },
        { from: "Shillong", to: "Cherrapunji", distance: "54 km", time: "2 hours" },
        { from: "Shillong", to: "Kohima", distance: "150 km", time: "4 hours" },
        { from: "Kohima", to: "Imphal", distance: "140 km", time: "4 hours" },
        { from: "Imphal", to: "Moreh Border", distance: "110 km", time: "3 hours" }
      ]
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const selectedBlog = blogData[slug];
    if (selectedBlog) {
      setBlog(selectedBlog);
    } else {
      navigate('/blogs');
    }
  }, [slug, navigate]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading detailed itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center text-gold-600 hover:text-gold-700 mb-6 md:mb-8 transition-colors text-sm md:text-base"
        >
          ← Back to All Itineraries
        </button>

        {/* Hero Section with Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="h-64 md:h-96 relative">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-gold-500 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full">
                  {blog.category}
                </span>
                <span className="text-white/90 text-xs md:text-sm">📖 {blog.readTime}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{blog.title}</h1>
              <p className="text-white/90 text-sm md:text-base">{blog.excerpt}</p>
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-slate-500 text-xs md:text-sm mb-1">Destination</div>
            <div className="text-lg md:text-xl font-bold text-slate-800">{blog.destination}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-slate-500 text-xs md:text-sm mb-1">Duration</div>
            <div className="text-lg md:text-xl font-bold text-slate-800">{blog.duration}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-slate-500 text-xs md:text-sm mb-1">Group Size</div>
            <div className="text-lg md:text-xl font-bold text-slate-800">{blog.groupSize}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-slate-500 text-xs md:text-sm mb-1">Budget</div>
            <div className="text-lg md:text-xl font-bold text-gold-600">{blog.budget}</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary */}
          <div className="lg:col-span-2">
            {/* Detailed Itinerary with Images */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-gold-500">📅</span>
                Day-by-Day Itinerary
              </h2>
              
              <div className="space-y-8">
                {blog.itinerary.map((day, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl overflow-hidden hover:border-gold-300 transition-colors">
                    <div className="flex flex-col md:flex-row">
                      {/* Day Image */}
                      <div className="md:w-1/3">
                        <img 
                          src={day.image || blog.image} 
                          alt={`Day ${day.day} - ${day.title}`}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      
                      {/* Day Content */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-gold-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              Day {day.day}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">{day.title}</h3>
                          </div>
                          <div className="text-sm text-slate-600">
                            🚗 {day.drivingDistance}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-700 mb-2">Activities:</h4>
                          <ul className="space-y-2">
                            {day.activities.map((activity, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-600">
                                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2"></div>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Accommodation</h4>
                            <p className="text-slate-600 text-sm">{day.accommodation}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-1">Meals</h4>
                            <p className="text-slate-600 text-sm">{day.meals}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold text-slate-700 mb-2">All Ride Rental Vehicle</h4>
                          <div className="bg-gold-50 p-3 rounded-lg">
                            <p className="text-slate-700 font-medium">{day.vehicleRequired}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Cost Breakdown</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gold-50">
                      <th className="text-left p-4 font-semibold text-slate-700">Category</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Amount</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blog.costBreakdown.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-slate-700">{item.category}</td>
                        <td className="p-4 font-semibold text-slate-800">{item.amount}</td>
                        <td className="p-4 text-slate-600 text-sm">{item.details}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gold-50">
                      <td className="p-4 font-bold text-slate-800">Total Estimated Cost</td>
                      <td colSpan="2" className="p-4 font-bold text-gold-600 text-lg">
                        {blog.totalCost}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Route Map Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Route Details</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left p-4 font-semibold text-slate-700">From</th>
                      <th className="text-left p-4 font-semibold text-slate-700">To</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Distance</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Approx Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blog.routeMap.map((route, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-slate-700">{route.from}</td>
                        <td className="p-4 text-slate-700">{route.to}</td>
                        <td className="p-4 text-slate-600">{route.distance}</td>
                        <td className="p-4 text-slate-600">{route.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle Options & Services */}
          <div>
            {/* Vehicle Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Vehicle Options</h2>
              
              <div className="space-y-6">
                {blog.vehicleOptions.map((vehicle, index) => (
                  <div 
                    key={index}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedVehicle === index ? 'border-gold-500 bg-gold-50' : 'border-slate-200 hover:border-gold-300'}`}
                    onClick={() => setSelectedVehicle(index)}
                  >
                    <div className="mb-3">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.type}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800">{vehicle.type}</h3>
                      <div className="bg-gold-500 text-white text-xs px-2 py-1 rounded">
                        {vehicle.price}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-xs text-slate-500 mb-1">Models</div>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.models.map((model, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-xs text-slate-500 mb-1">Features</div>
                      <ul className="space-y-1">
                        {vehicle.features.map((feature, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-xs text-slate-700">
                      <span className="font-medium">Best for:</span> {vehicle.bestFor}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Ride Rental Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">All Ride Rental Services</h2>
              
              <div className="space-y-3">
                {blog.allRideRentalServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 hover:bg-gold-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
                      <span className="text-gold-600">✓</span>
                    </div>
                    <span className="text-slate-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Booking Tips</h2>
              
              <div className="space-y-4">
                {blog.bookingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-slate-600 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Book This Itinerary</h3>
                <p className="text-sm mb-4">Get your All Ride Rental vehicle for this amazing journey</p>
                
                <button 
                  onClick={() => navigate('/contact')}
                  className="w-full bg-white text-gold-600 hover:bg-slate-100 py-3 rounded-lg font-semibold transition-colors"
                >
                  Book Now
                </button>
                
                <div className="mt-4 text-xs text-white/90">
                  <p>📞 +91-9876543210</p>
                  <p>📧 support@allriderental.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;