import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [customerView, setCustomerView] = useState(true);
  const [employeeView, setEmployeeView] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // State to store all orders
  const [userRole, setUserRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // State to store selected status for each order

  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null); // State to store employee data

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

          if (userRole === "employee") {
            // Fetch employee data
            const employeeResponse = await axios.get(
              `http://localhost:4000/users/${user._id}` // Updated URL
            );

            setEmployee(employeeResponse.data);

            // Fetch all orders for employees
            const ordersResponse = await axios.get(
              `http://localhost:4000/orders`
            );
            setAllOrders(ordersResponse.data);
          }
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
  }, [userRole]); // Fetch data whenever user role changes

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

  const toggleItemSoldOut = async (restaurantId, itemId) => {
    try {
      const updatedRestaurants = [...restaurants];
      const restaurantIndex = updatedRestaurants.findIndex(
        (r) => r._id === restaurantId
      );
      if (restaurantIndex !== -1) {
        const restaurant = updatedRestaurants[restaurantIndex];
        const menuItemIndex = restaurant.menu.findIndex(
          (item) => item._id === itemId
        );
        if (menuItemIndex !== -1) {
          const updatedMenu = [...restaurant.menu];
          updatedMenu[menuItemIndex].soldOut =
            !updatedMenu[menuItemIndex].soldOut;
          updatedRestaurants[restaurantIndex] = {
            ...restaurant,
            menu: updatedMenu,
          };
          setRestaurants(updatedRestaurants);

          // Send PATCH request to update soldOut status
          await axios.patch(
            `http://localhost:4000/restaurants/${restaurantId}/menu/${itemId}`,
            { soldOut: updatedMenu[menuItemIndex].soldOut },
            { headers: { "Content-Type": "application/json" } }
          );

          // alert(`Item ${itemId} sold out status toggled successfully!`);
        }
      }
    } catch (error) {
      console.error("Error toggling item sold out:", error);
      alert("Error toggling item sold out. See console for details.");
    }
  };

  const deleteMenuItem = async (restaurantId, itemId) => {
    try {
      const updatedRestaurants = [...restaurants];
      const restaurantIndex = updatedRestaurants.findIndex(
        (r) => r._id === restaurantId
      );
      if (restaurantIndex !== -1) {
        const restaurant = updatedRestaurants[restaurantIndex];
        const updatedMenu = restaurant.menu.filter(
          (item) => item._id !== itemId
        );
        updatedRestaurants[restaurantIndex] = {
          ...restaurant,
          menu: updatedMenu,
        };
        setRestaurants(updatedRestaurants);
        await axios.delete(
          `http://localhost:4000/restaurants/${restaurantId}/menu/${itemId}`
        );
        alert(`Menu item ${itemId} deleted successfully!`);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Error deleting menu item. See console for details.");
    }
  };
  const handleAddNewItem = async (restaurantId) => {
    try {
      // Implement the logic to add a new item here
      // For example, you can navigate to a new page to add a new item
      // Or you can show a modal for adding a new item
      console.log("Adding a new item for restaurant:", restaurantId);
    } catch (error) {
      console.error("Error adding new item:", error);
      alert("Error adding new item. See console for details.");
    }
  };
  // Function to handle status change in the dropdown
  const handleStatusChange = (orderId, newStatus) => {
    try {
      // Update the local state with the new status for the specific order
      setUserOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Update the selected status state
      setSelectedStatus(newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. See console for details.");
    }
  };

  // Function to handle confirmation button click
  const handleConfirm = async (orderId) => {
    try {
      // Use the selectedStatus state variable instead of directly accessing the dropdown value
      await axios.patch(`http://localhost:4000/orders/${orderId}/status`, {
        status: selectedStatus,
      });
      console.log("Order confirmed:", orderId);
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Error confirming order. See console for details.");
    }
  };
  useEffect(() => {
    // Check if the user is an employee and set the employee view accordingly
    if (userRole === "employee") {
      setEmployeeView(true);
      setCustomerView(false);
    }
    // } else if (userRole === "manager") {
    //   navigate("/Manager_Page");
    // }
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
          <h2>Menu Management</h2>
          {/* Render menu items for all restaurants */}
          {restaurants.map((restaurant) => (
            <div key={restaurant._id}>
              <h3>{restaurant.name} Menu</h3>
              {/* Button to add a new item */}
              <button onClick={() => handleAddNewItem(restaurant._id)}>
                Add New Item
              </button>
              <div className="menu-items">
                {restaurant.menu.map((menuItem) => (
                  <div key={menuItem._id} className="menu-item">
                    <h4>{menuItem.name}</h4>
                    <p>Description: {menuItem.description}</p>
                    <p>Price: ${menuItem.price}</p>
                    <button
                      onClick={() =>
                        toggleItemSoldOut(restaurant._id, menuItem._id)
                      }
                    >
                      {menuItem.soldOut ? "Mark Available" : "Mark Sold Out"}
                    </button>
                    <button
                      onClick={() =>
                        deleteMenuItem(restaurant._id, menuItem._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 
      {managerView && (
        <div>
          <h2>Manager View Content</h2>
        </div>
      )} */}
      {userRole === "customer" &&
        //        (!customerView || employeeView || managerView) && (

        !customerView && (
          <div>
            <h2>My Orders </h2>
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
      {/* {(userRole === "employee" || userRole === "manager" || !employeeView || managerView) && ( */}
      {userRole === "employee" && !employeeView && (
        <div>
          <h2>All Orders</h2>
          {allOrders.map((order) => (
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
                    {item.menuItem} - Quantity: {item.quantity}
                  </p>
                ))}
              </div>
              <p>Total Price: ${order.totalPrice}</p>
              <p>Order Status: {order.status}</p>
              {/* Dropdown for statuses */}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="ordered">Ordered</option>
                <option value="in-progress">In Progress</option>
                <option value="awaiting-pickup">Awaiting Pickup</option>
                <option value="completed">Completed</option>
              </select>
              {/* Button to confirm changes */}
              <button onClick={() => handleConfirm(order._id)}>Confirm</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
