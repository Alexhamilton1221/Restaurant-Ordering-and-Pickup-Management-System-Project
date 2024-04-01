import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1

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

  const openPopup = (menuItem) => {
    setShowPopup(true);
    setSelectedItem(menuItem);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setQuantity(1); // Reset quantity to 1 when closing the popup
  };

  const addToCart = (menuItem) => {
    if (menuItem.soldOut) {
      openPopup(menuItem); // Open popup for sold-out items
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

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add to Cart</h2>
            {selectedItem && (
              <>
                <p>{selectedItem.name}</p>
                <p className="sold-out-warning">This item is sold out</p>
                <button onClick={closePopup}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

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
      </div>
    </div>
  );
};

export default Menu;
