import React from "react";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQSection";
import Navbar from "./components/NavBar";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}
