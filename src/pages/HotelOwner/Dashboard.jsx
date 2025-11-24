import React, { useEffect, useState } from "react";
import {
  HiCalendar,
  HiCurrencyDollar,
  HiStar,
  HiUserGroup,
  HiTrendingUp,
} from "react-icons/hi";
import Title from "../../components/Title";
import axiosInstance from "../../api/config/axiosInstance";

const Dashboard = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    successfulPayments: 0
  });

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await axiosInstance.get("/orders/count");
        console.log("Order count response:", response.data);
        setOrderCount(response.data);
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axiosInstance.get("/user/count");
        console.log("User count response:", response.data);
        setUserCount(response.data);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axiosInstance.get("/rooms/reviews/overall-average-rating");
        console.log("Review average rating response:", response.data);
        setAverageRating(response.data || 0);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders", {
          params: { page: 0, size: 5 }
        });
        console.log("Orders response:", response.data.orders);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const response = await axiosInstance.get("/payment/revenue-overview");
        console.log("Revenue data response:", response.data);
        setRevenueData(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchOrders();
    fetchAverageRating();
    fetchUserCount();
    fetchOrderCount();
    fetchRevenueData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); 
  };

  const statsData = [
    {
      title: "Total Bookings",
      value: orderCount,
      icon: <HiCalendar className="text-3xl text-blue-500" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(revenueData.totalRevenue),
      icon: <HiCurrencyDollar className="text-3xl text-green-500" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(revenueData.monthlyRevenue),
      icon: <HiTrendingUp className="text-3xl text-purple-500" />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
    {
      title: "Active Guests",
      value: userCount,
      icon: <HiUserGroup className="text-3xl text-orange-500" />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
    },
    {
      title: "Successful Payments",
      value: revenueData.successfulPayments,
      icon: <HiCurrencyDollar className="text-3xl text-teal-500" />,
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: <HiStar className="text-3xl text-yellow-500" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <div className="p-6">
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subtitle="Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 my-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex-shrink-0">{stat.icon}</div>
            <div className="ml-3">
              <p className={`text-xs font-medium ${stat.textColor}`}>
                {stat.title}
              </p>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h3>
          <div className="space-y-4">
            {orders.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="font-medium">Room {item.roomId}</p>
                  <p className="text-sm text-gray-500">
                    {item.userId} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  item.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Overview
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Total Revenue: {formatCurrency(revenueData.totalRevenue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;