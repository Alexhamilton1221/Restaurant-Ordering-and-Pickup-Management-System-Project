import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomePage.css";

const Homepage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user object from local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserFullName(user.name); // Set user's full name
        }

        // Fetch restaurant data from the backend API
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

  const handleRestaurantClick = (restaurant) => {
    // Handle click on restaurant block (e.g., navigate to restaurant details page)
    console.log("Clicked on restaurant:", restaurant);
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
            onClick={() => handleRestaurantClick(restaurant)}
          >
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location}</p>
            <p>Rating: {restaurant.rating}</p>
            {/* Display menu items */}
            <h4>Menu:</h4>
            <ul>
              {restaurant.menu.map((menuItem) => (
                <li key={menuItem._id}>
                  {menuItem.name} - ${menuItem.price}{" "}
                  {menuItem.soldOut && <span>(Sold Out)</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
