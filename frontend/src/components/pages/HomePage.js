import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [clickedRestaurantId, setClickedRestaurantId] = useState(null); // State variable to hold clicked restaurant ID
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
    // Handle click on restaurant block
    console.log("Clicked on restaurant:", restaurantId);
    setClickedRestaurantId(restaurantId); // Set the clicked restaurant ID
    localStorage.setItem("selectedRestaurantId", restaurantId); // Store the selected restaurant ID
    navigate(`/menu`); // Navigate to '/menu'
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
            onClick={() => handleRestaurantClick(restaurant._id)} // Pass restaurant ID to the function
          >
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location}</p>
            <p>Rating: {restaurant.rating}</p>
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
      {/* {clickedRestaurantId && (
        <p>Clicked Restaurant ID: {clickedRestaurantId}</p>
      )}{" "}
      // Display clicked restaurant ID */}
    </div>
  );
};

export default HomePage;
