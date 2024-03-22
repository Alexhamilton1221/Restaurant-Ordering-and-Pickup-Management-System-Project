import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomePage.css";

const Homepage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch user name from the backend API
    const fetchUserName = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/name");
        setUserFullName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    // Fetch restaurant data from the backend API
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:4000/restaurants");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchUserName();
    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurant) => {
    // Handle click on restaurant block (e.g., navigate to restaurant details page)
    console.log("Clicked on restaurant:", restaurant);
  };

  return (
    <div className="homepage">
      <h1>Welcome to MealMate, {userFullName}!</h1>
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-block"
            onClick={() => handleRestaurantClick(restaurant)}
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

export default Homepage;
