const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzVjM2ViMmQyMjA3MTAwMTVkZTMxOTMiLCJpYXQiOjE3MzQwOTg2MTAsImV4cCI6MTczNTMwODIxMH0.HJAcbY5E8kTMsC8zCDfdrpelFlnGVhyWudL3yvWXYoo";

document.addEventListener('DOMContentLoaded', () => {
    const prodottoNome = document.getElementById('prodottoNome');
    const prodottoBrand = document.getElementById('prodottoBrand');
    const prodottoPrezzo = document.getElementById('prodottoPrezzo');
    const prodottoImmagine = document.getElementById('prodottoImmagine');
    const prodottoDescrizione = document.getElementById('prodottoDescrizione');
    const salvaBtn = document.getElementById('salvaBtn');
    const cancellaBtn = document.getElementById('cancellaBtn');
    
    const detailsContainer = document.querySelector('.container');
    const productId = new URLSearchParams(window.location.search).get('id');

    //localStorage (index.html)
    function fetchProductsFromLocalStorage() {
        const storedProducts = localStorage.getItem('products');
        return storedProducts ? JSON.parse(storedProducts) : [];
    }

    // prodotto nel localStorage
    function saveProductToLocalStorage(product) {
        const products = fetchProductsFromLocalStorage();
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    //  eliminare un prodotto dal localStorage
    function deleteProductFromLocalStorage(id) {
        const products = fetchProductsFromLocalStorage();
        const updatedProducts = products.filter(product => product._id !== id);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    //localStorage (index.html)
    function renderProductsFromLocalStorage() {
        const products = fetchProductsFromLocalStorage();
        const productContainer = document.getElementById('productContainer');
        productContainer.innerHTML = ''; 
        products.forEach(product => {
            const productCard = `
                <div class="card" style="width: 18rem;">
                    <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-dark"><a href="details.html?id=${product._id}" class="card-link text-white">Scopri di più</a></button>
                        <button class="btn btn-dark"><a href="bo.html?id=${product._id}" class="card-link text-white">Modifica</a></button>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    }

    if (window.location.pathname === "/index.html") {
        renderProductsFromLocalStorage();  // Carica i prodotti dal localStorage
    }

    // nuovo prodotto (bo.html)
    salvaBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const newProduct = {
            _id: Date.now(),  
            name: prodottoNome.value,
            brand: prodottoBrand.value,
            price: parseFloat(prodottoPrezzo.value),
            imageUrl: prodottoImmagine.value,
            description: prodottoDescrizione.value,
        };

        // Salva il prodotto nel localStorage
        saveProductToLocalStorage(newProduct);

        alert('Prodotto salvato con successo!');
        window.location.href = 'index.html'; 
    });

    // Reset del form (bo.html)
    cancellaBtn.addEventListener('click', () => {
        prodottoNome.value = '';
        prodottoBrand.value = '';
        prodottoPrezzo.value = '';
        prodottoImmagine.value = '';
        prodottoDescrizione.value = '';
    });

    //  (details.html)
    if (productId) {
        fetchProductDetails(productId);
    }

    
    function fetchProductDetails(id) {
        const products = fetchProductsFromLocalStorage();
        const product = products.find(p => p._id == id);
        if (product) {
            renderProductDetails(product);
        } else {
            alert("Prodotto non trovato");
        }
    }

    //  (details.html)
    function renderProductDetails(product) {
        detailsContainer.innerHTML = `
            <div class="card">
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Brand: ${product.brand}</p>
                    <p class="card-text">Prezzo: €${product.price}</p>
                    <button class="btn btn-dark" onclick="window.location.href='bo.html?id=${product._id}'">Modifica</button>
                    <button class="btn btn-danger" id="deleteBtn">Elimina</button>
                </div>
            </div>
        `;
    
        document.getElementById('deleteBtn').addEventListener('click', () => deleteProduct(product._id));
    }
    

    // (details.html)
    function deleteProduct(id) {
        if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
            deleteProductFromLocalStorage(id);
            alert('Prodotto eliminato con successo');
            window.location.href = 'index.html';  
        }
    }
});

