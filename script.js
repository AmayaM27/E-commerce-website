// Handle Add to Cart
let buttons = document.querySelectorAll(".add-to-cart");

buttons.forEach(btn => {
  btn.addEventListener("click", function () {
    let name = this.dataset.name;
    let price = parseInt(this.dataset.price);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists
    let existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: name, price: price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
  });
});

// Show Cart Items (for cart.html)
if (document.querySelector(".cart-items")) {
  function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.querySelector(".cart-items");
    let total = 0;
    container.innerHTML = ""; // clear old content

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      container.innerHTML += `
        <div class="cart-item">
          <div class="cart-details">
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>
            <p>Quantity: 
              <button class="qty-btn decrease" data-index="${index}">-</button>
              ${item.quantity}
              <button class="qty-btn increase" data-index="${index}">+</button>
            </p>
          </div>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
    });

    document.querySelector(".cart-total h3").innerText = `Total: ₹${total}`;

    // Attach remove buttons
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        let idx = this.dataset.index;
        cart.splice(idx, 1); // remove item
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // refresh UI
      });
    });

    // Attach quantity buttons
    document.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        let idx = this.dataset.index;
        if (btn.classList.contains("increase")) {
          cart[idx].quantity += 1;
        } else if (btn.classList.contains("decrease") && cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    // Attach clear cart button
    let clearBtn = document.querySelector(".clear-cart-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the cart?")) {
          localStorage.removeItem("cart"); // clear storage
          renderCart(); // refresh UI
        }
      });
    }
  }

  renderCart(); // initial render
}



// Detect if it's the signup form by checking if confirm-password exists
const signupForm = document.querySelector(".login-box #confirm-password");
if (signupForm) {
  // The parent form
  const form = signupForm.closest("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirm-password").value.trim();

    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    // Save user
    localStorage.setItem("flipzonUser", JSON.stringify({ name, email, password }));
    alert("✅ Sign Up Successful! Please login now.");

    window.location.href = "login.html"; // go to login page
  });
}

// Login functionality (if confirm-password not present)
const loginForm = document.querySelector(".login-box #password");
if (loginForm && !document.getElementById("confirm-password")) {
  const form = loginForm.closest("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let storedUser = JSON.parse(localStorage.getItem("flipzonUser"));

    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
      alert("❌ Invalid Email or Password!");
      return;
    }

    // Save login status
    localStorage.setItem("flipzonLoggedIn", true);
    localStorage.setItem("flipzonUserName", storedUser.name);

    alert(`✅ Welcome back, ${storedUser.name}!`);
    window.location.href = "index.html"; // go back home
  });
}