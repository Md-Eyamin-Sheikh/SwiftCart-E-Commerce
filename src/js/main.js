const API_URL = 'https://fakestoreapi.com/products';

// DOM Elements
const categoriesContainer = document.getElementById('categories');
const productsGrid = document.getElementById('products-grid');
const trendingProductsGrid = document.getElementById('trending-products-grid');
const productModal = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');

// State
// Cart State
let cart = [];

// DOM Elements (Cart)
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Initialize
async function init() {
    console.log('Main.js initialized');
    loadCart();
    
    if (categoriesContainer) {
        await fetchCategories();
    }
    if (productsGrid) {
        await fetchProducts();
    }
    if (trendingProductsGrid) {
        await fetchTrendingProducts();
    }
}

// --- Product & Category Functions ---

// Fetch Categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Render Categories
function renderCategories(categories) {
    if (!categoriesContainer) return;

    const allBtn = `<button onclick="handleCategoryClick('all')" class="category-btn active bg-blue-600 text-white whitespace-nowrap px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-700 transition">All</button>`;
    
    const categoryBtns = categories.map(category => `
        <button onclick="handleCategoryClick('${category}')" class="category-btn whitespace-nowrap px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition capitalize">
            ${category}
        </button>
    `).join('');
    
    categoriesContainer.innerHTML = allBtn + categoryBtns;
}

// Handle Category Click
window.handleCategoryClick = async (category) => {
    // Update active state
    const btns = document.querySelectorAll('.category-btn');
    btns.forEach(btn => {
        const btnCategory = btn.textContent.trim().toLowerCase();
        if (btnCategory === category.toLowerCase() || (category === 'all' && btn.textContent.trim() === 'All')) {
            btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
            btn.classList.remove('text-gray-600', 'border-gray-200');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
            btn.classList.add('text-gray-600', 'border-gray-200');
        }
    });

    await fetchProducts(category);
};

// Fetch Products
async function fetchProducts(category = 'all') {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '<div class="col-span-full text-center py-20"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';
    
    try {
        let url = API_URL;
        if (category !== 'all') {
            url = `${API_URL}/category/${category}`;
        }
        
        const response = await fetch(url);
        const products = await response.json();
        renderProducts(products, productsGrid);
    } catch (error) {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load products.</div>';
    }
}

// Fetch Trending Products
async function fetchTrendingProducts() {
    if (!trendingProductsGrid) return;
    
    // Skeleton loader is in HTML, so we don't clear explicitly unless needed
    // But good practice to show spinner if re-fetching
    // trendingProductsGrid.innerHTML = '...'; 
    
    try {
        const response = await fetch(`${API_URL}?limit=3`);
        const products = await response.json();
        renderProducts(products, trendingProductsGrid);
    } catch (error) {
        console.error('Error fetching trending products:', error);
        if (trendingProductsGrid) trendingProductsGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load trending products.</div>';
    }
}

// --- Cart Functions ---

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('swiftcart_items');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartIcon();
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('swiftcart_items', JSON.stringify(cart));
    updateCartIcon();
    renderCart(); // Re-render if open
}

// Add to Cart
window.addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    
    // Optional: open cart or show toast
    toggleCart(true); 
};

// Remove from Cart
window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

// Update Quantity (Optional helper)
window.updateQuantity = (id, change) => {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
        }
    }
};

// Update Cart Icon Count
function updateCartIcon() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
        // animate ping
        cartCountElement.classList.remove('hidden');
        if (totalCount === 0) cartCountElement.classList.add('hidden');
    }
}

// Toggle Cart Sidebar
window.toggleCart = (show) => {
    if (show === undefined) {
        // Toggle
        const isHidden = cartSidebar.classList.contains('translate-x-full');
        if (isHidden) {
            openCart();
        } else {
            closeCart();
        }
    } else if (show) {
        openCart();
    } else {
        closeCart();
    }
};

function openCart() {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    renderCart();
}

function closeCart() {
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
}

