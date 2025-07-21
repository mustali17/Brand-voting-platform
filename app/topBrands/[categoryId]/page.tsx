"use client";

import Image from "next/image";
import { useGetTopBrandsBySubCategoryQuery } from "@/lib/services/category.service";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/LoadingComponent";

export default function BrandShowcase({
  params,
}: {
  params: { categoryId: string };
}) {
  const { categoryId } = params;
  const { data, isLoading, isError } =
    useGetTopBrandsBySubCategoryQuery(categoryId);
  const router = useRouter();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center py-8 text-red-500">
        Something went wrong.
      </div>
    );
  }

  const getRankingBadge = (index: number) => {
    switch (index) {
      case 0:
        return { text: "Champion", className: "bg-yellow-400 text-yellow-900" };
      case 1:
        return { text: "2nd Place", className: "bg-gray-400 text-gray-900" };
      case 2:
        return {
          text: "3rd Place",
          className: "bg-orange-400 text-orange-900",
        };
      default:
        return {
          text: `#${index + 1}`,
          className: "bg-purple-100 text-purple-700",
        };
    }
  };

  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🏆";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "⭐";
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-purple-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🏆 Top Brands Ranking
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Brand Showcase
          </h1>
          <p className="text-purple-100 text-base md:text-lg max-w-2xl mx-auto">
            Discover the top-performing brands across various categories, ranked
            by popularity and follower engagement
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {data.brands.length ? (
          <>
            {/* Top 3 Featured Brands */}
            {data.brands.length >= 3 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {/* 2nd Place */}
                  <div className="order-1 lg:order-1">
                    <div
                      onClick={() =>
                        router.push(`/profile/brands/${data.brands[1]._id}`)
                      }
                      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-gray-200 h-full"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                          <Image
                            src={data.brands[1].logoUrl || "/placeholder.svg"}
                            alt={`${data.brands[1].name} logo`}
                            width={50}
                            height={50}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <h3 className="text-lg font-bold mb-2">
                          {data.brands[1].name}
                        </h3>
                        <div className="bg-gray-400 text-gray-900 px-3 py-1 rounded-full text-xs font-medium mb-2">
                          2nd Place
                        </div>
                        <p className="text-gray-600 text-xs">
                          🥈 {formatFollowers(data.brands[1].followerCount)}{" "}
                          followers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 1st Place (Champion) */}
                  <div className="order-2 lg:order-2 sm:col-span-2 lg:col-span-1">
                    <div
                      onClick={() =>
                        router.push(`/profile/brands/${data.brands[0]._id}`)
                      }
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 text-white transform lg:-translate-y-2"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">
                          <Image
                            src={data.brands[0].logoUrl || "/placeholder.svg"}
                            alt={`${data.brands[0].name} logo`}
                            width={60}
                            height={60}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {data.brands[0].name}
                        </h3>
                        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-2">
                          Champion
                        </div>
                        <p className="text-purple-100 text-sm">
                          🏆 {formatFollowers(data.brands[0].followerCount)}{" "}
                          followers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="order-3 lg:order-3">
                    <div
                      onClick={() =>
                        router.push(`/profile/brands/${data.brands[2]._id}`)
                      }
                      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-gray-200 h-full"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                          <Image
                            src={data.brands[2].logoUrl || "/placeholder.svg"}
                            alt={`${data.brands[2].name} logo`}
                            width={50}
                            height={50}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <h3 className="text-lg font-bold mb-2">
                          {data.brands[2].name}
                        </h3>
                        <div className="bg-orange-400 text-orange-900 px-3 py-1 rounded-full text-xs font-medium mb-2">
                          3rd Place
                        </div>
                        <p className="text-gray-600 text-xs">
                          🥉 {formatFollowers(data.brands[2].followerCount)}{" "}
                          followers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Rankings Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Complete Rankings
              </h2>
              <div className="space-y-3">
                {data.brands.map((brand, index) => {
                  const badge = getRankingBadge(index);
                  const icon = getRankingIcon(index);

                  return (
                    <div
                      key={brand._id}
                      onClick={() =>
                        router.push(`/profile/brands/${brand._id}`)
                      }
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                        index < 3
                          ? "border-purple-200 bg-purple-50 hover:border-purple-300"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {/* Ranking Icon */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg mr-3">
                        {icon}
                      </div>

                      {/* Brand Logo */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <Image
                          src={brand.logoUrl || "/placeholder.svg"}
                          alt={`${brand.name} logo`}
                          width={40}
                          height={40}
                          className="object-contain rounded-lg"
                        />
                      </div>

                      {/* Brand Info */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {brand.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            {badge.text}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-1 leading-relaxed">
                          {brand.description ||
                            "Innovation at its finest with cutting-edge technology and premium design that sets industry standards."}
                        </p>
                        <div className="flex items-center text-purple-600 text-xs font-medium">
                          <span>
                            👥 {formatFollowers(brand.followerCount)} followers
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 ml-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center py-12 text-gray-500 flex-col items-center bg-white rounded-xl shadow-lg">
            <div className="mb-4">
              <Image
                src="/images/not-found.svg"
                alt="No Brands Found"
                width={150}
                height={150}
                className="opacity-50"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">No brands found</h3>
            <p className="text-gray-400 text-sm">
              No brands found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
