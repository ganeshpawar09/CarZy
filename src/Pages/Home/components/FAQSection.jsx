import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqItems = [
    {
      question: "How does CarZy work?",
      answer:
        "CarZy allows you to rent cars from our fleet with ease. Simply select your location, pick your rental dates, choose a car, and complete the booking. You can pick up your car from our designated locations.",
    },
    {
      question: "What documents do I need to rent a car?",
      answer:
        "You'll need a valid driver's license, a credit card in your name, and proof of insurance. International customers may need additional documentation.",
    },
    {
      question: "Can I cancel my reservation?",
      answer:
        "Yes, you can cancel your reservation up to 24 hours before the pickup time for a full refund. Cancellations within 24 hours may be subject to a fee.",
    },
    {
      question: "Is there a minimum rental period?",
      answer:
        "Our minimum rental period is 24 hours. You can rent a car for as long as you need, with special rates for weekly and monthly rentals.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="font-monda py-16 px-6 bg-gradient-to-b from-gray-100 to-white"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {activeFaq === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {activeFaq === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-300">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
