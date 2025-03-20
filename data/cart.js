export let cart = JSON.parse(localStorage.getItem("cart"));
if (!cart) {
  cart = [];
}
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
export function addToCart(productId) {
  let matchingItem;
  const val = document.querySelector(`.js-quantity-selector-${productId}`) || 1;
  const Num_of_Quantity = Number(val.value) || 1;
  console.log(Num_of_Quantity);
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  if (matchingItem) {
    matchingItem.quantity += Num_of_Quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: Num_of_Quantity,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}
export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
}

export function clearCart() {
  cart.length = 0;
  localStorage.removeItem("cart");
}
