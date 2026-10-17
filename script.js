// @ts-nocheck

// ---------- Food Data ----------
const foods = [
  { id: 1, name: "Party Jollof Rice", category: "rice", price: 4500, image: "jollof.jpg" },
  { id: 2, name: "Special Fried Rice", category: "rice", price: 5000, image: "friedrice.jpg" },
  { id: 3, name: "Egusi & Pounded Yam", category: "swallow", price: 4000, image: "egusi.jpg" },
  { id: 4, name: "Spicy Beef Suya", category: "protein", price: 3500, image: "suya.jpg" },
  { id: 5, name: "Classic Beef Burger", category: "protein", price: 6000, image: "burger.jpg" },
  { id: 6, name: "Pepperoni Pizza", category: "protein", price: 8500, image: "pizza.jpg" },
  { id: 7, name: "Chilled Chapman", category: "drinks", price: 1500, image: "chapman.jpg" },
  { id: 8, name: "Chocolate Cake Slice", category: "drinks", price: 2500, image: "cake.jpg" }
];

let cart = [];
const menuGrid = document.getElementById("menu-grid");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const cartCount = document.getElementById("cart-count");

// ---------- Render Menu ----------
function renderMenu(items) {
  menuGrid.innerHTML = "";
  items.forEach((food) => {
    menuGrid.innerHTML += `
      <div class="food-card">
        <img src="${food.image}" alt="${food.name}">
        <div class="food-info">
          <div class="food-name">${food.name}</div>
          <div class="food-price">₦${food.price.toLocaleString()}</div>
          <button class="add-to-cart" data-id="${food.id}">Add to Order</button>
        </div>
      </div>
    `;
  });
}

// ---------- Filter Menu ----------
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    
    const cat = e.target.dataset.cat;
    if (cat === "all") {
      renderMenu(foods);
    } else {
      renderMenu(foods.filter(f => f.category === cat));
    }
  });
});

// ---------- Cart Logic ----------
// Listen for clicks on the menu grid (Event Delegation)
menuGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (btn) {
    const id = Number(btn.dataset.id);
    addToCart(id);
  }
});

function addToCart(id) {
  const food = foods.find(f => f.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...food, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<li class="empty-text">Your cart is empty.</li>`;
  } else {
    // Notice 'index' is removed here since it wasn't used
    cart.forEach((item) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      count += item.qty;
      cartItems.innerHTML += `
        <li>
          <span>${item.name} (x${item.qty})</span>
          <span>₦${itemTotal.toLocaleString()}</span>
        </li>
      `;
    });
  }

  totalPrice.textContent = total.toLocaleString();
  cartCount.textContent = count;
}

// ---------- Checkout on WhatsApp ----------
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add items to your order first!");
    return;
  }

  // ⚠️ CHANGE THIS TO YOUR WHATSAPP NUMBER (No + sign, no spaces)
  const whatsappNumber = "2348124713885"; 
  const restaurantName = "TasteBudz";

  let message = `Hello ${restaurantName}! I would like to order:%0A%0A`;
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `• ${item.qty}x ${item.name} - ₦${itemTotal.toLocaleString()}%0A`;
  });

  message += `%0ATotal: ₦${total.toLocaleString()}%0A%0A`;
  message += `Please confirm my order. Thank you!`;

  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
});

// Initialize
renderMenu(foods);
updateCart();
