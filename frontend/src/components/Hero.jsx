import React from "react";
import { Pizza, Clock, Truck, Star } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen sm:pt-2 md:pt-2 bg-gradient-to-b from-[#1a0f0a] via-[#2b1a12] to-[#0d0d0d] 
             text-center text-white flex items-start justify-center px-6 overflow-hidden"
    >

      {/* Background overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_50%)]" />

      {/* Floating food emojis */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl opacity-30 animate-bounce" style={{ animationDuration: "3s" }}>🍕</div>
        <div className="absolute top-40 right-20 text-3xl opacity-25 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>🍟</div>
        <div className="absolute bottom-32 left-1/4 text-3xl opacity-20 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>🥤</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-25 animate-bounce" style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}>🍕</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-20 animate-bounce" style={{ animationDuration: "3.2s", animationDelay: "0.8s" }}>🍟</div>
      </div>

      <div className="relative max-w-4xl mx-auto pt-32 md:pt-24">
        {/* Title */}
        <h1 className="text-5xl drop-shadow-[0_2px_6px_rgba(255,165,0,0.9)] md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6 leading-tight">
          SliceHub
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-4xl font-semibold text-yellow-400 mb-4">
          Order Premium Pizza Online
        </h2>

        {/* Tagline */}
        <p className="text-xl md:text-2xl font-bold text-yellow-300 mb-8 flex items-center justify-center gap-2 flex-wrap">
          <Pizza className="text-red-500 w-6 h-6" />
          Hot, Fresh & Delivered Fast
          <Pizza className="text-red-500 w-6 h-6" />
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
          Choose from our diverse menu of wood-fired pizzas, handcrafted pastas, and appetizers.
          Order online and get your delicious meal delivered right to your doorstep in minutes.
          Experience authentic Italian flavors with a modern twist.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium hover:bg-gray-700/80 transition-colors">
            <Clock className="w-4 h-4" /> 30 Min Delivery
          </span>
          <span className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium hover:bg-gray-700/80 transition-colors">
            <Truck className="w-4 h-4" /> Free Delivery
          </span>
          <span className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium hover:bg-gray-700/80 transition-colors">
            <Star className="w-4 h-4" /> 4.8 Rating
          </span>
          <span className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium hover:bg-gray-700/80 transition-colors">
            <Pizza className="w-4 h-4" /> Fresh Ingredients
          </span>
        </div>

        {/* CTA Button */}
        <a
          href="#menu"
          className="inline-block mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg md:text-xl px-10 py-4 rounded-full shadow-xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
        >
          Order Now 🍕
        </a>
      </div>
    </section>
  );
};

export default Hero;