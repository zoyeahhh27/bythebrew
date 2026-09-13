import { useState } from "react";
import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    orderType: "Dine-in",
    tableNo: "",
  });
  const [momentOpen, setMomentOpen] = useState(false);
  const [userMoments, setUserMoments] = useState(() => {
    try {
      const savedMoments = localStorage.getItem("byTheBrewMoments");
      return savedMoments ? JSON.parse(savedMoments) : [];
    } catch {
      return [];
    }
  });
  const [momentForm, setMomentForm] = useState({
    title: "",
    name: "",
    image: null,
    preview: "",
  });

  const menuItems = [
    { id: 1, name: "Cappuccino", category: "Coffee", image: "/cappuccino.webp", description: "Rich espresso finished with silky steamed milk.", price: 219 },
    { id: 2, name: "Latte", category: "Coffee", image: "/latte.webp", description: "Smooth espresso and creamy steamed milk.", price: 229 },
    { id: 3, name: "Cold Brew", category: "Cold Brews", image: "/coldbrew.webp", description: "Slow-brewed coffee served chilled and refreshing.", price: 219 },
    { id: 4, name: "Cranberry Brew", category: "Cold Brews", image: "/cranberrybrew.webp", description: "A refreshing brew with a fruity cranberry twist.", price: 229 },
    { id: 5, name: "Chicken Pizza", category: "Food", image: "/chickenpizza.webp", description: "A delicious pizza made for sharing.", price: 379 },
    { id: 6, name: "Margarita Pizza", category: "Food", image: "/margarita.webp", description: "Classic pizza with a simple, comforting flavour.", price: 319 },
    { id: 7, name: "Garlic Bread", category: "Food", image: "/garlicbread.webp", description: "Golden, buttery garlic bread perfect for sharing.", price: 179 },
    { id: 8, name: "Lotus Biscoff", category: "Desserts", image: "/lotusbiscoff.webp", description: "A sweet Biscoff treat for the perfect finish.", price: 279 },
  ];

  const categories = ["All", "Coffee", "Cold Brews", "Food", "Desserts"];

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart((previousCart) => [...previousCart, item]);
  };

  const cartItems = menuItems
    .map((item) => ({
      ...item,
      quantity: cart.filter((cartItem) => cartItem.id === item.id).length,
    }))
    .filter((item) => item.quantity > 0);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updateQuantity = (item, change) => {
    if (change > 0) {
      setCart((previousCart) => [...previousCart, item]);
      return;
    }

    setCart((previousCart) => {
      const index = previousCart.findIndex((cartItem) => cartItem.id === item.id);
      if (index === -1) return previousCart;
      const nextCart = [...previousCart];
      nextCart.splice(index, 1);
      return nextCart;
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutOpen(true);
    setOrderPlaced(false);
  };

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((previousDetails) => ({
      ...previousDetails,
      [name]: value,
    }));
  };

  const placeOrder = (event) => {
    event.preventDefault();

    if (
      !customerDetails.name.trim() ||
      !customerDetails.phone.trim() ||
      (customerDetails.orderType === "Dine-in" && !customerDetails.tableNo.trim())
    ) {
      return;
    }

    const order = {
      id: `BTW-${Date.now()}`,
      customer: { ...customerDetails },
      items: cartItems.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      })),
      total: cartTotal,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedOrders = JSON.parse(localStorage.getItem("byTheBrewOrders") || "[]");
      localStorage.setItem("byTheBrewOrders", JSON.stringify([...savedOrders, order]));
    } catch (error) {
      console.error("Could not save order locally:", error);
    }

    setOrderPlaced(true);
    setCart([]);
  };

  const handleMomentImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMomentForm((previousForm) => ({
        ...previousForm,
        image: file,
        preview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const addMoment = (event) => {
    event.preventDefault();
    if (!momentForm.title.trim() || !momentForm.image || !momentForm.preview) return;

    const newMoment = {
      id: Date.now(),
      title: momentForm.title.trim(),
      name: momentForm.name.trim() || "A Brew Lover",
      image: momentForm.preview,
    };

    setUserMoments((previousMoments) => {
      const nextMoments = [...previousMoments, newMoment];
      try {
        localStorage.setItem("byTheBrewMoments", JSON.stringify(nextMoments));
      } catch (error) {
        console.error("Could not save moment locally:", error);
      }
      return nextMoments;
    });

    setMomentForm({ title: "", name: "", image: null, preview: "" });
    setMomentOpen(false);
  };

  const goToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">BY THE BREW<span>.</span></div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#moments">Brew Moments</a>
          <a href="#about">About</a>
        </div>
        <button className="order-btn" onClick={goToMenu}>
          Order Now
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </button>
      </nav>

      <main id="home" className="hero">
        <div className="hero-content">
          <p className="eyebrow">COFFEE • FOOD • MOMENTS</p>
          <h1>Good coffee.<br /><span>Good moments.</span></h1>
          <p className="hero-description">
            Your cozy corner for coffee, conversations, delicious food and unforgettable moments.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={goToMenu}>Explore Menu →</button>
            <button className="secondary-btn" onClick={goToAbout}>Our Story</button>
          </div>
        </div>

        <div className="hero-photo">
          <img src="/logo.webp" alt="By The Brew Cafe" />
          <div className="hero-photo-label"><span>01</span><span>BY THE BREW</span></div>
        </div>
      </main>

      <section className="intro" id="about">
        <p className="section-label">WELCOME TO BY THE BREW</p>
        <h2>More than just<br /><span>a cup of coffee.</span></h2>
        <p>Come for the coffee, stay for the conversations. Discover your new favourite spot for food, friends and good vibes.</p>
      </section>

      <section className="menu-section" id="menu">
        <div className="menu-heading">
          <div>
            <p className="section-label dark-label">FROM THE BREW BAR</p>
            <h2>Something for<br /><span>every mood.</span></h2>
          </div>
          <button className="view-menu-btn" onClick={() => setSelectedCategory("All")}>View Full Menu →</button>
        </div>

        <div className="menu-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems.map((item) => {
            const currentQuantity = cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0;
            return (
              <div className="menu-card" key={item.id}>
                <div className="food-image">
                  <img src={item.image} alt={item.name} />
                  <button className="favorite" type="button" aria-label={`Favorite ${item.name}`}>♡</button>
                </div>
                <div className="menu-card-content">
                  <p className="food-category">{item.category}</p>
                  <h3>{item.name}</h3>
                  <p className="food-description">{item.description}</p>
                  <div className="food-bottom">
                    <span className="food-price">₹{item.price}</span>
                    <div className="quantity-controls">
                      {currentQuantity > 0 && (
                        <>
                          <button className="quantity-btn" type="button" onClick={() => updateQuantity(item, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                          <span className="quantity-value">{currentQuantity}</span>
                        </>
                      )}
                      <button className="add-btn" type="button" onClick={() => addToCart(item)} aria-label={`Add ${item.name} to cart`}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && <div className="empty-menu">No items found in this category.</div>}
      </section>

      <section className="moments-section" id="moments">
        <div className="moments-heading">
          <p className="section-label">BREW MOMENTS</p>
          <h2>Good coffee.<br /><span>Good company.</span></h2>
        </div>

        <div className="moments-grid">
          {[
            ["/littlecoffeebreak.webp", "Little Coffee Break"],
            ["/goodfoodgoodcompany.webp", "Good Food Good Company"],
            ["/favcorner.webp", "Fav Corner"],
            ["/madeforconversations.webp", "Made For Conversations"],
            ["/slowmornings.webp", "Slow Mornings"],
          ].map(([image, title], index) => (
            <div className="moment-card" key={title}>
              <img src={image} alt={title} />
              <div className="moment-overlay">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
              </div>
            </div>
          ))}

          {userMoments.map((moment, index) => (
            <div className="moment-card user-moment-card" key={moment.id}>
              <img src={moment.image} alt={moment.title} />
              <div className="moment-overlay">
                <span>{String(index + 6).padStart(2, "0")}</span>
                <h3>{moment.title}</h3>
                <p>Shared by {moment.name}</p>
              </div>
            </div>
          ))}

          <button type="button" className="add-moment-card" onClick={() => setMomentOpen(true)}>
            <span className="add-moment-icon">+</span>
            <span className="add-moment-label">ADD YOUR OWN MOMENT</span>
            <strong>Share your<br />Brew Moment.</strong>
            <span className="add-moment-arrow">→</span>
          </button>
        </div>
      </section>

      {cart.length > 0 && (
        <div className="cart-bar">
          <div>
            <strong>{cart.length} item{cart.length > 1 ? "s" : ""}</strong>
            <span> added to your order</span>
          </div>
          <div className="cart-actions">
            <button type="button" className="continue-ordering-btn" onClick={goToMenu}>Continue Ordering</button>
            <button type="button" className="checkout-btn" onClick={handleCheckout}>Checkout →</button>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <div className="checkout-modal">
            <button type="button" className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">×</button>

            {!orderPlaced ? (
              <>
                <p className="section-label dark-label">YOUR ORDER</p>
                <h2>Ready for your<br /><span>brew?</span></h2>

                {cartItems.length > 0 ? (
                  <>
                    <div className="checkout-items">
                      {cartItems.map((item) => (
                        <div className="checkout-item" key={item.id}>
                          <div>
                            <strong>{item.name}</strong>
                            <span>₹{item.price} × {item.quantity}</span>
                          </div>
                          <div className="checkout-quantity">
                            <button type="button" onClick={() => updateQuantity(item, -1)} aria-label={`Decrease ${item.name}`}>−</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item, 1)} aria-label={`Increase ${item.name}`}>+</button>
                          </div>
                          <strong>₹{item.price * item.quantity}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="checkout-total"><span>Total</span><strong>₹{cartTotal}</strong></div>

                    <form className="checkout-form" onSubmit={placeOrder}>
                      <label>Your Name
                        <input type="text" name="name" value={customerDetails.name} onChange={handleCustomerChange} placeholder="Enter your name" required />
                      </label>
                      <label>Phone Number
                        <input type="tel" name="phone" value={customerDetails.phone} onChange={handleCustomerChange} placeholder="Enter your phone number" required />
                      </label>
                      <label>Order Type
                        <select name="orderType" value={customerDetails.orderType} onChange={handleCustomerChange}>
                          <option value="Dine-in">Dine-in</option>
                          <option value="Takeaway">Takeaway</option>
                        </select>
                      </label>
                      {customerDetails.orderType === "Dine-in" && (
                        <label>Table Number
                          <input type="text" name="tableNo" value={customerDetails.tableNo} onChange={handleCustomerChange} placeholder="Enter your table number" required />
                        </label>
                      )}
                      <button className="place-order-btn" type="submit">Place Order • ₹{cartTotal}</button>
                    </form>
                  </>
                ) : (
                  <div className="empty-checkout">Your cart is empty.</div>
                )}
              </>
            ) : (
              <div className="order-success">
                <span className="success-icon">✓</span>
                <p className="section-label dark-label">ORDER CONFIRMED</p>
                <h2>See you<br /><span>soon.</span></h2>
                <p>
                  Thanks, {customerDetails.name}. Your {customerDetails.orderType.toLowerCase()} order has been received
                  {customerDetails.orderType === "Dine-in" && ` for Table ${customerDetails.tableNo}`}.
                </p>
                <p className="order-number">Order ID: {`BTW-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`}</p>
                <button type="button" className="primary-btn" onClick={() => setCheckoutOpen(false)}>Back to Menu →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {momentOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMomentOpen(false);
          }}
        >
          <div className="moment-modal">
            <button type="button" className="modal-close" onClick={() => setMomentOpen(false)} aria-label="Close add moment">×</button>
            <p className="section-label dark-label">BREW MOMENTS</p>
            <h2>Share your<br /><span>moment.</span></h2>

            <form className="moment-form" onSubmit={addMoment}>
              <label className="moment-upload">
                {momentForm.preview ? (
                  <img src={momentForm.preview} alt="Moment preview" />
                ) : (
                  <>
                    <span>+</span>
                    <strong>Choose a photo</strong>
                    <small>JPG, PNG or WEBP</small>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleMomentImage} required={!momentForm.preview} />
              </label>

              <label>Moment Title
                <input
                  type="text"
                  value={momentForm.title}
                  onChange={(event) => setMomentForm((previousForm) => ({ ...previousForm, title: event.target.value }))}
                  placeholder="e.g. Sunday Coffee Date"
                  required
                />
              </label>
              <label>Your Name
                <input
                  type="text"
                  value={momentForm.name}
                  onChange={(event) => setMomentForm((previousForm) => ({ ...previousForm, name: event.target.value }))}
                  placeholder="e.g. Zoya"
                />
              </label>
              <button className="place-order-btn" type="submit">Add Moment →</button>
            </form>
          </div>
        </div>
      )}

      <section className="menu-cta">
        <p className="section-label">CAN'T DECIDE?</p>
        <h2>Let your mood<br /><span>choose for you.</span></h2>
        <button className="primary-btn" onClick={goToMenu}>Find My Brew →</button>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">BY THE BREW<span>.</span></div>
            <p>Good coffee. Good food. Good moments.</p>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#moments">Brew Moments</a>
            <a href="#about">Our Story</a>
          </div>

          <div className="footer-note">
            <span>COFFEE • FOOD • CONVERSATIONS</span>
            <p>Made for slow mornings, long conversations and everything in between.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 By The Brew</span>
          <span>Made with coffee &amp; good vibes.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
