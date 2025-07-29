// product infoo
const products = [
  {
    id: 1,
    name: "Premium Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    icon: "🎧",
    image: "img/product2.png", // Added image path
    hasImage: true,
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Advanced fitness tracking and smart notifications",
    price: 299.99,
    icon: "⌚",
    image: "img/product4.png", 
    hasImage: true,
  },
  {
    id: 3,
    name: "Laptop",
    description: "Durable and stylish laptop for professionals",
    price: 79.99,
    icon: "💻",
    image: "img/product1.png",
    hasImage: true,
  },
  {
    id: 4,
    name: "Wireless Speaker",
    description: "Portable speaker with amazing sound quality",
    price: 149.99,
    icon: "🔊",
    image: "img/product6.png", 
    hasImage: true,
  },
  {
    id: 5,
    name: "Gaming Mouse",
    description: "Precision gaming mouse with RGB lighting",
    price: 89.99,
    icon: "🖱️",
    image: "img/product3.png", 
    hasImage: true,
  },
  {
    id: 6,
    name: "Phone Case",
    description: "Protective case with elegant design",
    price: 29.99,
    icon: "📱",
    image: "img/product5.png", 
    hasImage: true,
  },
]

// Shopping cart array
let cart = []

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage()
  loadProducts()
  updateCartCount()
  initializeEventListeners()
  initializeContactForm()
  initializeScrollAnimations()
})

// Update the loadProducts function to use images instead of videos
function loadProducts() {
  const productsGrid = document.getElementById("productsGrid")
  productsGrid.innerHTML = ""

  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"

    const mediaContent = product.hasImage
      ? `<img src="${product.image}" alt="${product.name}" class="product-image-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="image-fallback" style="display: none;">
           <span style="font-size: 4rem;">${product.icon}</span>
         </div>`
      : `<span style="font-size: 4rem;">${product.icon}</span>`

    productCard.innerHTML = `
      <div class="product-image">
        ${mediaContent}
        <div class="image-overlay">
          <div class="overlay-content">
            <i class="fas fa-eye"></i>
            <span>View Details</span>
          </div>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `
    productsGrid.appendChild(productCard)
  })

  // Initialize image interactions after products are loaded
  initializeImageInteractions()
}

function initializeImageInteractions() {
  const productImages = document.querySelectorAll(".product-image-img")

  productImages.forEach((image) => {
    const overlay = image.parentElement.querySelector(".image-overlay")
    const productCard = image.closest(".product-card")

    // Show overlay on hover
    productCard.addEventListener("mouseenter", () => {
      if (overlay) overlay.style.opacity = "1"
    })

    productCard.addEventListener("mouseleave", () => {
      if (overlay) overlay.style.opacity = "0"
    })

    // Handle image loading
    image.addEventListener("load", () => {
      image.style.opacity = "1"
    })

    // Handle image errors - try different extensions
    image.addEventListener("error", () => {
      const fallback = image.nextElementSibling
      if (fallback && fallback.classList.contains("image-fallback")) {
        image.style.display = "none"
        fallback.style.display = "flex"
        fallback.style.alignItems = "center"
        fallback.style.justifyContent = "center"
        fallback.style.height = "100%"
        fallback.style.width = "100%"
      }
    })

    // Click to view larger image
    
  })
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  updateCartCount()
  updateCartDisplay()
  saveCartToStorage() // Save to localStorage

  // Add visual feedback
  const button = event.target
  const originalText = button.textContent
  button.textContent = "Added!"
  button.style.background = "#2ed573"

  setTimeout(() => {
    button.textContent = originalText
    button.style.background = ""
  }, 1000)
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartCount()
  updateCartDisplay()
  saveCartToStorage() // Save to localStorage
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

// Update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")
  const totalAmount = document.getElementById("totalAmount")

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `
    cartTotal.style.display = "none"
    return
  }

  cartItems.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `
    cartItems.appendChild(cartItem)
    total += item.price * item.quantity
  })

  totalAmount.textContent = total.toFixed(2)
  cartTotal.style.display = "block"
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  const overlay = document.getElementById("overlay")

  cartSidebar.classList.toggle("open")
  overlay.classList.toggle("active")

  if (cartSidebar.classList.contains("open")) {
    updateCartDisplay()
  }
}

// Checkout function with receipt modal
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  showReceiptModal()

  // Clear cart after showing receipt
  setTimeout(() => {
    cart = []
    updateCartCount()
    updateCartDisplay()
    saveCartToStorage()
    toggleCart()
  }, 500)
}

// Initialize event listeners
function initializeEventListeners() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Close cart when clicking outside
  document.addEventListener("click", (e) => {
    const cartSidebar = document.getElementById("cartSidebar")
    const cartIcon = document.querySelector(".cart-icon")

    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains("open")) {
      toggleCart()
    }
  })

  // Handle escape key to close cart
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const cartSidebar = document.getElementById("cartSidebar")
      if (cartSidebar.classList.contains("open")) {
        toggleCart()
      }
    }
  })

  // Close modal when clicking outside
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("receiptModal")
    if (e.target === modal) {
      closeReceiptModal()
    }
  })

  // Close modal with escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("receiptModal")
      if (modal.classList.contains("active")) {
        closeReceiptModal()
      }
    }
  })
}

// Utility function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Function to save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem("modernshop-cart", JSON.stringify(cart))
}

// Function to load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("modernshop-cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartCount()
  }
}

// Show receipt modal
function showReceiptModal() {
  const modal = document.getElementById("receiptModal")
  const orderNumber = generateOrderNumber()
  const orderDate = new Date().toLocaleDateString()

  
  document.getElementById("orderNumber").textContent = orderNumber
  document.getElementById("orderDate").textContent = orderDate

  
  populateReceiptItems()


  calculateReceiptTotals()
  modal.classList.add("active")
}

// Close receipt modal
function closeReceiptModal() {
  const modal = document.getElementById("receiptModal")
  modal.classList.remove("active")
}

// Generate random order number 874378
function generateOrderNumber() {
  return "MS" + Date.now().toString().slice(-8)
}


function populateReceiptItems() {
  const receiptItems = document.getElementById("receiptItems")
  receiptItems.innerHTML = ""

  cart.forEach((item) => {
    const receiptItem = document.createElement("div")
    receiptItem.className = "receipt-item"
    receiptItem.innerHTML = `
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
      </div>
      <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `
    receiptItems.appendChild(receiptItem)
  })
}

// Calculate receipt totals
function calculateReceiptTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.085 // 8.5% tax
  const tax = subtotal * taxRate
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  document.getElementById("receiptSubtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("receiptTax").textContent = `$${tax.toFixed(2)}`
  document.getElementById("receiptShipping").textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`
  document.getElementById("receiptTotal").textContent = `$${total.toFixed(2)}`
}

// Print receipt function
function printReceipt() {
  const printContent = document.querySelector(".receipt-modal").innerHTML
  const originalContent = document.body.innerHTML

  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      ${printContent}
    </div>
  `

  window.print()
  document.body.innerHTML = originalContent

  
  
}


// Enhanced scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running"
      }
    })
  }, observerOptions)

  document.querySelectorAll(".feature-item, .contact-item, .product-card").forEach((el) => {
    el.style.animationPlayState = "paused"
    observer.observe(el)
  })
}
