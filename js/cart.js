// Cart JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartSummary();
    setupCartEventListeners();
});

function setupCartEventListeners() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;
    
    const imageSrc = item.customImage || item.image;
    
    cartItem.innerHTML = `
        <img src="${imageSrc}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-customization">
                Size: ${item.frameSize} | ${item.message ? 'With Message' : 'No Message'}
            </p>
            <p class="cart-item-price">₹${item.totalPrice}</p>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `;
    
    return cartItem;
}

function updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartSummary();
        updateCartCount();
    }
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    
    showNotification('Item removed from cart', 'success');
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const subtotal = cart.reduce((total, item) => {
        return total + (item.totalPrice * item.quantity);
    }, 0);
    
    const delivery = cart.length > 0 ? 50 : 0;
    const total = subtotal + delivery;
    
    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('delivery').textContent = delivery;
    document.getElementById('total').textContent = total;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update cart count function (reused from main.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = count;
    });
}