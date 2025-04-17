import React, { useState } from "react";
import {
  User,
  Car,
  Map,
  Phone,
  Check,
  X,
  Plus,
  Edit,
  AlertCircle,
} from "lucide-react";
import Navbar from "./components/NavBar";
import ProfileTab from "./components/ProfileTab";
import MyTripsTab from "./components/MyTripsTab";
import MyCarsTab from "./components/MyCarsTab";
import Footer from "../../components/Footer";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Mock data
  const userData = {
    id: 1,
    full_name: "John Doe",
    mobile_number: "9876543210",
    user_type: "user",
    verification_status: "approved", // can be 'pending', 'approved', 'rejected'
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "trips", label: "My Trips", icon: <Map size={20} /> },
    { id: "cars", label: "My Cars", icon: <Car size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="font-monda pt-20 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center space-x-2 px-6 py-4 text-center flex-1 ${
                  activeTab === tab.id
                    ? "border-b-2 border-black text-black-600 font-bold font-xl"
                    : "text-gray-400 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && <ProfileTab userData={userData} />}
            {activeTab === "trips" && <MyTripsTab />}
            {activeTab === "cars" && <MyCarsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