// Render Cart Items
function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-500">
                <i class="fas fa-shopping-cart text-4xl mb-4 text-gray-300"></i>
                <p>Your cart is empty.</p>
                <button onclick="toggleCart(false)" class="mt-4 text-blue-600 font-medium hover:underline">Continue Shopping</button>
            </div>
        `;
        cartTotalElement.textContent = '$0.00';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain bg-gray-50 rounded p-2">
                <div class="flex-1">
                    <h4 class="text-sm font-bold text-gray-800 line-clamp-1" title="${item.title}">${item.title}</h4>
                    <p class="text-blue-600 font-bold">$${item.price}</p>
                    <div class="flex items-center gap-3 mt-1">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">-</button>
                        <span class="text-sm font-medium w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition p-2">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Render Products (Updated to include Add to Cart logic)
function renderProducts(products, container) {
    if (!container) return;
    container.innerHTML = products.map(product => {
        // Encode product data to pass to addToCart safely
        // Note: For simplicity in this static setup, we'll just pass the ID and fetching again or using the object from memory might be cleaner, 
        // but since we have the object here, let's construct a minimal object to pass.
        // Or better yet, we can attach the event listener directly if we weren't using template strings, 
        // but with template strings, we'll put the object in a global map or simply pass valid JSON.
        // Actually, passing a large object in HTML attribute is messy. 
        // Let's store products in a map or just pass the parameters we need.
        // For this assignment, let's use a helper to find the product from the fetched list? 
        // We don't store the fetched list globally though (except in the closure of the render).
        // Let's attach a global look-up or just pass the necessary fields.
        
        // Let's pass the object carefully. Using base64 or just single quotes escape is standard 'hack' for simple apps.
        // A cleaner way for this complexity:
        const productJson = JSON.stringify(product).replace(/"/g, '&quot;');
        
        return `
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100 flex flex-col h-full">
            <div class="h-48 overflow-hidden p-4 flex items-center justify-center bg-white">
                <img src="${product.image}" alt="${product.title}" class="h-full object-contain">
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-2">
                     <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded capitalize truncate max-w-[100px]">${product.category}</span>
                     <div class="text-yellow-400 text-sm flex items-center gap-1">
                        <i class="fas fa-star"></i> ${product.rating.rate} <span class="text-gray-400 text-xs">(${product.rating.count})</span>
                     </div>
                </div>
                <h3 class="text-lg font-bold mb-2 text-gray-800 line-clamp-2" title="${product.title}">${product.title}</h3>
                <p class="text-2xl font-bold text-gray-900 mb-4 mt-auto">$${product.price}</p>
                <div class="flex gap-2 mt-4">
                    <button onclick="openModal(${product.id})" class="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition">Details</button>
                    <button onclick='addToCart(${productJson})' class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition shadow-sm">Add to Cart</button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Modal Logic (Updated Add to Cart)
window.openModal = async (id) => {
    productModal.classList.remove('hidden');
    modalContent.innerHTML = '<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';
    
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const product = await response.json();
        const productJson = JSON.stringify(product).replace(/"/g, '&quot;');
        
        modalContent.innerHTML = `
            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg p-4">
                    <img src="${product.image}" alt="${product.title}" class="max-h-80 object-contain">
                </div>
                <div class="md:w-1/2">
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded capitalize mb-2 inline-block">${product.category}</span>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.title}</h2>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="text-yellow-400 flex text-sm">
                            ${getStarRating(product.rating.rate)}
                        </div>
                        <span class="text-gray-500 text-sm">(${product.rating.count} reviews)</span>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-6">$${product.price}</p>
                    <p class="text-gray-600 mb-8 leading-relaxed">${product.description}</p>
                    <div class="flex gap-4">
                         <button onclick='addToCart(${productJson}); closeModal();' class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md">
                            Add to Cart
                        </button>
                        <button onclick="closeModal()" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        modalContent.innerHTML = '<div class="text-center text-red-500">Failed to load product details.</div>';
    }
};

// ... (Rest of existing code) ...

window.closeModal = () => {
    productModal.classList.add('hidden');
};

// Close modal when clicking outside
if (productModal) {
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Mobile Menu Toggle
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Helper: Generate Star Rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Start
document.addEventListener('DOMContentLoaded', init);
