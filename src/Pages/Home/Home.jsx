import React from "react";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/NavBar";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "../../components/Footer";
import Testimonials from "./components/TestimonialSection";
import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <Footer />
      <Chatbot />
    </div>
  );
}
