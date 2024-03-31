import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
    if (!menuItem.soldOut) {
      console.log("Added item to cart:", menuItem);
      setCartItems([...cartItems, menuItem]);
    } else {
      console.log("Cannot add sold-out item to cart:", menuItem);
      setSelectedItem(menuItem);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
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
            <h2>Menu Popup</h2>
            <p>This item is sold out:</p>
            <p>{selectedItem && selectedItem.name}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <div className="cart-panel">
        <h2>Cart</h2>
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
