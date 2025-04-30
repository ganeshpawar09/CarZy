import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ProfilePage from "./Pages/Profile/Profile";
import ListYourCar from "./Pages/ListYourCar/ListYourCar";
import Car from "./Pages/Cars/Cars";
import CarDetails from "./Pages/CarDetail/CarDetail";
import { SearchProvider } from "./Pages/Context/SearchContext";
import { CarProvider } from "./Pages/Context/CarContext";
import { CarListingProvider } from "./Pages/Context/CarListingContext";
import CarDetailsPage from "./Pages/Profile/components/CarDetailsPage";
function App() {
  return (
    <CarListingProvider>
    <CarProvider>
    <SearchProvider>
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/listyourcar" element={<ListYourCar />} />
            <Route path="/car" element={<Car />} />
            <Route path="/car-detail/:id" element={<CarDetails />} />
            <Route path="/car/:carId" element={<CarDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </SearchProvider>
    </CarProvider>
    </CarListingProvider>
  );
}

export default App;
