"use client";
import LoadingComponent from "@/components/LoadingComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAdminStatsQuery } from "@/lib/services/product.service";
import {
  ArrowUpRight,
  Award,
  TrendingUp,
  Users,
  Vote,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery();

  if (isLoading) {
    return <LoadingComponent />;
  }

  const statsCards = [
    {
      title: "Total Users",
      value: data?.stats.totalUsers,
      change: data?.stats.usersChange?.toFixed(2),
      icon: Users,
      changeLabel: "from last month",
    },
    {
      title: "Total Votes",
      value: data?.stats.totalVotes,
      change: data?.stats.votesChange?.toFixed(2),
      icon: Vote,
      changeLabel: "from last month",
    },
    {
      title: "Active Brands",
      value: data?.stats.activeBrands,
      change: data?.stats.activeBrandsChange?.toFixed(2),
      icon: Award,
      changeLabel: "new this month",
    },
    {
      title: "Engagement Rate",
      value: `${data?.stats.engagementRate}%`,
      change: data?.stats.engagementChange,
      icon: TrendingUp,
      changeLabel: "from last month",
    },
  ];

  const quickLinks = [
    {
      title: "Brands Management",
      href: "/admin/brands",
      description: "Manage and monitor brand activities",
      icon: Award,
    },
    {
      title: "Categories",
      href: "/admin/category",
      description: "Organize and manage product categories",
      icon: BarChart3,
    },
    {
      title: "Users Management",
      href: "/admin/users",
      description: "View and manage user accounts",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Firm Corner
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Comprehensive admin dashboard for managing your platform.
                Monitor key metrics, manage users, brands, and categories all in
                one place.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border">
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change && parseFloat(stat.change) > 0;

            return (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-lg transition-shadow duration-200 bg-white"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value?.toLocaleString() || "0"}
                  </div>
                  {stat.change && (
                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-sm font-medium ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {stat.change}%
                      </span>
                      <span className="text-sm text-gray-500">
                        {stat.changeLabel}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={index} href={link.href}>
                  <Card className="border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-full">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New users registered
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                +{Math.floor(Math.random() * 50) + 10}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-full">
                  <Vote className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Votes submitted
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                +{Math.floor(Math.random() * 200) + 50}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-full">
                  <Award className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New brands added
                  </p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                +{Math.floor(Math.random() * 10) + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
