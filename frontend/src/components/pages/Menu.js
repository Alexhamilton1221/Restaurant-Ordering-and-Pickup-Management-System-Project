import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";
import { useNavigate } from "react-router-dom";
// import DateTimePicker from "react-datetime-picker";
import Datepicker from "../Datepicker";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [pickupTime, setPickupTime] = useState(new Date()); // Default pickup time is current time
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const storedRestaurantId = localStorage.getItem("selectedRestaurantId");
        if (storedRestaurantId) {
          const restaurantResponse = await axios.get(
            `http://localhost:4000/restaurants/${storedRestaurantId}`
          );
          setRestaurant(restaurantResponse.data);
          setMenuItems(restaurantResponse.data.menu);
        }
      } catch (error) {
        console.error("Error fetching restaurant and menu:", error);
      }
    };

    fetchRestaurantAndMenu();
  }, []);

  const addToCart = (menuItem) => {
    if (menuItem.soldOut) {
      alert("This item is sold out."); // Alert for sold-out items
    } else {
      const existingItemIndex = cartItems.findIndex(
        (item) => item._id === menuItem._id
      );
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity++;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...menuItem, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCartItems);
  };

  const decrementQuantity = (itemId) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === itemId
    );
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      if (updatedCartItems[existingItemIndex].quantity > 1) {
        updatedCartItems[existingItemIndex].quantity--;
        setCartItems(updatedCartItems);
      }
    }
  };

  const incrementQuantity = (itemId) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === itemId
    );
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity++;
      setCartItems(updatedCartItems);
    }
  };

  // Calculate total sum of items in the cart and round to two decimal places
  const cartTotal = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const createOrder = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user ? user._id : null;
      const storedRestaurantId = localStorage.getItem("selectedRestaurantId");
      if (userId && storedRestaurantId) {
        const orderItems = cartItems.map((item) => ({
          menuItem: item.name, // Store menu item name instead of ID
          quantity: item.quantity,
          cost: item.price * item.quantity, // Calculate and include the cost for each item
        }));

        const orderData = {
          user: user.name, // Store user name instead of ID
          restaurant: restaurant.name, // Store restaurant name instead of ID
          items: orderItems,
          totalPrice: parseFloat(cartTotal), // Convert totalPrice to float
          status: "placed",
          pickupTime: pickupTime, // Include the selected pickup time
        };

        const response = await axios.post(
          "http://localhost:4000/orders",
          orderData
        );
        console.log("Order created:", response.data);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const proceedToCheckout = async () => {
    if (parseFloat(cartTotal) === 0) {
      alert(
        "Your cart is empty. Please add items before proceeding to checkout."
      );
    } else {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user ? user._id : "No user ID found"; // Get user ID or set default message
      const storedRestaurantId = localStorage.getItem("selectedRestaurantId");
      const restaurantId = storedRestaurantId
        ? storedRestaurantId
        : "No restaurant ID found"; // Get restaurant ID or set default message
      alert(`Order placed!`);
      setCartItems([]); // Empty the cart after placing the order
      navigate("/HomePage");

      // Create the order after displaying the alert
      await createOrder();
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-container">
        {restaurant ? (
          <>
            <h1>{restaurant.name} Menu</h1>
            <h2>Click items to add to cart</h2>
            <div className="menu-items-container">
              {menuItems.map((menuItem) => (
                <div
                  key={menuItem._id}
                  className={`menu-item-block ${
                    menuItem.soldOut ? "sold-out" : ""
                  }`}
                  onClick={() => addToCart(menuItem)}
                >
                  <h3>{menuItem.name}</h3>
                  <p>Price: ${menuItem.price}</p>
                  {menuItem.soldOut && <span>(Sold Out)</span>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="cart-panel">
        <h2>Cart</h2>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id}>
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <div>
                <button onClick={() => decrementQuantity(item._id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => incrementQuantity(item._id)}>+</button>
              </div>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
        </div>
        {/* Display total sum of items in the cart */}
        <p>Total: ${cartTotal}</p>
        {/* Date/time picker for selecting pickup time */}
        <Datepicker onChange={setPickupTime} value={pickupTime} />
        {/* Button to proceed to checkout */}
        <button onClick={proceedToCheckout}>Place Order</button>
      </div>
    </div>
  );
};

export default Menu;
