import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/currencyUtility.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let contenthtml = "";
  if (cart) {
    cart.forEach((cartItem) => {
      const productId = cartItem.productId;
      const matchingProduct = getProduct(productId);
      const deliveryOptionId = cartItem.deliveryOptionId;
      const deliveryOption = getDeliveryOption(deliveryOptionId);
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "day");

      const dateString = deliveryDate.format("dddd, MMMM D");
      contenthtml += `<div class="cart-item-container js-cart-item-container-${
        matchingProduct.id
      }">
            <div class="delivery-date">
              Delivery date:${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  "${matchingProduct.name}"
                </div>
                <div class="product-price">
                  "${formatCurrency(matchingProduct.priceCents)}"
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span>
                  </span>
                 
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct, cartItem)}
                </div>
            </div>
    </div>
  </div>
  </div>
  </div>`;
    });
    function deliveryOptionsHtml(matchingProduct, cartItem) {
      let html = "";
      deliveryOptions.forEach((deliveryOptions) => {
        const isChecked = deliveryOptions.id === cartItem.deliveryOptionId;
        const today = dayjs();
        const deliveryDate = today.add(deliveryOptions.deliveryDays, "day");

        const dateString = deliveryDate.format("dddd, MMMM D");
        console.log(dateString);
        const priceString =
          deliveryOptions.priceCents === 0
            ? "FREE"
            : `$${formatCurrency(deliveryOptions.priceCents)} -`;
        html += `
                <div class="delivery-option js-delivery-option" data-product-id="${
                  matchingProduct.id
                }"
                data-delivery-option-id="${deliveryOptions.id}">
                  <input type="radio" ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                     ${priceString}
                    </div>
                  </div>
                </div>`;
      });
      return html;
    }
  }
  document.querySelector(".js-order-summary").innerHTML = contenthtml;
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      renderPaymentSummary();
    });
  });
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
