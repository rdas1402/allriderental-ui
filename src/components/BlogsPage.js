import React from "react";

const BlogsPage = () => {
  const blogs = [
    {
      id: 1,
      title: "The Art of Luxury Travel: Choosing Your Perfect Vehicle",
      excerpt: "Discover how to select the ideal luxury vehicle for different travel occasions and experiences.",
      category: "Luxury Travel",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "Adventure Riding: Essential Tips for Motorcycle Tours",
      excerpt: "Expert advice on planning and executing the perfect motorcycle adventure trip.",
      category: "Adventure",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: 3,
      title: "Sustainable Luxury: The Future of Premium Mobility",
      excerpt: "Exploring how luxury vehicle rentals are embracing sustainability without compromising on experience.",
      category: "Sustainability",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1563720223485-8d84e6af6c7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Lighter Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-slate-800 mb-6">
            Premium <span className="font-semibold text-gold-500">Insights</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Expert advice, travel stories, and luxury mobility insights from our team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-8px] group">
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
                  <span className="text-slate-600 text-sm">{blog.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-gold-500 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <button className="text-gold-500 font-semibold flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  Read More <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-12 border border-blue-200 shadow-lg text-center mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">Stay Updated</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive travel tips, luxury insights, and special offers
          </p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 p-4 bg-white border border-blue-300 rounded-l-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-800 placeholder-slate-500"
            />
            <button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-4 rounded-r-xl font-semibold transition-all duration-300 hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;