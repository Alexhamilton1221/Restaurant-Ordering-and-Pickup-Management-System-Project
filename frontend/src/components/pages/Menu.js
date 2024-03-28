import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

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

  return (
    <div className="menu-page">
      {restaurant ? (
        <>
          <h1>{restaurant.name} Menu</h1>
          <ul>
            {menuItems.map((menuItem) => (
              <li key={menuItem._id}>
                <h3>{menuItem.name}</h3>
                <p>Price: ${menuItem.price}</p>
                {menuItem.soldOut && <span>(Sold Out)</span>}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Menu;
