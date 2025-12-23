 Unique Gifts – Online Gifting Website
A complete frontend-only web application for customizing and ordering personalized gifts online.

 Features
 Product Categories: Photo Frames, Gifts, Surprise Videos
 Customization: Upload photos, select sizes, add messages
 Shopping Cart: Full cart functionality with localStorage
 Checkout: User details form with simulated UPI payment
 Order Confirmation: Unique ID with WhatsApp sharing
Responsive Design: Works on all devices
Quick Setup
Download/Clone
bash

git clone https://github.com/yourusername/unique-gifts-html.git
cd unique-gifts-html
Add Images
Place your images in assets/images/
Required: hero-banner.jpg, frame1-3.jpg, gift1-3.jpg, video1-3.jpg
Run
Open index.html in browser
Or use local server: python -m http.server 8000
file- Structure

unique-gifts-html/
├── index.html          # Home page
├── cart.html           # Cart page
├── checkout.html       # Checkout page
├── css/
│   ├── style.css       # Main styles
│   └── animations.css  # Animations
├── js/
│   ├── data.js         # Product data
│   ├── main.js         # Main logic
│   ├── cart.js         # Cart functionality
│   └── checkout.js     # Checkout process
└── assets/images/      # Your images here
 How to Use
Browse products by category
Click "Customize" to upload photo & add message
Add to cart
Checkout with delivery details
Receive order ID & share on WhatsApp
 Tech Stack
HTML5 - Semantic markup
CSS3 - Modern styling with animations
Vanilla JavaScript - No frameworks
LocalStorage - Cart persistence
 Browser Support
Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

📝 Note
Frontend-only demo. No real payment processing. UPI payment is simulated.
