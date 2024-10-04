const storeApi = "https://fakestoreapi.com";

let DownloadMoreBtn = document.querySelector(".download-more");
let n = 6;

let searchingRequest = `?limit=${n}`;

getProducts(searchingRequest);

DownloadMoreBtn.addEventListener("click", (event) => {
  event.preventDefault();
  n = n + 6;
  searchingRequest = `?limit=${n}`;
  getProducts(searchingRequest);
});

let categoriesCards = Array.from(
  document.querySelectorAll(".categories-cards")
);
let productCat = "";

categoriesCards.forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    let target = event.target;
    let product = target.closest(".categories-cards");
    let productCat = product.dataset.categories;
    searchingRequest = `/category/${productCat}`;
    getProducts(searchingRequest);
  });
});
async function getCategories() {
  try {
    const response = await fetch(`${storeApi}/products/categories`);
    if (!response.ok) throw new Error("Network response was not ok");
    const categories = await response.json();
    displayCategories(categories);
  } catch (error) {
    showMessage("Error fetching categories: " + error.message, "error");
  }
}
getCategories();

function displayCategories(categories) {
  const categoriesList = document.getElementById("categorieslist");
  categoriesList.innerHTML = `<option value="select">Please select a category</option>`;
  categories.forEach((category) => {
    const categoryOption = document.createElement("option");
    categoryOption.value = `${category}`;
    categoryOption.innerHTML = `${category}`;
    categoriesList.appendChild(categoryOption);
  });
}
document
  .getElementById("categorieslist")
  .addEventListener("change", function () {
    const selectedValue = this.value;
    if (this.value === "select") {
      searchingRequest = `?limit=${n}`;
      getProducts(searchingRequest);
    } else{
      searchingRequest = `/category/${selectedValue}`;
      getProducts(searchingRequest);
    }

  });

async function getProducts() {
  try {
    const response = await fetch(`${storeApi}/products${searchingRequest}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    showMessage("Error fetching products: " + error.message, "error");
  }
}

function displayProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";
    productElement.innerHTML = `
                  <img src="/img/garbage.svg" class ="delete-product" onclick="deleteProduct(${product.id})" alt="garbage" /></button>
                  <img class ="product-img" src="${product.image}" alt="${product.title}">
                  <h3>${product.title}</h3>
                  <p class ="product-price">$${product.price}</p>
                  `;
    productList.appendChild(productElement);
  });
}

async function addProduct(event) {
  event.preventDefault();
  const newProduct = {
    title: document.getElementById("productTitle").value,
    price: parseFloat(document.getElementById("productPrice").value),
    description: document.getElementById("productDescription").value,
    image: document.getElementById("productImage").value,
    category: document.getElementById("productCategory").value,
  };
  try {
    const response = await fetch(`${storeApi}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const addedProduct = await response.json();
    showMessage("Product added successfully");
    getProducts();
    document.getElementById("addProductForm").reset();
  } catch (error) {
    showMessage("Error adding product: " + error.message, "error");
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${storeApi}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Network response was not ok");
    showMessage("Product deleted successfully");
    getProducts();
  } catch (error) {
    showMessage("Error deleting product: " + error.message, "error");
  }
}

function showMessage(message, type = "success") {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = type;
  messageElement.style.display = "block";
  setTimeout(() => (messageElement.style.display = "none"), 5000);
}

document
  .getElementById("addProductForm")
  .addEventListener("submit", addProduct);
getProducts();
