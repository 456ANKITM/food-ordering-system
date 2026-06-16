import { Gift, Tag, Flame, Percent } from "lucide-react";

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "30% OFF on First Order",
      desc: "Get exclusive discount on your first order from our restaurant.",
      icon: <Percent size={22} />,
      highlight: "NEW USER DEAL",
      color: "from-orange-400 to-orange-500",
    },
    {
      id: 2,
      title: "Family Bucket Deal",
      desc: "Buy 1 Family Bucket and get free fries + cold drink.",
      icon: <Gift size={22} />,
      highlight: "BEST VALUE",
      color: "from-orange-300 to-orange-500",
    },
    {
      id: 3,
      title: "Spicy Wings Combo",
      desc: "Extra spicy wings combo at special discounted price.",
      icon: <Flame size={22} />,
      highlight: "HOT DEAL",
      color: "from-orange-500 to-red-400",
    },
    {
      id: 4,
      title: "Weekend Special Offer",
      desc: "Flat 20% OFF on all meals every weekend.",
      icon: <Tag size={22} />,
      highlight: "WEEKEND ONLY",
      color: "from-orange-400 to-amber-500",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-linear-to-b from-orange-50 to-white">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Special <span className="text-orange-500">Offers</span>
        </h2>
        <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
          Grab the best deals and enjoy your favorite meals at discounted prices
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative bg-white border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Highlight */}
            <div className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
              {offer.highlight}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              {offer.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mt-4">
              {offer.title}
            </h3>

            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              {offer.desc}
            </p>

            {/* CTA */}
          </div>
        ))}
      </div>

      {/* Bottom banner */}
      <div className="mt-14 text-center">
        <span className="inline-block bg-orange-100 text-orange-600 px-6 py-3 rounded-full font-semibold">
          🔥 Limited Time Offers — Don’t Miss Out!
        </span>
      </div>
    </section>
  );
};

export default SpecialOffers;
