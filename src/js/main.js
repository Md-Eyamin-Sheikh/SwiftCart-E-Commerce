const API_URL = 'https://fakestoreapi.com/products';

// DOM Elements
const categoriesContainer = document.getElementById('categories');
const productsGrid = document.getElementById('products-grid');
const trendingProductsGrid = document.getElementById('trending-products-grid');
const productModal = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');

// State
let currentCategory = 'all';

// Initialize
async function init() {
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

// Fetch Categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        renderCategories(['all', ...categories]);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Render Categories
function renderCategories(categories) {
    categoriesContainer.innerHTML = categories.map(category => `
        <button 
            onclick="handleCategoryClick('${category}')"
            class="px-4 py-2 rounded-full capitalize transition ${currentCategory === category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}"
        >
            ${category}
        </button>
    `).join('');
}

// Handle Category Click
window.handleCategoryClick = async (category) => {
    currentCategory = category;
    // Update button styles
    const buttons = categoriesContainer.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === category) {
            btn.className = 'px-4 py-2 rounded-full capitalize transition bg-blue-600 text-white';
        } else {
            btn.className = 'px-4 py-2 rounded-full capitalize transition bg-white text-gray-700 hover:bg-gray-100 border border-gray-200';
        }
    });
    
    await fetchProducts(category);
};

// Fetch Products
async function fetchProducts(category = 'all') {
    productsGrid.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';
    
    try {
        const url = category === 'all' ? API_URL : `${API_URL}/category/${category}`;
        const response = await fetch(url);
        const products = await response.json();
        renderProducts(products, productsGrid);
    } catch (error) {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load products. Please try again.</div>';
    }
}

// Fetch Trending Products
async function fetchTrendingProducts() {
    trendingProductsGrid.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';
    
    try {
        const response = await fetch(`${API_URL}?limit=3`);
        const products = await response.json();
        renderProducts(products, trendingProductsGrid);
    } catch (error) {
        console.error('Error fetching trending products:', error);
        trendingProductsGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load trending products.</div>';
    }
}

// Render Products
function renderProducts(products, container) {
    if (!container) return;
    container.innerHTML = products.map(product => `
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
                    <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal Logic
window.openModal = async (id) => {
    productModal.classList.remove('hidden');
    modalContent.innerHTML = '<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>';
    
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const product = await response.json();
        
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
                        <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md">
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
