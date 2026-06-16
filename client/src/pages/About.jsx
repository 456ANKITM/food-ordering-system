import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { useState } from "react";

const About = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const navigate = useNavigate();

  // Team Members
  const team = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Executive Chef",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60",
      bio: "20+ years of culinary excellence",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "Sous Chef",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60",
      bio: "Master of flavors and presentation",
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60",
      bio: "Ensuring seamless service daily",
    },
    {
      id: 4,
      name: "Neha Sharma",
      role: "Customer Experience Lead",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60",
      bio: "Your satisfaction is our mission",
    },
  ];

  // Success Stories
  const successStories = [
    {
      id: 1,
      name: "Sharma Family",
      story:
        "From birthday parties to weekly dinners, Foodie Express has become part of our family traditions.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=60",
    },
    {
      id: 2,
      name: "Office Team Building",
      story:
        "Best catering service for our corporate events. Employees loved the quality and variety!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=60",
    },
    {
      id: 3,
      name: "Wedding Reception",
      story:
        "Made our special day even more special with exquisite dishes and impeccable service.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1519671482677-504be0271101?auto=format&fit=crop&w=400&q=60",
    },
  ];

  // Facilities
  const facilities = [
    {
      icon: "🍽️",
      title: "Fine Dining",
      desc: "Elegant ambiance perfect for special occasions",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Hot meals delivered to your doorstep in 30 mins",
    },
    {
      icon: "🎉",
      title: "Event Catering",
      desc: "Full catering for parties, weddings, and events",
    },
    {
      icon: "👨‍🍳",
      title: "Custom Menus",
      desc: "Personalized dishes based on your preferences",
    },
    {
      icon: "♻️",
      title: "Eco-Friendly",
      desc: "Sustainable packaging and sourcing practices",
    },
    {
      icon: "🏆",
      title: "Award Winning",
      desc: "Recognized for excellence in food & service",
    },
  ];

  // Stats
  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "1500+", label: "Orders Daily" },
    { number: "50+", label: "Menu Items" },
    { number: "15+", label: "Years Excellence" },
  ];

  return (
    <>
      <PublicNavbar />

      <div className="bg-white text-gray-900">
        {/* ===== HERO SECTION ===== */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1600&q=80"
            alt="Restaurant"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/60 to-transparent" />

          <div className="relative text-left text-white px-6 md:px-12 max-w-3xl w-full">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/40">
              <span className="text-sm font-semibold text-orange-200">
                Our Journey
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Crafting{" "}
              <span className="bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                Culinary
              </span>{" "}
              Excellence
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
              Where passion meets flavor. For over 15 years, we've been
              delivering unforgettable dining experiences, one plate at a time.
            </p>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="bg-linear-to-r from-orange-500 to-orange-600 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center text-white">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <p className="text-orange-100 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OUR STORY SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                SINCE 2009
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                A Passion for{" "}
                <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Great Food
                </span>
              </h2>

              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Founded in 2009, Foodie Express began as a small restaurant
                  with a big dream: to bring exceptional culinary experiences to
                  every table. What started with just one kitchen and five staff
                  members has grown into a beloved institution.
                </p>

                <p className="leading-relaxed">
                  Our journey has been fueled by a commitment to quality,
                  innovation, and customer satisfaction. Every dish that leaves
                  our kitchen tells a story of dedication, expertise, and love
                  for the craft.
                </p>

                <p className="leading-relaxed">
                  Today, we serve over 1,500 customers daily across Kathmandu,
                  combining traditional recipes with modern culinary techniques
                  to create unforgettable experiences.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-linear-to-br from-orange-50 to-white border border-orange-200 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">15+</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Years of Excellence
                  </p>
                </div>
                <div className="p-4 bg-linear-to-br from-orange-50 to-white border border-orange-200 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">50+</div>
                  <p className="text-sm text-gray-600 mt-1">Signature Dishes</p>
                </div>
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1556910103-2b02b4124dd5?auto=format&fit=crop&w=600&q=80"
              alt="Chef cooking"
              className="rounded-2xl shadow-2xl object-cover h-125 w-full hover:shadow-3xl transition-shadow duration-300"
            />
          </div>
        </section>

        {/* ===== OUR FACILITIES ===== */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                WHAT WE OFFER
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Premium Facilities & Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We've invested in the best to serve you the best
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {facilities.map((facility, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {facility.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600">{facility.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OUR TEAM ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              OUR TEAM
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Talented Chefs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passion, expertise, and dedication in every dish
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                onClick={() =>
                  setActiveTeamMember(
                    activeTeamMember === member.id ? null : member.id,
                  )
                }
                className="group cursor-pointer"
              >
                <div className="relative mb-4 rounded-2xl overflow-hidden h-72 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div
                  className={`transition-all duration-300 ${activeTeamMember === member.id ? "bg-orange-50 p-4 rounded-xl border border-orange-200" : ""}`}
                >
                  <h3 className="text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 font-semibold text-sm mt-1">
                    {member.role}
                  </p>

                  {activeTeamMember === member.id && (
                    <p className="text-gray-600 text-sm mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SUCCESS STORIES ===== */}
        <section className="bg-linear-to-b from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                CUSTOMER LOVE
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from our happy customers and their unforgettable
                experiences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(story.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4 italic">
                      "{story.story}"
                    </p>

                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-orange-600 font-semibold">
                      Verified Customer
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== GALLERY SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              AMBIENCE
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Experience Our Space
            </h2>
            <p className="text-gray-600">
              Where every detail is crafted for your comfort
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1517457373614-b7152f800eb0?auto=format&fit=crop&w=800&q=80"
                alt="Dining area"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                alt="Plating"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80"
                alt="Kitchen"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561341?auto=format&fit=crop&w=800&q=80"
                alt="Event catering"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* ===== VALUES SECTION ===== */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                OUR VALUES
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Drives Us
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🌟",
                  title: "Quality First",
                  desc: "Only the finest ingredients and meticulous preparation go into every dish",
                },
                {
                  icon: "💚",
                  title: "Customer Care",
                  desc: "Your satisfaction and happiness is at the heart of everything we do",
                },
                {
                  icon: "🚀",
                  title: "Innovation",
                  desc: "Constantly evolving and creating new culinary experiences for you",
                },
              ].map((value, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white rounded-2xl border border-gray-200 text-center hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  <div className="text-5xl mb-4 mx-auto">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              RECOGNITION
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Awards & Achievements
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                year: "2023",
                award: "Best Restaurant in Kathmandu",
                org: "Foodie Magazine",
              },
              {
                year: "2022",
                award: "Customer Choice Award",
                org: "Nepal Food & Beverage",
              },
              {
                year: "2021",
                award: "Innovation in Culinary Arts",
                org: "Asian Food Federation",
              },
              {
                year: "2020",
                award: "Excellence in Service",
                org: "Tourism Board Nepal",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-linear-to-r from-orange-50 to-white border border-orange-200 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {item.year}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {item.award}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-orange-400 to-orange-600" />

          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Food Community
            </h2>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Experience the flavor, quality, and service that has made us a
              beloved name in Kathmandu for over 15 years.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/menu")}
                className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Order Now
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
