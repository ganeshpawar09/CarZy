import React, { useState, useEffect } from "react";
import { User, Car, Map, ListChecks, CreditCard, RefreshCcw, Ticket, AlertCircle } from "lucide-react";
import Navbar from "./components/NavBar";
import ProfileTab from "./components/ProfileTab";
import MyTripsTab from "./components/MyTripsTab";
import MyCarsTab from "./components/MyCarsTab";
import MyCarsTripsTab from "./components/MyCarsTrips";
import PaymentsTab from "./components/PaymentsTab";
import RefundsTab from "./components/RefundsTab";
import CouponsTab from "./components/CouponsTab";
import PenaltiesTab from "./components/PenaltiesTab";
import PayoutsTab from "./components/PayoutsTab";


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");


  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "trips", label: "My Trips", icon: <Map size={20} /> },
    { id: "cars", label: "My Cars", icon: <Car size={20} /> },
    { id: "myCarsTrips", label: "My Cars Trips", icon: <ListChecks size={20} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={20} /> },
    { id: "payouts", label: "Payouts", icon: <RefreshCcw size={20} /> },
    { id: "refunds", label: "Refunds", icon: <RefreshCcw size={20} /> },
    { id: "coupons", label: "Coupons", icon: <Ticket size={20} /> },
    { id: "penalties", label: "Penalties", icon: <AlertCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="font-monda pt-20 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 flex-1 text-center ${
                  activeTab === tab.id
                    ? "border-b-2 border-black text-black font-bold"
                    : "text-gray-400 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "trips" && <MyTripsTab />}
            {activeTab === "cars"  && <MyCarsTab />}
            {activeTab === "myCarsTrips"  && <MyCarsTripsTab />}
            {activeTab === "payments" && <PaymentsTab />}
            {activeTab === "payouts" && <PayoutsTab />}
            {activeTab === "refunds" && <RefundsTab />}
            {activeTab === "coupons" && <CouponsTab />}
            {activeTab === "penalties" && <PenaltiesTab />}
          </div>
        </div>
      </div>
    </div>
  );
}