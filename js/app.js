import { getProducts } from "./api.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from "./storage.js";

const productList = document.querySelector("#productList");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const categoryTabs = document.querySelector("#categoryTabs");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const errorBanner = document.querySelector("#errorBanner");
const errorMessage = document.querySelector("#errorMessage");
const retryBtn = document.querySelector("#retryBtn");

const cartBtn = document.querySelector("#cartBtn");
const cartCount = document.querySelector("#cartCount");
const cartPanel = document.querySelector("#cartPanel");
const closeCartBtn = document.querySelector("#closeCartBtn");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const clearCartBtn = document.querySelector("#clearCartBtn");

const state = {
  products: [],
  searchTerm: "",
  category: "all",
  sort: "default",
  cart: getCart()
};

function formatCategory(category) {
  return category.replace("men's", "Men's").replace("women's", "Women's");
}

function formatPrice(price) {
  return `₹${(Number(price) * 83).toFixed(2)}`;
}

function showLoading() {
  errorBanner.classList.add("hidden");
  emptyState.classList.add("hidden");

  productList.innerHTML = Array.from({ length: 8 }, () =>
    `<div class="skeleton" aria-hidden="true"></div>`
  );

  resultCount.textContent = "Loading products...";
}

function showError(message) {
  errorMessage.textContent = message;
  errorBanner.classList.remove("hidden");
  productList.innerHTML = "";
  resultCount.textContent = "Unable to load";
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    emptyState.classList.remove("hidden");
    resultCount.textContent = "0 products";
    return;
  }

  emptyState.classList.add("hidden");
  resultCount.textContent =
    `${products.length} product${products.length === 1 ? "" : "s"}`;

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${escapeHtml(product.title)}"
          loading="lazy"
        >
      </div>
      <div class="product-content">
        <p class="product-category">${escapeHtml(formatCategory(product.category))}</p>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <div class="product-bottom">
          <span class="price">${formatPrice(product.price)}</span>
          <button
            class="add-btn"
            type="button"
            data-action="add"
            data-id="${product.id}"
          >
            Add to Cart
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  productList.appendChild(fragment);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function getFilteredProducts() {
  let filtered = [...state.products];

  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(term)
    );
  }

  if (state.category !== "all") {
    filtered = filtered.filter(
      product => product.category === state.category
    );
  }

  switch (state.sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
}

function updateProducts() {
  renderProducts(getFilteredProducts());
}

function updateCategoryButtons() {
  document.querySelectorAll(".category-btn").forEach(button => {
    const isActive = button.dataset.category === state.category;
    button.classList.toggle("active", isActive);
  });
}

function updateCartUI() {
  cartCount.textContent = state.cart.length;
  cartItems.innerHTML = "";

  if (state.cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add a product to see it here.</p>
      </div>
    `;
    cartTotal.textContent = "₹0.00";
    return;
  }

  const fragment = document.createDocumentFragment();

  state.cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}">
      <div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${formatPrice(item.price)}</p>
      </div>
      <button
        class="remove-btn"
        type="button"
        data-action="remove"
        data-id="${item.id}"
      >
        Remove
      </button>
    `;

    fragment.appendChild(row);
  });

  cartItems.appendChild(fragment);

  const total = state.cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  cartTotal.textContent = formatPrice(total);
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.remove("hidden");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.add("hidden");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function loadProducts() {
  showLoading();

  try {
    state.products = await getProducts();
    updateProducts();
  } catch (error) {
    console.error(error);
    showError(
      "We couldn't connect to the product service. Check your internet connection and try again."
    );
  }
}

searchInput.addEventListener("input", event => {
  state.searchTerm = event.target.value.trim();
  updateProducts();
});

sortSelect.addEventListener("change", event => {
  state.sort = event.target.value;
  updateProducts();
});

categoryTabs.addEventListener("click", event => {
  const button = event.target.closest(".category-btn");
  if (!button) return;

  state.category = button.dataset.category;
  updateCategoryButtons();
  updateProducts();
});

productList.addEventListener("click", event => {
  const button = event.target.closest('[data-action="add"]');
  if (!button) return;

  const productId = Number(button.dataset.id);
  const product = state.products.find(item => item.id === productId);

  if (!product) return;

  state.cart = addToCart(product);
  updateCartUI();

  button.textContent = "Added ✓";
  setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 900);
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest('[data-action="remove"]');
  if (!button) return;

  const productId = Number(button.dataset.id);
  state.cart = removeFromCart(productId);
  updateCartUI();
});

clearCartBtn.addEventListener("click", () => {
  state.cart = clearCart();
  updateCartUI();
});

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

retryBtn.addEventListener("click", loadProducts);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

updateCategoryButtons();
updateCartUI();
loadProducts();
