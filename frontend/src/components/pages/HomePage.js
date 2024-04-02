import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserFullName(user.name);
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

  const handleRestaurantClick = (restaurantId) => {
    localStorage.setItem("selectedRestaurantId", restaurantId);
    navigate(`/menu`);
  };

  const handleOrdersButtonClick = () => {
    setShowRestaurants(false);
    // Add any additional logic here if needed
  };

  const handleRestaurantsButtonClick = () => {
    setShowRestaurants(true);
    // Add any additional logic here if needed
  };

  return (
    <div className="homepage">
      <div className="homepage-header">
        <h1>Welcome to MealMate, {userFullName}!</h1>
        <div className="homepage-buttons">
          <button onClick={handleRestaurantsButtonClick}>Restaurants</button>
          <button onClick={handleOrdersButtonClick}>Orders</button>
        </div>
      </div>
      {showRestaurants ? (
        <>
          <h2>Choose a restaurant to order from:</h2>
          <div className="restaurant-list">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="restaurant-block"
                onClick={() => handleRestaurantClick(restaurant._id)}
              >
                <h3>{restaurant.name}</h3>
                <p>{restaurant.location}</p>
                <p>Rating: {restaurant.rating}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2>Your Orders</h2>
      )}
    </div>
  );
};

export default HomePage;
