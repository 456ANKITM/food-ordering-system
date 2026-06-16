import { useParams } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { useSearchFoodsQuery } from "../redux/api/foodApi";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";

const SearchList = () => {
  const { query } = useParams();

  const { data, isLoading, isError } = useSearchFoodsQuery(query);

  return (
    <>
      <PublicNavbar />

      <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 px-4 md:px-10 py-10">
        {/* Header */}
        <div className="mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">
            Search Results for{" "}
            <span className="text-orange-500">"{query}"</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Discover delicious foods matching your search
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center text-red-500 font-semibold">
            Something went wrong while searching foods.
          </div>
        )}

        {/* No Results */}
        {!isLoading && data?.foods?.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700">
              No foods found 😢
            </h2>
            <p className="text-gray-500 mt-2">
              Try searching something like "pizza", "biryani", "burger"
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.foods?.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchList;
