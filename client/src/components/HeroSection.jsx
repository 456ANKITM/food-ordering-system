import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search/${encodeURIComponent(trimmed)}`);
  };
  return (
    <div className="relative w-full  min-h-[90vh] flex items-center bg-linear-to-r from-orange-50 via-white to-orange-100 overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12 z-10">
        {/* Left Content */}
        <div>
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Fast • Fresh • Delicious
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Delicious Meals <br />
            Delivered To Your <span className="text-orange-500">Doorstep</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Experience the best food from top restaurants around you. Fresh
            ingredients, fast delivery, and unforgettable taste — all in one
            place.
          </p>

          {/* Add a Search box here  */}

          <form
            onSubmit={handleSearch}
            className="flex mt-5 items-center bg-white rounded-full shadow-sm overflow-hidden "
          >
            <Search className="text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search pizza, burger, biryani..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4  outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Search
            </button>
          </form>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition"
            >
              Order Now
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 py-3 border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition"
            >
              Explore Menu
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-sm text-gray-500">Restaurants</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">10k+</h3>
              <p className="text-sm text-gray-500">Orders Delivered</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">4.8★</h3>
              <p className="text-sm text-gray-500">User Rating</p>
            </div>
          </div>
        </div>

        {/* Right Content (Image Section) */}
        <div className="relative flex justify-center">
          <div className="absolute w-72 h-72 bg-orange-200 rounded-full blur-2xl opacity-40"></div>

          <img
            src="https://images.unsplash.com/photo-1600891964092-4316c288032e"
            alt="Delicious Food"
            className="relative w-105 rounded-2xl shadow-2xl object-cover"
          />

          {/* Floating badge */}
          <div className="absolute bottom-6 left-6 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center gap-2">
            <span className="text-green-500 font-bold">●</span>
            <span className="text-sm text-gray-700">30 min delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
