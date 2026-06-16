import { useGetFeaturedFoodsQuery } from "../redux/api/foodApi";
import FoodCard from "./FoodCard";
import { Loader } from "./Loader";
import { ErrorState } from "./ErrorState";

const FeaturedFoods = () => {
  const { data, isLoading, error } = useGetFeaturedFoodsQuery();

  console.log("Featured Foods:", data);

  if (isLoading) return <Loader text="Loading Featured Foods" />;

  if (error)
    return (
      <ErrorState message="We Clould not load the featured food. please check your internet connection and refresh the page " />
    );

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 bg-gray-50">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          ⭐ Featured <span className="text-orange-600"> Foods </span>
        </h2>
        <p className="text-gray-500 mt-2">
          Handpicked dishes specially selected for you
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.foods?.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedFoods;
