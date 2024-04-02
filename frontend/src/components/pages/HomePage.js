import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserFullName(user.name);
          // Fetch orders for the current user
          const ordersResponse = await axios.get(
            `http://localhost:4000/orders/user/${user.name}`
          );

          setUserOrders(ordersResponse.data);
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
    console.log("Orders button clicked, showRestaurants:", showRestaurants);
  };

  const handleRestaurantsButtonClick = () => {
    setShowRestaurants(true);
    console.log(
      "Restaurants button clicked, showRestaurants:",
      showRestaurants
    );
  };

  const getMenuPrice = (menuItemName) => {
    const menuItem = restaurants.find((restaurant) =>
      restaurant.menu.find((item) => item.name === menuItemName)
    );
    if (menuItem) {
      const item = menuItem.menu.find((item) => item.name === menuItemName);
      return item.price;
    } else {
      return 0;
    }
  };

  console.log("Rendering with showRestaurants:", showRestaurants);

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
        <div>
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
        </div>
      ) : (
        <div>
          <h2>Your Orders</h2>
          <ul>
            {userOrders.map((order) => (
              <li key={order._id}>
                <p>Restaurant Name: {order.restaurant}</p>
                <p>Order ID: {order._id}</p>

                <ul>
                  {order.items.map((item) => (
                    <li key={item._id}>
                      {item.menuItem} - Quantity: {item.quantity}, Cost: $
                      {item.quantity * getMenuPrice(item.menuItem)}
                    </li>
                  ))}
                </ul>
                <p>Total Price: ${order.totalPrice}</p>
                <p>Order Status: {order.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
