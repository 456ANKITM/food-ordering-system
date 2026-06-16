import { useGetBesellersQuery } from "../redux/api/foodApi";
import { ErrorState } from "./ErrorState";
import FoodCard from "./FoodCard";
import { Loader } from "./Loader";

const BestSellers = () => {
  const { data, isLoading, error } = useGetBesellersQuery();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorState message="We Could not load the best Sellers food please check the internent connection and refresh the page" />
    );

  return (
    <div className="py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl text-center font-bold text-gray-800 mb-6">
        🔥 Best <span className="text-orange-500"> Sellers </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.foods?.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
