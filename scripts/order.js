import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../data/cart.js";
import { formatCurrency } from "./utils/currencyUtility.js";
import { loadProducts, getProduct } from "../data/products.js";

function renderOrders() {
  //  Clear previous orders before rendering to prevent duplicates
  const ordersGrid = document.querySelector(".orders-grid");
  if (ordersGrid) {
    ordersGrid.innerHTML = "";
  }

  let html = "";

  //  Ensure each order appears **only once**
  orders.forEach((order) => {
    const formattedDate = dayjs(order.orderTime.estimatedDeliveryTime).format(
      "D MMMM YYYY"
    );

    html += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formattedDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
    `;

    //  Loop through products inside the order correctly
    order.products.forEach((product) => {
      const matchingProduct = getProduct(product.productId) || {};

      html += `
        <div class="product-image-container">
          <img src="${matchingProduct.image || "images/default.png"}" alt="${
        matchingProduct.name || "Unknown Product"
      }">
        </div>

        <div class="product-details">
          <div class="product-name">${
            matchingProduct.name || "Unknown Product"
          }</div>
          <div class="product-delivery-date">
            Arriving on: ${
              product.estimatedDeliveryTime
                ? dayjs(product.estimatedDeliveryTime).format("D MMMM YYYY")
                : "Unknown"
            }
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
      `;
    });

    html += `</div></div>`; // Closing order-details-grid and order-container
  });

  // Insert new orders after clearing previous ones
  if (ordersGrid) {
    ordersGrid.innerHTML = html;
  }
}

//  Ensure `renderOrders()` is executed **only once** after loading products
loadProducts(() => {
  renderOrders();
  updateCartQuantity();
});

//  Update cart quantity function
function updateCartQuantity() {
  let cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartQuantityElement = document.querySelector(".js-cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}
console.log(orders);
