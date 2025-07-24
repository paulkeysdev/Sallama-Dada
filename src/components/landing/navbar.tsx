import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#309898] text-white py-4 px-6 fixed w-full top-0 z-50 shadow-md">
      <ul className="flex justify-around items-center space-x-4">
        <li><a href="#home" className="hover:text-[#FF9F00] transition-colors">Home</a></li>
        <li><a href="#protection" className="hover:text-[#FF9F00] transition-colors">Protection</a></li>
        <li><a href="#emergency" className="hover:text-[#FF9F00] transition-colors">Emergency</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
