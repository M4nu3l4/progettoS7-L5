// Costante API
const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const API_HEADERS = {
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_TOKEN" 
};

//  popolare la home
const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL, { headers: API_HEADERS });
    if (!response.ok) throw new Error("Errore nel caricamento dei prodotti");
    const products = await response.json();

    const row = document.querySelector(".row.d-flex.flex-row.flex-wrap.justify-content-evenly");
    row.innerHTML = "";

    products.forEach((product) => {
      row.innerHTML += `
        <div class="card" style="width: 18rem;">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-dark"><a href="details.html?id=${product._id}" class="card-link text-white">Scopri di più</a></button>
            <button type="button" class="btn btn-dark"><a href="bo.html?id=${product._id}" class="card-link text-white">Modifica</a></button>
          </div>
        </div>`;
    });
  } catch (error) {
    console.error(error);
  }
};

//  dettagli di un prodotto
const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`${API_URL}${productId}`, { headers: API_HEADERS });
    if (!response.ok) throw new Error("Errore nel caricamento del prodotto");
    const product = await response.json();

    document.querySelector(".card-title").innerText = product.name;
    document.querySelector(".card-img-top").src = product.imageUrl;
    document.querySelector(".card-text").innerText = product.description;
  } catch (error) {
    console.error(error);
  }
};

//  salvo un nuovo prodotto o modifico
const saveProduct = async (productId) => {
  try {
    const product = {
      name: document.querySelector("#protottoNome").value,
      brand: document.querySelector("[name='Brand']").value,
      price: parseFloat(document.querySelector("[name='Prezzo']").value),
      imageUrl: document.querySelector("[name='URL Immagine']").value,
      description: document.querySelector("[name='Descrizione']").value,
    };

    const method = productId ? "PUT" : "POST";
    const url = productId ? `${API_URL}${productId}` : API_URL;

    const response = await fetch(url, {
      method: method,
      headers: API_HEADERS,
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Errore nel salvataggio del prodotto");
    alert("Prodotto salvato con successo!");
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
  }
};

// cancello un prodotto
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}${productId}`, {
      method: "DELETE",
      headers: API_HEADERS,
    });

    if (!response.ok) throw new Error("Errore nella cancellazione del prodotto");
    alert("Prodotto cancellato con successo!");
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
  }
};


if (window.location.pathname.endsWith("index.html")) {
  fetchProducts();
} else if (window.location.pathname.endsWith("details.html")) {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (productId) fetchProductDetails(productId);
} else if (window.location.pathname.endsWith("bo.html")) {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (productId) {
  
    fetchProductDetails(productId).then((product) => {
      document.querySelector("#protottoNome").value = product.name;
      document.querySelector("[name='Brand']").value = product.brand;
      document.querySelector("[name='Prezzo']").value = product.price;
      document.querySelector("[name='URL Immagine']").value = product.imageUrl;
      document.querySelector("[name='Descrizione']").value = product.description;
    });
  }

  document.querySelector(".btn-outline-success").addEventListener("click", () => saveProduct(productId));
  document.querySelector(".btn-outline-danger").addEventListener("click", () => {
    if (confirm("Sei sicuro di voler cancellare il prodotto?")) deleteProduct(productId);
  });
}
