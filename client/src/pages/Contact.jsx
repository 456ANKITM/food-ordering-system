import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });

      // Reset success message after 4 seconds
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  const position = [27.700769, 85.30014];

  const contactMethods = [
    {
      icon: "📍",
      title: "Visit Us",
      detail: "Kathmandu, Nepal",
      desc: "Find us at our main office",
    },
    {
      icon: "📞",
      title: "Call Us",
      detail: "+977 9800000000",
      desc: "Available Mon-Sat, 9am-6pm",
    },
    {
      icon: "📧",
      title: "Email Us",
      detail: "support@foodieexpress.com",
      desc: "We'll respond within 24 hours",
    },
    {
      icon: "⏰",
      title: "Working Hours",
      detail: "24/7 Support",
      desc: "Always here when you need us",
    },
  ];

  return (
    <>
      <PublicNavbar />

      <div className="bg-white text-gray-900">
        {/* ===== HERO SECTION ===== */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
            className="absolute inset-0 w-full h-full object-cover"
            alt="contact hero"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />

          {/* Hero Content */}
          <div className="relative text-left text-white px-6 md:px-12 max-w-3xl w-full">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/40">
              <span className="text-sm font-semibold text-orange-200">
                Get In Touch
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              We're Here{" "}
              <span className="bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                For You
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
              Have questions about your order? Need support? We'd love to hear
              from you. Reach out anytime and let's connect.
            </p>
          </div>
        </section>

      
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* CONTACT FORM */}
            <div className="md:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 mt-2">
                    We'll get back to you within 24 hours
                  </p>
                </div>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      ✅ Message sent successfully!
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Thank you for reaching out. We'll be in touch soon.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>

          
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Info
                </h3>
              </div>

              {contactMethods.slice(0, 3).map((method, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-orange-200 group cursor-pointer"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {method.title}
                  </h4>
                  <p className="text-sm text-orange-600 font-medium mt-1">
                    {method.detail}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      
        <section className="bg-linear-to-b from-gray-50 to-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Contact Foodie Express?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're committed to providing exceptional support and service to
                every customer
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "Fast Response",
                  desc: "24-hour guaranteed response time",
                },
                {
                  icon: "🛡️",
                  title: "Secure",
                  desc: "Your data is safe with us",
                },
                {
                  icon: "😊",
                  title: "Friendly Team",
                  desc: "Helpful and professional staff",
                },
                {
                  icon: "🎯",
                  title: "Solutions",
                  desc: "Quick resolutions to any issue",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white border border-gray-200 rounded-xl text-center hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-gray-600">Choose what works best for you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {contactMethods.map((method, idx) => (
              <div
                key={idx}
                className="relative p-8 bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {method.title}
                      </h3>
                      <p className="text-orange-600 font-semibold mt-2 text-lg">
                        {method.detail}
                      </p>
                      <p className="text-gray-600 mt-2">{method.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MAP SECTION ===== */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Find Us on the Map
              </h2>
              <p className="text-gray-600">
                Visit our headquarters in the heart of Kathmandu
              </p>
            </div>

            <div className="h-125 w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <MapContainer
                center={position}
                zoom={16}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <div className="text-center font-semibold">
                      🍔 Foodie Express HQ
                      <br />
                      <span className="text-sm text-gray-600">
                        Kathmandu, Nepal
                      </span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-orange-400 to-orange-600" />

          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers enjoying delicious food
              delivered to their doorstep
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Order Now
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
