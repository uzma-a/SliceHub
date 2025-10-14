import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-950 to-gray-900 text-gray-400 py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Brand / Logo */}
        <h1
          onClick={() => handleScroll("home")}
          className="text-2xl font-bold text-orange-500 cursor-pointer drop-shadow-[0_2px_6px_rgba(255,165,0,0.3)]"
        >
          🍕 SliceHub
        </h1>

        {/* Footer Text */}
        <p className="text-sm">
          © {new Date().getFullYear()} SliceHub | All Rights Reserved
        </p>

        
      </div>
    </footer>
  );
};

export default Footer;
