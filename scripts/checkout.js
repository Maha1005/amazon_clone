import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, products } from "../data/products.js";
import { loadCart } from "../data/cart.js";
//import "../data/backend-practice.js";

Promise.all([
  new Promise((resolve) => {
    loadProducts(() => {
      resolve("value1");
    });
  }),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
])
  .then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
  })
  .catch(() => {
    console.log("Unexpected error.Please try again later");
  });

/*new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
})
  .then(() => {
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });*/
/*
loadProducts(() => {
  renderOrderSummary();
  renderPaymentSummary();
});*/
