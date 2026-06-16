import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-orange-100 text-gray-700 pt-14 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Foodie<span className="text-orange-500">Express</span>
          </h2>

          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            Fresh, fast and delicious food delivered to your doorstep with love.
          </p>

          {/* Socials */}
          <div className="flex gap-3 mt-4">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white transition"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white transition"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white transition"
            >
              <FaTwitter size={16} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li className="hover:text-orange-500 cursor-pointer">Home</li>
            <li className="hover:text-orange-500 cursor-pointer">Menu</li>
            <li className="hover:text-orange-500 cursor-pointer">Offers</li>
            <li className="hover:text-orange-500 cursor-pointer">About Us</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li className="hover:text-orange-500 cursor-pointer">Biryani</li>
            <li className="hover:text-orange-500 cursor-pointer">Pizza</li>
            <li className="hover:text-orange-500 cursor-pointer">Burger</li>
            <li className="hover:text-orange-500 cursor-pointer">Desserts</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <p className="text-gray-500 text-sm">📍 Kathmandu, Nepal</p>
          <p className="text-gray-500 text-sm mt-2">📞 +977-98XXXXXXXX</p>
          <p className="text-gray-500 text-sm mt-2">
            ✉️ support@foodieexpress.com
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-orange-100 mt-10 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} FoodieExpress. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
