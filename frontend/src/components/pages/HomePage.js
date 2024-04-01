import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser); // Define the 'user' variable here
          setUserFullName(user.name);
          const userId = user._id; // Extract user ID from stored user object
          // Now pass the user ID to the handleRestaurantClick function
        }

        const restaurantsResponse = await axios.get(
          "http://localhost:4000/restaurants"
        );
        setRestaurants(restaurantsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRestaurantClick = (restaurantId, userId) => {
    // Handle click on restaurant block
    console.log("Clicked on restaurant:", restaurantId);
    localStorage.setItem("selectedRestaurantId", restaurantId); // Store the selected restaurant ID
    navigate(`/menu`, { state: { userId: userId } }); // Navigate to '/menu' with user ID
  };

  return (
    <div className="homepage">
      <h1>Welcome to MealMate, {userFullName}!</h1>
      <h2>Choose a restaurant to order from:</h2>
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-block"
            onClick={() =>
              handleRestaurantClick(restaurant._id /* Pass user ID here */)
            } // Pass user ID to the function
          >
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location}</p>
            <p>Rating: {restaurant.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
