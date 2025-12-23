// Checkout JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    setupCheckoutForm();
});

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const orderItemElement = createOrderItemElement(item);
        orderItemsContainer.appendChild(orderItemElement);
    });
    
    updateOrderTotals();
}

function createOrderItemElement(item) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    const imageSrc = item.customImage || item.image;
    
    orderItem.innerHTML = `
        <img src="${imageSrc}" alt="${item.name}" class="order-item-image">
        <div class="order-item-details">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-quantity">Qty: ${item.quantity} | Size: ${item.frameSize}</div>
        </div>
        <div class="order-item-price">₹${item.totalPrice * item.quantity}</div>
    `;
    
    return orderItem;
}

function updateOrderTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const subtotal = cart.reduce((total, item) => {
        return total + (item.totalPrice * item.quantity);
    }, 0);
    
    const delivery = 50;
    const total = subtotal + delivery;
    
    document.getElementById('orderSubtotal').textContent = subtotal;
    document.getElementById('orderTotal').textContent = total;
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            pincode: document.getElementById('pincode').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value
        };
        
        // Process order
        processOrder(formData);
    });
}

function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    
    if (!fullName || !phone || !address || !city || !pincode) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
        showNotification('Please enter a valid 10-digit phone number', 'error');
        return false;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
        showNotification('Please enter a valid 6-digit pincode', 'error');
        return false;
    }
    
    return true;
}

function processOrder(formData) {
    // Generate unique order ID
    const orderId = generateOrderId();
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate total
    const subtotal = cart.reduce((total, item) => {
        return total + (item.totalPrice * item.quantity);
    }, 0);
    const total = subtotal + 50;
    
    // Create order object
    const order = {
        orderId: orderId,
        customerDetails: formData,
        items: cart,
        subtotal: subtotal,
        delivery: 50,
        total: total,
        orderDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save order to localStorage (for demo purposes)
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success modal
    showSuccessModal(orderId, formData, cart, total);
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
}

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `UG${timestamp}${random}`;
}

function showSuccessModal(orderId, customerDetails, items, total) {
    // Set order ID
    document.getElementById('orderId').textContent = orderId;
    
    // Show modal
    document.getElementById('successModal').style.display = 'block';
    
    // Setup WhatsApp button
    const whatsappBtn = document.getElementById('whatsappBtn');
    whatsappBtn.onclick = function() {
        shareOnWhatsApp(orderId, customerDetails, items, total);
    };
}

function shareOnWhatsApp(orderId, customerDetails, items, total) {
    // Build product details string
    let productDetails = '';
    items.forEach(item => {
        productDetails += `\n• ${item.name} (Qty: ${item.quantity}, Size: ${item.frameSize}) - ₹${item.totalPrice * item.quantity}`;
    });
    
    // Build WhatsApp message
    const message = `New Order Received\n\nOrder ID: ${orderId}\nName: ${customerDetails.fullName}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}\n\nProduct Details: ${productDetails}\n\nTotal Amount: ₹${total}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        if (element) {
            element.textContent = count;
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const successModal = document.getElementById('successModal');
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});