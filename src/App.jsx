import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ProfilePage from "./Pages/Profile/Profile";
import ListYourCar from "./Pages/ListYourCar/ListYourCar";
import Car from "./Pages/Cars/Cars";
import CarDetails from "./Pages/CarDetail/CarDetail";
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/listyourcar" element={<ListYourCar />} />
            <Route path="/car" element={<Car />} />
            <Route path="/car-detail" element={<CarDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
