// Main JavaScript for Unique Gifts Website

let currentCategory = 'frames';
let currentProduct = null;
let uploadedImage = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load initial products
    loadProducts('frames');
    
    // Setup event listeners
    setupEventListeners();
    
    // Update cart count
    updateCartCount();
}

function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            switchCategory(category);
        });
    });
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('customizeModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    
    // Frame size change
    document.getElementById('frameSize').addEventListener('change', updatePrice);
    
    // Add to cart button
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
}

function switchCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Load products for selected category
    loadProducts(category);
}

function loadProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    const categoryProducts = products[category];
    
    productsGrid.innerHTML = '';
    
    categoryProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₹${product.price}</p>
            <button class="customize-btn" onclick="openCustomizationModal('${product.id}')">
                Customize
            </button>
        </div>
    `;
    
    return card;
}

function openCustomizationModal(productId) {
    // Find the product
    let product = null;
    for (let category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    currentProduct = product;
    
    // Reset form
    document.getElementById('imageUpload').value = '';
    document.getElementById('previewImg').style.display = 'none';
    document.getElementById('uploadText').style.display = 'block';
    document.getElementById('frameSize').value = 'Square';
    document.getElementById('personalMessage').value = '';
    uploadedImage = null;
    
    // Update base price
    document.getElementById('basePrice').textContent = product.price;
    updatePrice();
    
    // Show modal
    document.getElementById('customizeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('customizeModal').style.display = 'none';
    currentProduct = null;
    uploadedImage = null;
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedImage = e.target.result;
            const previewImg = document.getElementById('previewImg');
            previewImg.src = uploadedImage;
            previewImg.style.display = 'block';
            document.getElementById('uploadText').style.display = 'none';
        };
        
        reader.readAsDataURL(file);
    }
}

function updatePrice() {
    if (!currentProduct) return;
    
    const frameSize = document.getElementById('frameSize').value;
    const basePrice = currentProduct.price;
    const sizeExtra = sizePricing[frameSize];
    const total = basePrice + sizeExtra;
    
    document.getElementById('sizeExtra').textContent = sizeExtra;
    document.getElementById('totalPrice').textContent = total;
}

function addToCart() {
    if (!currentProduct) return;
    
    const frameSize = document.getElementById('frameSize').value;
    const message = document.getElementById('personalMessage').value;
    const totalPrice = parseInt(document.getElementById('totalPrice').textContent);
    
    // Create cart item
    const cartItem = {
        id: Date.now().toString(),
        productId: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        totalPrice: totalPrice,
        image: currentProduct.image,
        frameSize: frameSize,
        message: message,
        customImage: uploadedImage,
        quantity: 1
    };
    
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success notification
    showNotification('Product added to cart!', 'success');
    
    // Close modal
    closeModal();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = count;
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}