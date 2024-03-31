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

  const addToCart = () => {
    if (selectedItem) {
      const newItem = { ...selectedItem, quantity };
      setCartItems([...cartItems, newItem]);
      closePopup(); // Close the popup after adding item to the cart
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
                  onClick={() => openPopup(menuItem)}
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
                {selectedItem.soldOut ? (
                  <p className="sold-out-warning">This item is sold out</p>
                ) : (
                  <>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1" // Minimum quantity is 1
                    />
                    <button onClick={addToCart}>Add</button>
                  </>
                )}
              </>
            )}
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <div className="cart-panel">
        <h2>Cart</h2>
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index}>
              <p>
                {item.name} (Quantity: {item.quantity})
              </p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
