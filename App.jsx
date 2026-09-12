import { useState } from "react";
import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    orderType: "Dine-in",
    tableNo: "",
  });
  const [moments, setMoments] = useState([
    { id: 1, image: "/littlecoffeebreak.webp", title: "Little Coffee Break" },
    { id: 2, image: "/goodfoodgoodcompany.webp", title: "Good Food Good Company" },
    { id: 3, image: "/favcorner.webp", title: "Fav Corner" },
    { id: 4, image: "/madeforconversations.webp", title: "Made For Conversations" },
    { id: 5, image: "/slowmornings.webp", title: "Slow Mornings" },
  ]);
  const [showMomentForm, setShowMomentForm] = useState(false);
  const [momentTitle, setMomentTitle] = useState("");
  const [momentName, setMomentName] = useState("");
  const [momentImage, setMomentImage] = useState("");

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
    setCart((previousCart) => {
      const existing = previousCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...previousCart, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((previousCart) => previousCart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (id) => {
    setCart((previousCart) => previousCart.flatMap((item) => {
      if (item.id !== id) return [item];
      if (item.quantity === 1) return [];
      return [{ ...item, quantity: item.quantity - 1 }];
    }));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const goToMenu = () => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  const goToAbout = () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((previous) => ({ ...previous, [name]: value }));
  };

  const submitOrder = (event) => {
    event.preventDefault();
    if (!customerDetails.name.trim() || !customerDetails.phone.trim()) return;
    if (customerDetails.orderType === "Dine-in" && !customerDetails.tableNo.trim()) return;
    setOrderPlaced(true);
  };

  const resetOrder = () => {
    setCart([]);
    setShowCheckout(false);
    setOrderPlaced(false);
    setCustomerDetails({ name: "", phone: "", orderType: "Dine-in", tableNo: "" });
  };

  const handleMomentImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMomentImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addMoment = (event) => {
    event.preventDefault();
    if (!momentTitle.trim() || !momentImage) return;
    setMoments((previous) => [
      ...previous,
      { id: Date.now(), image: momentImage, title: momentTitle.trim(), name: momentName.trim() },
    ]);
    setMomentTitle("");
    setMomentName("");
    setMomentImage("");
    setShowMomentForm(false);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">BY THE BREW<span>.</span></div>
        <div className="nav-links">
          <a href="#home">Home</a><a href="#menu">Menu</a><a href="#moments">Brew Moments</a><a href="#about">About</a>
        </div>
        <button className="order-btn" onClick={goToMenu}>Order Now {cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
      </nav>

      <main id="home" className="hero">
        <div className="hero-content">
          <p className="eyebrow">COFFEE • FOOD • MOMENTS</p>
          <h1>Good coffee.<br /><span>Good moments.</span></h1>
          <p className="hero-description">Your cozy corner for coffee, conversations, delicious food and unforgettable moments.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={goToMenu}>Explore Menu →</button>
            <button className="secondary-btn" onClick={goToAbout}>Our Story</button>
          </div>
        </div>
        <div className="hero-photo"><img src="/bythebrew.webp" alt="By The Brew Cafe" /><div className="hero-photo-label"><span>01</span><span>BY THE BREW</span></div></div>
      </main>

      <section className="intro" id="about">
        <p className="section-label">WELCOME TO BY THE BREW</p>
        <h2>More than just<br /><span>a cup of coffee.</span></h2>
        <p>Come for the coffee, stay for the conversations. Discover your new favourite spot for food, friends and good vibes.</p>
      </section>

      <section className="menu-section" id="menu">
        <div className="menu-heading"><div><p className="section-label dark-label">FROM THE BREW BAR</p><h2>Something for<br /><span>every mood.</span></h2></div><button className="view-menu-btn" onClick={() => setSelectedCategory("All")}>View Full Menu →</button></div>
        <div className="menu-categories">{categories.map((category) => <button key={category} className={`category ${selectedCategory === category ? "active" : ""}`} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div>
        <div className="menu-grid">
          {filteredItems.map((item) => <div className="menu-card" key={item.id}>
            <div className="food-image"><img src={item.image} alt={item.name} /><button className="favorite" type="button" aria-label={`Favorite ${item.name}`}>♡</button></div>
            <div className="menu-card-content"><p className="food-category">{item.category}</p><h3>{item.name}</h3><p className="food-description">{item.description}</p><div className="food-bottom"><span className="food-price">₹{item.price}</span><button className="add-btn" type="button" onClick={() => addToCart(item)} aria-label={`Add ${item.name} to cart`}>+</button></div></div>
          </div>)}
        </div>
        {filteredItems.length === 0 && <div className="empty-menu">No items found in this category.</div>}
      </section>

      <section className="moments-section" id="moments">
        <div className="moments-heading"><p className="section-label">BREW MOMENTS</p><h2>Good coffee.<br /><span>Good company.</span></h2></div>
        <div className="moments-grid">
          {moments.map((moment, index) => <div className="moment-card" key={moment.id}>
            <img src={moment.image} alt={moment.title} />
            <div className="moment-overlay"><span>{String(index + 1).padStart(2, "0")}</span><h3>{moment.title}</h3>{moment.name && <p className="moment-byline">by {moment.name}</p>}</div>
          </div>)}
          <button className="add-moment-card" type="button" onClick={() => setShowMomentForm(true)}><span>＋</span><strong>ADD YOUR OWN MOMENT</strong><small>Share a little piece of your Brew experience.</small></button>
        </div>
      </section>

      {cartCount > 0 && <div className="cart-bar"><div><strong>{cartCount} item{cartCount > 1 ? "s" : ""}</strong><span> added to your order</span></div><div className="cart-bar-actions"><button type="button" onClick={goToMenu}>Continue Ordering →</button><button className="checkout-trigger" type="button" onClick={() => setShowCheckout(true)}>Checkout →</button></div></div>}

      <section className="menu-cta"><p className="section-label">CAN'T DECIDE?</p><h2>Let your mood<br /><span>choose for you.</span></h2><button className="primary-btn" onClick={goToMenu}>Find My Brew →</button></section>

      <footer><div className="footer-logo">BY THE BREW<span>.</span></div><p>Coffee • Food • Conversations</p><p className="copyright">© 2026 By The Brew</p></footer>

      {showCheckout && <div className="modal-backdrop" onClick={() => !orderPlaced && setShowCheckout(false)}>
        <div className="checkout-modal" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" onClick={() => setShowCheckout(false)}>×</button>
          {!orderPlaced ? <>
            <p className="section-label">CHECKOUT</p><h2>Complete your<br /><span>order.</span></h2>
            <div className="checkout-items">{cart.map((item) => <div className="checkout-item" key={item.id}><div><strong>{item.name}</strong><span>₹{item.price} × {item.quantity}</span></div><b>₹{item.price * item.quantity}</b></div>)}</div>
            <div className="checkout-total"><span>Total</span><strong>₹{cartTotal}</strong></div>
            <form className="checkout-form" onSubmit={submitOrder}>
              <label>Name<input name="name" value={customerDetails.name} onChange={handleCustomerChange} placeholder="Your name" required /></label>
              <label>Phone<input name="phone" value={customerDetails.phone} onChange={handleCustomerChange} placeholder="Your phone number" required /></label>
              <label>Order Type<select name="orderType" value={customerDetails.orderType} onChange={handleCustomerChange}><option value="Dine-in">Dine-in</option><option value="Takeaway">Takeaway</option></select></label>
              {customerDetails.orderType === "Dine-in" && <label>Table Number<input type="text" name="tableNo" value={customerDetails.tableNo} onChange={handleCustomerChange} placeholder="Enter your table number" required /></label>}
              <button className="place-order-btn" type="submit">Place Order →</button>
            </form>
          </> : <div className="order-success"><div className="success-icon">✓</div><p className="section-label">ORDER RECEIVED</p><h2>Thank you,<br /><span>{customerDetails.name}.</span></h2><p>Your {customerDetails.orderType.toLowerCase()} order has been received{customerDetails.orderType === "Dine-in" ? ` for Table ${customerDetails.tableNo}.` : "."}</p><button className="primary-btn" onClick={resetOrder}>Done</button></div>}
        </div>
      </div>}

      {showMomentForm && <div className="modal-backdrop" onClick={() => setShowMomentForm(false)}>
        <div className="moment-modal" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" onClick={() => setShowMomentForm(false)}>×</button>
          <p className="section-label">YOUR BREW MOMENT</p><h2>Share your<br /><span>moment.</span></h2>
          <form className="moment-form" onSubmit={addMoment}>
            <label>Upload Photo<input type="file" accept="image/*" onChange={handleMomentImage} required /></label>
            {momentImage && <img className="moment-preview" src={momentImage} alt="Moment preview" />}
            <label>Moment Title<input value={momentTitle} onChange={(event) => setMomentTitle(event.target.value)} placeholder="e.g. Sunday Coffee" required /></label>
            <label>Your Name <span>(optional)</span><input value={momentName} onChange={(event) => setMomentName(event.target.value)} placeholder="Your name" /></label>
            <button className="place-order-btn" type="submit">Add My Moment →</button>
          </form>
        </div>
      </div>}
    </div>
  );
}

export default App;
