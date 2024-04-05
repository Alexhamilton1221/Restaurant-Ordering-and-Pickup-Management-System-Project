import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Manager_Page.css";

const ManagerPage = () => {
  const [userFullName, setUserFullName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [menuManagementView, setMenuManagementView] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [userRole, setUserRole] = useState("manager");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [restaurantIdToAddItem, setRestaurantIdToAddItem] = useState(""); // State to store restaurant ID for adding item
  const [newItemName, setNewItemName] = useState(""); // State to store new item details
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [confirmingItem, setConfirmingItem] = useState(false); // State to indicate confirming the new item

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserFullName(user.name);
          setUserRole(user.role);

          if (userRole === "manager") {
            const ordersResponse = await axios.get(
              `http://localhost:4000/orders`
            );
            setAllOrders(ordersResponse.data);
          }

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
  }, [userRole]);

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
  // Function to analyze the busiest time
  const getBusiestTime = (orders) => {
    // Initialize an array to count orders for each hour
    const orderCountsPerHour = Array(24).fill(0);

    // Loop through all orders and count orders for each hour
    orders.forEach((order) => {
      const pickupHour = new Date(order.pickupTime).getHours();
      orderCountsPerHour[pickupHour]++;
    });

    // Find the maximum number of orders
    const maxOrders = Math.max(...orderCountsPerHour);

    // Find the hour(s) with the maximum number of orders
    const busiestHours = orderCountsPerHour.reduce((acc, count, index) => {
      if (count === maxOrders) {
        acc.push(index);
      }
      return acc;
    }, []);

    // Return the busiest hours
    return busiestHours;
  };

  // Function to analyze the most popular item
  const getMostPopularItem = (orders) => {
    // Initialize an object to count the occurrences of each item
    const itemCounts = {};

    // Loop through all orders and count occurrences of each item
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const itemName = item.menuItem;
        if (itemCounts[itemName]) {
          itemCounts[itemName]++;
        } else {
          itemCounts[itemName] = 1;
        }
      });
    });

    // Find the item(s) with the maximum count
    let maxCount = 0;
    let mostPopularItems = [];
    for (const itemName in itemCounts) {
      const count = itemCounts[itemName];
      if (count > maxCount) {
        maxCount = count;
        mostPopularItems = [itemName];
      } else if (count === maxCount) {
        mostPopularItems.push(itemName);
      }
    }

    return mostPopularItems;
  };
  // Function to handle confirming the new item
  const handleConfirmNewItem = async () => {
    try {
      // Send request to add new item
      await axios.post(
        `http://localhost:4000/restaurants/${restaurantIdToAddItem}/menu`,
        {
          name: newItemName,
          price: newItemPrice,
          description: newItemDescription,
        }
      );

      // Refresh data after adding item
      const restaurantsResponse = await axios.get(
        "http://localhost:4000/restaurants"
      );
      setRestaurants(restaurantsResponse.data);

      // Reset state
      setAddingNewItem(false);
      setNewItemName("");
      setNewItemPrice(0);
      setNewItemDescription("");
      setRestaurantIdToAddItem("");
    } catch (error) {
      console.error("Error adding new item:", error);
      alert("Error adding new item. See console for details.");
    }
  };

  // Function to handle adding a new item
  const handleAddNewItem = (restaurantId) => {
    // Update state to indicate adding a new item
    setAddingNewItem(true);
    setRestaurantIdToAddItem(restaurantId);
  };

  // Function to handle undoing the adding of a new item
  const handleUndoAddNewItem = () => {
    setAddingNewItem(false);
    setNewItemName("");
    setNewItemPrice(0);
    setNewItemDescription("");
  };

  return (
    <div className="manager_page">
      <h1>Welcome to the Manager Dashboard, {userFullName}!</h1>
      <div className="manager-buttons">
        <button
          onClick={() => {
            setMenuManagementView(true);
          }}
        >
          Menu Management
        </button>

        <button
          onClick={() => {
            setMenuManagementView(false);
            setShowAnalytics(false);
          }}
        >
          Order Processing
        </button>

        <button onClick={() => setShowAnalytics(true)}>
          Analytics Dashboard
        </button>
      </div>
      {menuManagementView && (
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
              {/* Form to add a new item */}
              {addingNewItem && restaurantIdToAddItem === restaurant._id && (
                <div>
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Item Price"
                    value={newItemPrice}
                    onChange={(e) =>
                      setNewItemPrice(parseFloat(e.target.value))
                    }
                  />
                  <input
                    type="text"
                    placeholder="Item Description"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                  />
                  <button onClick={handleUndoAddNewItem}>Undo</button>
                  <button onClick={handleConfirmNewItem}>Confirm</button>
                </div>
              )}
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
      {!menuManagementView && !showAnalytics && (
        <div>
          <h2>Order Processing</h2>
          {/* All Orders section */}
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

      {showAnalytics && (
        <div>
          <h2>Analytics Dashboard</h2>
          <h3>Peak Time</h3>
          {allOrders.length > 0 ? (
            <div>
              {/* <p>Analyzing {allOrders.length} orders...</p> */}
              <div>
                {getBusiestTime(allOrders).map((hour) => (
                  <p key={hour}>
                    {hour % 12 || 12}:
                    {(hour % 12 === 0 ? 12 : hour % 12) < 10 ? "00" : ""}
                    {hour % 12 === hour ? "am" : "pm"}
                  </p>
                ))}
              </div>
              <div>
                <h3>Most Popular Item:</h3>
                {getMostPopularItem(allOrders).map((itemName) => (
                  <p key={itemName}>{itemName}</p>
                ))}
              </div>
            </div>
          ) : (
            <p>No orders available for analysis.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
