import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { TbBrandBooking } from "react-icons/tb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import closeIcon from "../assets/closeIcon.svg";
import logo from "../assets/logo.svg";
import login from "../assets/searchIcon.svg";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experiences", path: "/" },
    { name: "About", path: "/" },
  ];

  const { user } = useAuth() || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "bg-transparent py-4 md:py-6"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="logo"
          className={`h-9 ${isScrolled ? "invert opacity-80" : ""}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
          >
            {link.name}
            <div
              className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}

        {user && (
          <button
            onClick={() => navigate("/owner")}
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? "text-black border-black" : "text-white border-white"} transition-all`}
          >
            Dashboard
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={login}
          alt="search"
          className={`${isScrolled && "invert opacity-80"} h-7 transition-all duration-500`}
        />
        {!user ? (
          <button
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <button
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
        )}
      </div>

      {/* Mobile Right */}
      <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setIsMenuOpen(true)}>
          <IoMenu
            className={`size-8 ${isScrolled ? "text-gray-700" : "text-white"}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={closeIcon} alt="close-menu" className="h-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {user ? (
          <button
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
            onClick={() => {
              navigate("/owner");
              setIsMenuOpen(false);
            }}
          >
            Dashboard
          </button>
        ) : (
          <button
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
            onClick={() => {
              navigate("/login");
              setIsMenuOpen(false);
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
