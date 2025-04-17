// Mock car data
const car = {
  id: 1,
  name: "Nissan Magnite",
  year: "2023",
  transmission: "Manual",
  fuel: "Petrol",
  seats: 5,
  rating: 5.0,
  reviewCount: 6,
  price: 51178,
  baseFare: 350,
  additionalKmCharge: 19,
  tripProtectionFee: 6649,
  distance: 9.7,
  host: "Zoomcar Assured",
  location: {
    address:
      "PLOT NO-5, G-2, GROUND FLOOR, CITY CENTRE MALL, CITY CENTER MALL, NEAR HALDIRAM, Pocket 7, Sector 12 Dwarka, Dwarka, New Delhi, Delhi, 110075, India",
    coordinates: {
      lat: 28.5923,
      lng: 77.0415,
    },
  },
  images: [
    "src/assets/background/1.jpg",
    "src/assets/background/2.jpg",
    "src/assets/background/3.png",
  ],
  features: [
    { name: "Spare Tyre", available: true },
    { name: "Toolkit", available: true },
    { name: "Reverse Camera", available: true },
    { name: "Child Seat", available: false },
    { name: "Pet Friendly", available: true },
    { name: "Electric ORVM", available: true },
    { name: "Anti-lock Braking System (ABS)", available: true },
    { name: "Traction Control", available: true },
    { name: "2 Front Airbags", available: true },
  ],
  benefits: [
    "Free cancellation up to 24 hours before trip start",
    "Unlimited kilometers",
    "Doorstep delivery and pickup",
    "24/7 roadside assistance",
    "Clean and sanitized cars",
  ],
  cancellationPolicy: [
    { time: "More than 24 hours before trip start", fee: "No charges" },
    {
      time: "Less than 24 hours but more than 12 hours",
      fee: "30% of the booking amount",
    },
    {
      time: "Less than 12 hours but more than 6 hours",
      fee: "50% of the booking amount",
    },
    { time: "Less than 6 hours", fee: "100% of the booking amount" },
  ],
  faqs: [
    {
      question: "Is there a security deposit?",
      answer:
        "Yes, a refundable security deposit of ₹2000 will be charged at the time of booking. It will be refunded within 5-7 business days after the trip ends.",
    },
    {
      question: "What documents do I need to bring?",
      answer:
        "You need to bring your original driving license and Aadhar card or Passport for verification.",
    },
    {
      question: "Is fuel included in the price?",
      answer:
        "No, the car will be provided with some fuel, and you are expected to return it with the same fuel level.",
    },
    {
      question: "Can I extend my booking?",
      answer:
        "Yes, you can extend your booking through the app, subject to availability and additional charges.",
    },
  ],
  agreementHighlights: [
    "You must be at least 21 years old with a valid driving license",
    "Any traffic violations or fines will be your responsibility",
    "The car should be returned in the same condition as provided",
    "Smoking, drinking, and illegal activities are strictly prohibited inside the car",
  ],
};
export default car;
