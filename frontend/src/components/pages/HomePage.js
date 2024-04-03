import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [customerView, setCustomerView] = useState(true);
  const [employeeView, setEmployeeView] = useState(false);
  const [managerView, setManagerView] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserFullName(user.name);
          setUserRole(user.role);

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
    // Handle restaurant click action here
    navigate(`/menu`);
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

  useEffect(() => {
    // Check if the user is an employee and set the employee view accordingly
    if (userRole === "employee") {
      setEmployeeView(true);
      setCustomerView(false);
      setManagerView(false);
    }
  }, [userRole]);

  return (
    <div className="homepage">
      <div className="homepage-header">
        <h1>Welcome to MealMate, {userFullName}!</h1>
        <div className="homepage-buttons">
          {userRole === "customer" && (
            <>
              <button onClick={() => setCustomerView(true)}>Restaurants</button>
              <button onClick={() => setCustomerView(false)}>Orders</button>
            </>
          )}
          {userRole === "employee" && (
            <>
              <button onClick={() => setEmployeeView(true)}>
                Menu Management
              </button>
              <button onClick={() => setEmployeeView(false)}>
                Order Processing
              </button>
            </>
          )}
          {userRole === "manager" && (
            <>
              <button onClick={() => setManagerView(true)}>
                Analytics Dashboard
              </button>
            </>
          )}
        </div>
      </div>
      {customerView && (
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
      )}
      {employeeView && (
        <div>
          <h2>Employee View Content</h2>
          {/* Add content specific to employee view */}
        </div>
      )}
      {managerView && (
        <div>
          <h2>Manager View Content</h2>
          {/* Add content specific to manager view */}
        </div>
      )}
      {!(customerView || employeeView || managerView) && (
        <div>
          <h2>Your Orders</h2>
          {userOrders.map((order) => (
            <div key={order._id} className="order-wrapper">
              <p>Restaurant Name: {order.restaurant}</p>
              <p>
                Pickup Time:{" "}
                {new Date(order.pickupTime).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
              <p>Order ID: {order._id}</p>
              <div>
                {order.items.map((item) => (
                  <p key={item._id}>
                    {item.menuItem} - Quantity: {item.quantity}, Cost: $
                    {item.quantity * getMenuPrice(item.menuItem)}
                  </p>
                ))}
              </div>
              <p>Total Price: ${order.totalPrice}</p>
              <p>Order Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
