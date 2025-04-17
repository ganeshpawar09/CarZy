import React, { useState } from "react";
import { Map, Check, AlertCircle } from "lucide-react";
const MyTripsTab = () => {
  const trips = [
    {
      id: 1,
      carModel: "Honda City",
      startDate: "15 Apr 2025",
      endDate: "18 Apr 2025",
      status: "upcoming",
      pickupLocation: "Mumbai Airport, T2",
      deliveryOption: "home_delivery",
      deliveryStatus: "pending",
    },
    {
      id: 2,
      carModel: "Hyundai i20",
      startDate: "10 Mar 2025",
      endDate: "12 Mar 2025",
      status: "completed",
      pickupLocation: "Delhi Central",
      deliveryOption: "user",
      deliveryStatus: "completed",
    },
    {
      id: 3,
      carModel: "Maruti Swift",
      startDate: "25 Feb 2025",
      endDate: "27 Feb 2025",
      status: "cancelled",
      pickupLocation: "Bangalore MG Road",
      deliveryOption: "owner",
      deliveryStatus: "cancelled",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: "bg-blue-100", text: "text-blue-800", label: "Upcoming" },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.upcoming;

    return (
      <span className={`px-2 py-1 rounded text-sm ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getDeliveryStatus = (status, option) => {
    if (status === "cancelled") return null;

    const deliveryText = {
      home_delivery: "Home Delivery",
      user: "Self Pickup",
      owner: "Owner Handover",
    }[option];

    const statusConfig = {
      pending: {
        icon: <AlertCircle size={14} className="mr-1 text-yellow-500" />,
        text: "text-yellow-700",
        label: "Pending",
      },
      completed: {
        icon: <Check size={14} className="mr-1 text-green-500" />,
        text: "text-green-700",
        label: "Completed",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div className="flex items-center mt-2 text-xs">
        <span className="mr-2 text-gray-500">{deliveryText}:</span>
        <div className={`flex items-center ${config.text}`}>
          {config.icon}
          {config.label}
        </div>
      </div>
    );
  };

  // Group trips by status
  const upcomingTrips = trips.filter((trip) => trip.status === "upcoming");
  const pastTrips = trips.filter(
    (trip) => trip.status === "completed" || trip.status === "cancelled"
  );

  return (
    <div className="py-4">
      {upcomingTrips.length > 0 && (
        <>
          <h3 className="font-medium mb-3 text-gray-700">Upcoming Trips</h3>
          <div className="space-y-4 mb-8">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{trip.carModel}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {trip.startDate} - {trip.endDate}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Pickup: {trip.pickupLocation}
                    </p>
                    {getDeliveryStatus(
                      trip.deliveryStatus,
                      trip.deliveryOption
                    )}
                  </div>
                  <div>{getStatusBadge(trip.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {pastTrips.length > 0 && (
        <>
          <h3 className="font-medium mb-3 text-gray-700">Past Trips</h3>
          <div className="space-y-4">
            {pastTrips.map((trip) => (
              <div key={trip.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{trip.carModel}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {trip.startDate} - {trip.endDate}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Pickup: {trip.pickupLocation}
                    </p>
                    {getDeliveryStatus(
                      trip.deliveryStatus,
                      trip.deliveryOption
                    )}
                  </div>
                  <div>{getStatusBadge(trip.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {trips.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-block rounded-full p-3 mb-3">
            <Map size={24} />
          </div>
          <h3 className="font-medium">No trips yet</h3>
          <p className="text-gray-600 text-sm mt-1">
            Book your first car to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTripsTab;
