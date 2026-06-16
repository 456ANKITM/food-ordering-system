import { useState, useMemo } from "react";
import MenuHero from "../components/MenuHero";
import FoodCard from "../components/FoodCard";
import { useGetAllFoodsQuery } from "../redux/api/foodApi";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";

const Menu = () => {
  const { data, isLoading, error } = useGetAllFoodsQuery();

  const foods = data?.foods || [];

  const [search, setSearch] = useState("");

  const filteredFoods = useMemo(() => {
    if (!search.trim()) return foods;
    return foods.filter(
      (food) =>
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.category.toLowerCase().includes(search.toLowerCase()) ||
        food.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, foods]);

  // Group foods by category
  const groupedFoods = useMemo(() => {
    return filteredFoods.reduce((acc, food) => {
      const category = food.category || "others";
      if (!acc[category]) acc[category] = [];
      acc[category].push(food);
      return acc;
    }, {});
  }, [filteredFoods]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorState message="We Could not load the menus, Please Check Your internet connection and refresh the page" />
    );

  return (
    <>
      <PublicNavbar />
      <MenuHero search={search} setSearch={setSearch} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {Object.keys(groupedFoods).map((category) => (
          <div key={category} className="mb-14">
            {/* Category Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
              {category}
            </h2>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedFoods[category].map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Menu;
