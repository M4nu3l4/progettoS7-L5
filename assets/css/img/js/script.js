/*home-page*/
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('_id');
const form = document.getElementById('product-form');
const deleteBtn = document.getElementById('delete-btn');

//   dati per la modifica
if (productId) {
    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            document.getElementById('imageUrl').value = product.imageUrl;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                updateProduct(productId);
            });

            deleteBtn.addEventListener('click', () => {
                deleteProduct(productId);
            });
        });
} else {

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        createProduct();
    });
}

// creo un prodotto
function createProduct() {
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        imageUrl: document.getElementById('imageUrl').value
    };

    fetch('https://striveschool-api.herokuapp.com/api/product/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            alert('Prodotto aggiunto!');
            window.location.href = 'index.html';
        });
}

//  aggiorno un prodotto
function updateProduct(_id) {
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        imageUrl: document.getElementById('imageUrl').value
    };

    fetch(`https://striveschool-api.herokuapp.com/api/product/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            alert('Prodotto aggiornato!');
            window.location.href = 'index.html';
        });
}

//  elimina un prodotto
function deleteProduct(id) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
        fetch(`https://striveschool-api.herokuapp.com/api/product/${_id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                alert('Prodotto eliminato!');
                window.location.href = 'index.html';
            });
    }
}