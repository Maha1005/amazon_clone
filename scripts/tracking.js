import { cart } from "../data/cart.js";
import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { getProduct, loadProducts } from "../data/products.js";

function renderOrders() {
  let html = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>`;

  orders.forEach((order) => {
    order.products.forEach((product) => {
      const matchingProduct = getProduct(product.productId) || {};

      const orderDate = dayjs(order.orderTime);
      const estimatedDate = dayjs(product.estimatedDeliveryTime);
      const totalDeliveryDays = estimatedDate.diff(orderDate, "day");
      const today = dayjs();
      const daysPassed = today.diff(orderDate, "day");

      let progressWidth = "30%";
      let preparingColor = "rgb(6, 125, 98)";
      let shippedColor = "black";
      let deliveredColor = "black";

      if (daysPassed >= totalDeliveryDays) {
        progressWidth = "100%";
        preparingColor = "black";
        shippedColor = "black";
        deliveredColor = "rgb(6, 125, 98)";
      } else if (daysPassed >= totalDeliveryDays * 0.5) {
        progressWidth = "70%";
        preparingColor = "black";
        shippedColor = "rgb(6, 125, 98)";
        deliveredColor = "black";
      } else if (daysPassed >= totalDeliveryDays * 0.3) {
        progressWidth = "50%";
        preparingColor = "black";
        shippedColor = "black";
        deliveredColor = "rgb(6, 125, 98)";
      }

      const formattedDate = estimatedDate.isValid()
        ? estimatedDate.format("D MMMM YYYY")
        : "Unknown";

      html += `<div class="order-container">
        <div class="delivery-date">
          Arriving on ${formattedDate}
        </div>

        <div class="product-info">
          ${matchingProduct.name || "Unknown Product"}
        </div>

        <div class="product-info">
          Quantity: ${product.quantity}
        </div>

        <img class="product-image" src="${
          matchingProduct.image || "images/default.png"
        }">

        <div class="progress-labels-container">
          <div class="progress-label" style="color: ${preparingColor};">
            Preparing
          </div>
          <div class="progress-label" style="color: ${shippedColor};">
            Shipped
          </div>
          <div class="progress-label" style="color: ${deliveredColor};">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressWidth};"></div>
        </div>
      </div>`;
    });
  });

  document.querySelector(".order-tracking").innerHTML = html;
}

loadProducts(() => {
  renderOrders();
  updateCartQuantity();
});

function updateCartQuantity() {
  let cartQuantity = cart.reduce((sum, cartitem) => sum + cartitem.quantity, 0);
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}
updateCartQuantity();
