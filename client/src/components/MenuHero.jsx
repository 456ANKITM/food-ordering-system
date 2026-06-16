const MenuHero = ({ search, setSearch }) => {
  return (
    <section className="relative w-full bg-linear-to-r from-orange-50 via-white to-orange-100 py-10 px-6 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-orange-400 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          What are you <span className="text-orange-500">craving today?</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-500 text-sm md:text-base">
          Search your favorite meals and discover delicious food instantly
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-xl relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search burgers, pizza, biryani..."
              className="w-full px-5 py-3 rounded-full border border-orange-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />

            {/* Search icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 text-lg">
              🔍
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuHero;
