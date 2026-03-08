// ═══ TECHVAULT MARKETPLACE - COMPLETE SCRIPT ═══

// ── Default Products (if none in localStorage) ──
const defaultProducts = [
    {
        id: 1,
        name: "Wireless Bluetooth Earbuds",
        price: 49.99,
        oldPrice: 79.99,
        category: "Headphones",
        brand: "TechVault",
        rating: 5,
        reviews: 256,
        discount: "-38%",
        express: true,
        image: "headphones",
        description: "Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal clear sound quality.",
        stock: 50,
        featured: true
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 199.99,
        oldPrice: 299.99,
        category: "Smartwatches",
        brand: "TechVault",
        rating: 4,
        reviews: 189,
        discount: "-33%",
        express: true,
        image: "watch",
        description: "Advanced fitness tracking, heart rate monitor, GPS, and 7-day battery life. Water-resistant up to 50 meters.",
        stock: 30,
        featured: true
    },
    {
        id: 3,
        name: "USB-C Fast Charger 65W",
        price: 29.99,
        oldPrice: 49.99,
        category: "Accessories",
        brand: "TechVault",
        rating: 5,
        reviews: 432,
        discount: "-40%",
        express: false,
        image: "charger",
        description: "Ultra-fast charging for laptops, tablets, and phones. Compact design with multiple safety protections.",
        stock: 100,
        featured: false
    },
    {
        id: 4,
        name: "Mechanical Gaming Keyboard",
        price: 89.99,
        oldPrice: 129.99,
        category: "Gaming",
        brand: "TechVault",
        rating: 5,
        reviews: 178,
        discount: "-31%",
        express: true,
        image: "keyboard",
        description: "RGB backlit mechanical keyboard with blue switches, perfect for gaming and typing.",
        stock: 25,
        featured: true
    }
];

// ── API Configuration ──
const API_BASE = 'http://localhost:5000/api';

// ── Initialize Products ──
let products = [];

async function initializeData() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        products = await response.json();
        
        // Render based on current state
        if (document.getElementById('productList')) {
            renderProducts(products, 'productList');
            updateProductCount(products.length);
        }
        if (document.getElementById('flashSalesList')) {
            const flashProducts = products.filter(p => p.isFlashSale).slice(0, 8);
            renderProducts(flashProducts, 'flashSalesList');
            setupFlashSaleTimer();
        }
        if (document.getElementById('topDealsList')) {
            const topProducts = products.filter(p => p.featured).slice(0, 8);
            renderProducts(topProducts, 'topDealsList');
        }
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

// ── Cart State ──
let cart = JSON.parse(localStorage.getItem('tv-cart') || '[]');

// ── Icon Mapping (fallback for old products) ──
const iconMap = {
    headphones: '<i class="fas fa-headphones"></i>',
    phone: '<i class="fas fa-mobile-alt"></i>',
    laptop: '<i class="fas fa-laptop"></i>',
    watch: '<i class="fas fa-clock"></i>',
    camera: '<i class="fas fa-camera"></i>',
    keyboard: '<i class="fas fa-keyboard"></i>',
    mouse: '<i class="fas fa-mouse"></i>',
    charger: '<i class="fas fa-plug"></i>',
    speaker: '<i class="fas fa-volume-up"></i>',
    tablet: '<i class="fas fa-tablet-alt"></i>',
    default: '<i class="fas fa-box"></i>'
};

function getProductImage(product) {
    if ((product.imageType === 'upload' || product.imageType === 'url') && product.image) {
        return `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;">`;
    }
    return `<div style="font-size: 4rem; color: #888;">${iconMap[product.image] || iconMap.default}</div>`;
}

function getProductImageLarge(product) {
    if ((product.imageType === 'upload' || product.imageType === 'url') && product.image) {
        return `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
    }
    return `<div style="font-size: 8rem; color: #888;">${iconMap[product.image] || iconMap.default}</div>`;
}

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
    // Cart listeners
    const cartOpenBtn = document.getElementById('cartOpen');
    const cartCloseBtn = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Search autocomplete
    setupSearchAutocomplete();

    // Search form submit
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                const productList = document.getElementById('productList');
                if (productList) {
                    filterProductsBySearch(query);
                } else {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // Initialize Global Data
    initializeData().then(() => {
        // Handle URL params for category/search (products page)
        handleUrlParams();

        // Render based on page
        if (document.getElementById('productList') && !hasUrlParams()) {
            renderProducts(products, 'productList');
            updateProductCount(products.length);
        }
        if (document.getElementById('flashSalesList')) {
            const flashProducts = products.filter(p => p.isFlashSale).slice(0, 8);
            renderProducts(flashProducts, 'flashSalesList');
            setupFlashSaleTimer();
        }
        if (document.getElementById('topDealsList')) {
            const topProducts = products.filter(p => p.featured).slice(0, 8);
            renderProducts(topProducts, 'topDealsList');
        }
        if (document.getElementById('productDetailPage')) {
            loadProductDetail();
        }
    });

    // Hero Slider
    if (document.getElementById('heroSlider')) {
        loadHeroSlider();
    }

    // Escape key to close cart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    // Initial cart UI update
    updateCartUI();
});

// ── URL Param Helpers ──
function hasUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return params.has('category') || params.has('search');
}

function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const search = params.get('search');
    const productList = document.getElementById('productList');

    if (!productList) return;

    if (category) {
        const categoryLabel = getCategoryLabel(category);
        const filtered = products.filter(p =>
            p.category.toLowerCase() === category.toLowerCase()
        );
        renderProducts(filtered, 'productList');
        updateProductCount(filtered.length);
        updatePageBanner(categoryLabel);

        // pre-fill search input if desired
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
    } else if (search) {
        const decoded = decodeURIComponent(search);
        filterProductsBySearch(decoded);
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = decoded;
    }
}

function getCategoryLabel(cat) {
    const map = {
        'Smartphones': 'Smartphones',
        'Laptops': 'Laptops & Computers',
        'Headphones': 'Audio & Speakers',
        'Smartwatches': 'Smartwatches',
        'Cameras': 'Cameras',
        'Gaming': 'Gaming Console',
        'Accessories': 'Accessories',
        'Television': 'Television',
        'Power': 'Power Banks & Chargers'
    };
    return map[cat] || cat;
}

function updatePageBanner(label) {
    const banner = document.getElementById('pageBanner');
    if (banner) banner.textContent = label;
    const crumb = document.getElementById('breadcrumbCategory');
    if (crumb) crumb.textContent = label;
    const shopBanner = document.querySelector('.shop-banner');
    if (shopBanner) {
        shopBanner.style.background = 'linear-gradient(135deg, #234f96, #0056b3)';
    }
}

// ── Search Autocomplete ──
function setupSearchAutocomplete() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');

    if (!searchInput || !suggestionsBox) return;

    let activeIndex = -1;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        activeIndex = -1;

        if (query.length < 1) {
            closeSuggestions();
            return;
        }

        // Gather matches: product names, brands, categories (unique)
        const suggestions = [];
        const seen = new Set();

        products.forEach(p => {
            // Product name match
            if (p.name.toLowerCase().includes(query) && !seen.has(p.name)) {
                seen.add(p.name);
                suggestions.push({ text: p.name, type: 'product', category: p.category });
            }
        });

        // Category matches
        const categories = [...new Set(products.map(p => p.category))];
        categories.forEach(cat => {
            if (cat.toLowerCase().includes(query) && !seen.has(cat)) {
                seen.add(cat);
                suggestions.push({ text: cat, type: 'category' });
            }
        });

        // Brand matches
        const brands = [...new Set(products.map(p => p.brand))];
        brands.forEach(b => {
            if (b.toLowerCase().includes(query) && !seen.has(b)) {
                seen.add(b);
                suggestions.push({ text: b, type: 'brand' });
            }
        });

        renderSuggestions(suggestions.slice(0, 8), suggestionsBox, searchInput);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            updateActiveItem(items, activeIndex, searchInput);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, -1);
            updateActiveItem(items, activeIndex, searchInput);
        } else if (e.key === 'Escape') {
            closeSuggestions();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper') && !e.target.closest('.search-container')) {
            closeSuggestions();
        }
    });

    function closeSuggestions() {
        suggestionsBox.classList.remove('active');
        suggestionsBox.innerHTML = '';
    }

    function updateActiveItem(items, index, input) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
            if (i === index) {
                input.value = item.dataset.text;
            }
        });
    }
}

function renderSuggestions(suggestions, box, input) {
    if (suggestions.length === 0) {
        box.innerHTML = '<div class="suggestion-no-results">No matches found</div>';
        box.classList.add('active');
        return;
    }

    box.innerHTML = suggestions.map(s => {
        const icon = s.type === 'category' ? 'fas fa-tag'
                   : s.type === 'brand' ? 'fas fa-building'
                   : 'fas fa-search';
        const badge = s.category ? `<span class="suggestion-category-badge">${s.category}</span>` : '';
        return `<div class="suggestion-item" data-text="${escapeHtml(s.text)}" data-type="${s.type}">
            <i class="${icon}"></i>
            <span>${highlight(s.text, input.value)}</span>
            ${badge}
        </div>`;
    }).join('');

    box.classList.add('active');

    // Click handling on suggestions
    box.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.dataset.text;
            const type = item.dataset.type;
            input.value = text;
            box.classList.remove('active');

            if (type === 'category') {
                window.location.href = `products.html?category=${encodeURIComponent(text)}`;
            } else {
                const productList = document.getElementById('productList');
                if (productList) {
                    filterProductsBySearch(text.toLowerCase());
                } else {
                    window.location.href = `products.html?search=${encodeURIComponent(text)}`;
                }
            }
        });
    });
}

function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<strong>$1</strong>');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Product Rendering ──
function renderProducts(items, targetId) {
    const container = document.getElementById(targetId);
    if (!container || items.length === 0) {
        if (container) container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-muted);">No products found</p>';
        return;
    }

    container.innerHTML = items.map(p => `
        <div class="product-card" onclick="location.href='product-detail.html?id=${p.id}'">
            ${p.discount ? `<div class="card-discount">${p.discount}</div>` : ''}
            <div class="card-img">
                ${getProductImage(p)}
            </div>
            <div class="card-info">
                <div class="card-name">${p.name}</div>
                <div class="card-price">
                    $${p.price.toFixed(2)}
                    ${p.oldPrice ? `<span class="card-old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="card-rating">
                    <span class="card-stars">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</span>
                    <span class="card-count">(${p.reviews})</span>
                </div>
                ${p.express ? '<div style="font-size: 0.65rem; color: var(--primary); font-weight: 600; margin-top: 0.3rem;">⚡ Express</div>' : ''}
            </div>
        </div>
    `).join('');
}

// ── Hero Slider ──
const defaultSlides = [
    {
        id: 'default-1',
        title: 'Upgrade Your Tech Game',
        subtitle: 'Up to 40% OFF on the latest smartphones and laptops. Limited time only!',
        cta: 'Shop Now',
        ctaLink: 'products.html',
        image: null
    }
];

let currentSlide = 0;
let slideInterval = null;

async function loadHeroSlider() {
    const track = document.getElementById('heroSlidesTrack');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const sliderEl = document.getElementById('heroSlider');

    if (!track) return;

    try {
        const response = await fetch(`${API_BASE}/hero-slides`);
        const slides = await response.json();
        
        const slidesToRender = slides.length > 0 ? slides : defaultSlides;

        // Render slides
        track.innerHTML = slidesToRender.map(slide => {
            const hasImg = slide.image && (slide.imageType === 'upload' || slide.imageType === 'url');
            return `
            <div class="hero-slide ${!hasImg ? 'hero-slide-default' : ''}">
                ${hasImg ? `<img src="${slide.image}" alt="${slide.title}">` : ''}
                <div class="hero-slide-overlay">
                    <div class="hero-slide-content">
                        <h2>${slide.title || ''}</h2>
                        <p>${slide.subtitle || ''}</p>
                        ${slide.cta ? `<a href="${slide.ctaLink || 'products.html'}" class="hero-slide-cta">${slide.cta}</a>` : ''}
                    </div>
                </div>
            </div>`;
        }).join('');

        // Render dots
        if (dotsContainer) {
            dotsContainer.innerHTML = slidesToRender.map((_, i) =>
                `<button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`
            ).join('');
        }

        // Show/hide arrows for single slide
        if (slidesToRender.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        }

        // Arrow listeners
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1, slidesToRender.length));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1, slidesToRender.length));

        // Dot listeners
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
                dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index), slidesToRender.length));
            });
        }

        // Auto-play
        startAutoPlay(slidesToRender.length);

        // Pause on hover
        if (sliderEl) {
            sliderEl.addEventListener('mouseenter', stopAutoPlay);
            sliderEl.addEventListener('mouseleave', () => startAutoPlay(slidesToRender.length));
        }
    } catch (error) {
        console.error('Failed to load hero slides:', error);
    }
}

function goToSlide(index, total) {
    currentSlide = (index + total) % total;
    const track = document.getElementById('heroSlidesTrack');
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function startAutoPlay(total) {
    stopAutoPlay();
    if (total > 1) {
        slideInterval = setInterval(() => goToSlide(currentSlide + 1, total), 4500);
    }
}

function stopAutoPlay() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// ── Product Detail Page ──
let selectedStorage = null;
let selectedColor = null;

function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = products.find(p => p.id == id || p._id == id) || products[0];

    if (!product) return;

    document.title = `${product.name} — TechVault`;

    const detailTitle = document.getElementById('detailTitle');
    const detailPrice = document.getElementById('detailPrice');
    const detailOldPrice = document.getElementById('detailOldPrice');
    const detailDiscount = document.getElementById('detailDiscount');
    const detailImgContainer = document.getElementById('detailImgContainer');
    const detailDescription = document.getElementById('detailDescription');
    const expressBadge = document.getElementById('expressBadge');
    const addToCartBtn = document.getElementById('addToCartBtn');

    if (detailTitle) detailTitle.innerText = product.name;
    if (detailPrice) detailPrice.innerText = `$${product.price.toFixed(2)}`;
    if (detailOldPrice) detailOldPrice.innerText = product.oldPrice ? `$${product.oldPrice.toFixed(2)}` : '';
    if (detailDiscount) detailDiscount.innerText = product.discount || '';
    if (detailImgContainer) detailImgContainer.innerHTML = getProductImageLarge(product);
    if (detailDescription) detailDescription.innerText = product.description;
    if (expressBadge) expressBadge.style.display = product.express ? 'inline-block' : 'none';

    if (product.variations) renderVariations(product);

    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const qty = parseInt(document.getElementById('qtyValue')?.innerText || '1');
            let variationText = '';
            if (selectedStorage || selectedColor) {
                const parts = [];
                if (selectedStorage) parts.push(selectedStorage);
                if (selectedColor) parts.push(selectedColor.name);
                variationText = parts.join(' / ');
            }
            for (let i = 0; i < qty; i++) {
                addToCart(product.name, product.price, variationText);
            }
        };
    }
}

// ── Render Variations ──
function renderVariations(product) {
    const storageSection = document.getElementById('storageSection');
    const colorSection = document.getElementById('colorSection');
    const storageOptions = document.getElementById('storageOptions');
    const colorOptions = document.getElementById('colorOptions');

    if (product.variations.storage && product.variations.storage.length > 0) {
        storageSection.style.display = 'block';
        storageOptions.innerHTML = product.variations.storage.map(storage => `
            <button class="variation-btn" data-type="storage" data-value="${storage}"
                style="border:1px solid var(--gray-border); padding:8px 15px; border-radius:4px; font-size:0.8rem; background:#fff; cursor:pointer; transition: all 0.2s;">
                ${storage}
            </button>
        `).join('');

        storageOptions.querySelectorAll('.variation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                storageOptions.querySelectorAll('.variation-btn').forEach(b => {
                    b.style.background = '#fff';
                    b.style.borderColor = 'var(--gray-border)';
                    b.style.color = 'var(--text-dark)';
                });
                btn.style.background = 'var(--primary)';
                btn.style.borderColor = 'var(--primary)';
                btn.style.color = '#fff';
                selectedStorage = btn.getAttribute('data-value');
                updateSelectedVariationDisplay();
            });
        });
    }

    if (product.variations.colors && product.variations.colors.length > 0) {
        colorSection.style.display = 'block';
        colorOptions.innerHTML = product.variations.colors.map(color => `
            <button class="variation-btn" data-type="color" data-value="${color.name}" data-hex="${color.hex}" data-image="${color.image || ''}"
                style="border:2px solid var(--gray-border); padding:10px 18px; border-radius:var(--radius); font-size:0.85rem; background:#fff; cursor:pointer; transition: all 0.2s; display:flex; align-items:center; gap:8px; font-weight:600;">
                <span style="width:20px; height:20px; border-radius:50%; background:${color.hex}; border:1px solid #ddd; display:inline-block; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"></span>
                ${color.name}
            </button>
        `).join('');

        colorOptions.querySelectorAll('.variation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                colorOptions.querySelectorAll('.variation-btn').forEach(b => {
                    b.style.background = '#fff';
                    b.style.borderColor = 'var(--gray-border)';
                    b.style.boxShadow = 'none';
                });
                btn.style.background = '#f8f9fa';
                btn.style.borderColor = 'var(--primary)';
                btn.style.boxShadow = '0 0 0 1px var(--primary)';
                
                const colorImg = btn.getAttribute('data-image');
                const colorName = btn.getAttribute('data-value');
                const colorHex = btn.getAttribute('data-hex');

                selectedColor = { name: colorName, hex: colorHex, image: colorImg };
                updateSelectedVariationDisplay();

                // Swap image if this color has its own photo
                if (colorImg) {
                    swapDetailImage(colorImg, product.name);
                } else {
                    // Revert to primary product image if no color-specific image
                    swapDetailImage(product.image, product.name);
                }
            });
        });
    }
}

function swapDetailImage(newImageSrc, productName) {
    const container = document.getElementById('detailImgContainer');
    if (!container) return;
    
    let img = container.querySelector('img');
    
    // If current view is an icon (fallback), replace it entirely
    if (!img) {
        container.innerHTML = `<img src="${newImageSrc}" alt="${productName}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
        return;
    }

    // Smooth swap with CSS class
    img.classList.add('swapping');
    
    setTimeout(() => {
        img.src = newImageSrc;
        // Wait for it to load to avoid flicker, or just remove class after transition
        img.onload = () => {
            img.classList.remove('swapping');
        };
        // Safety timeout if onload doesn't fire (e.g. cached)
        setTimeout(() => img.classList.remove('swapping'), 100);
    }, 300); // Matches CSS transition duration
}

function updateSelectedVariationDisplay() {
    const selectedVariationDiv = document.getElementById('selectedVariation');
    const selectedVariationText = document.getElementById('selectedVariationText');

    if (selectedStorage || selectedColor) {
        selectedVariationDiv.style.display = 'block';
        const parts = [];
        if (selectedStorage) parts.push(selectedStorage);
        if (selectedColor) parts.push(selectedColor.name);
        selectedVariationText.innerText = parts.join(' / ');
    } else {
        selectedVariationDiv.style.display = 'none';
    }
}

// ── Search Functionality ──
function filterProductsBySearch(query) {
    const q = query.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );

    const productList = document.getElementById('productList');
    if (productList) {
        renderProducts(filtered, 'productList');
        updateProductCount(filtered.length);
        updatePageBanner(`Results for "${query}"`);
    } else {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// ── Filter Functionality ──
function populateDynamicFilters() {
    const categoryGroup = document.getElementById('categoryFilterGroup');
    const brandGroup = document.getElementById('brandFilterGroup');

    if (categoryGroup) {
        // Get unique categories from products
        const categories = [...new Set(products.map(p => p.category))].sort();
        const title = categoryGroup.querySelector('.filter-group-title').outerHTML;
        categoryGroup.innerHTML = title +
            `<div class="filter-item"><label><input type="checkbox" value="all" checked> All Products</label></div>` +
            categories.map(cat =>
                `<div class="filter-item"><label><input type="checkbox" value="${cat}"> ${cat}</label></div>`
            ).join('');
        // Re-attach listeners
        categoryGroup.querySelectorAll('input[type="checkbox"]').forEach(cb =>
            cb.addEventListener('change', applyFilters)
        );
    }

    if (brandGroup) {
        // Get unique brands from products
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
        const title = brandGroup.querySelector('.filter-group-title').outerHTML;
        if (brands.length === 0) {
            brandGroup.innerHTML = title + '<div style="font-size:0.8rem; color:var(--text-muted); padding:0.3rem 0;">No brands yet</div>';
        } else {
            brandGroup.innerHTML = title +
                brands.map(brand =>
                    `<div class="filter-item"><label><input type="checkbox" value="${brand}"> ${brand}</label></div>`
                ).join('');
            brandGroup.querySelectorAll('input[type="checkbox"]').forEach(cb =>
                cb.addEventListener('change', applyFilters)
            );
        }
    }
}

function setupFilters() {
    const priceRadios = document.querySelectorAll('.filter-item input[type="radio"][name="price"]');
    priceRadios.forEach(radio => radio.addEventListener('change', applyFilters));
}

function applyFilters() {
    let filtered = [...products];

    // Category filter — using dynamic checkboxes by group ID
    const categoryGroup = document.getElementById('categoryFilterGroup');
    if (categoryGroup) {
        const checked = Array.from(categoryGroup.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        if (checked.length > 0 && !checked.includes('all')) {
            filtered = filtered.filter(p => checked.includes(p.category));
        }
    }

    // Brand filter — using dynamic checkboxes by group ID
    const brandGroup = document.getElementById('brandFilterGroup');
    if (brandGroup) {
        const checked = Array.from(brandGroup.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        if (checked.length > 0) {
            filtered = filtered.filter(p => checked.includes(p.brand));
        }
    }

    // Price filter
    const priceFilter = document.querySelector('input[type="radio"][name="price"]:checked');
    if (priceFilter) {
        const priceText = priceFilter.parentElement.textContent.trim();
        if (priceText === 'Under 100') {
            filtered = filtered.filter(p => p.price < 100);
        } else if (priceText === '100 - 500') {
            filtered = filtered.filter(p => p.price >= 100 && p.price <= 500);
        } else if (priceText === '500 - 1000') {
            filtered = filtered.filter(p => p.price >= 500 && p.price <= 1000);
        }
    }

    // Rating filter
    const ratingFilters = Array.from(document.querySelectorAll('.filter-group:last-child input[type="checkbox"]:checked'));
    if (ratingFilters.length > 0) {
        const minRating = Math.max(...ratingFilters.map(cb =>
            parseInt(cb.parentElement.textContent.trim().replace(' Stars & Above', ''))
        ));
        filtered = filtered.filter(p => p.rating >= minRating);
    }

    renderProducts(filtered, 'productList');
    updateProductCount(filtered.length);
}

function updateProductCount(count) {
    const countElement = document.querySelector('.listing-header strong');
    if (countElement) {
        countElement.innerText = count;
    }
}

// ── Cart Functions ──
function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    renderCart();
}

function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

function addToCart(name, price, variation = '') {
    const cartKey = variation ? `${name} (${variation})` : name;
    const existing = cart.find(i => i.name === cartKey);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name: cartKey,
            baseName: name,
            price,
            qty: 1,
            variation: variation || null
        });
    }
    saveCart();
    updateCartUI();
    showToast(`"${name}"${variation ? ` (${variation})` : ''} added to cart!`);
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
    renderCart();
}

function saveCart() {
    localStorage.setItem('tv-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = totalQty;
    const drawerBadge = document.getElementById('cartCountDrawer');
    if (drawerBadge) drawerBadge.innerText = totalQty;
}

function renderCart() {
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (footerEl) footerEl.style.display = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    let total = 0;
    let html = '';

    cart.forEach((item, i) => {
        total += item.price * item.qty;
        const searchName = item.baseName || item.name;
        const product = products.find(p => p.name === searchName);
        const itemImage = product ? getProductImage(product) : '<i class="fas fa-box" style="color:#ccc; font-size: 1.5rem;"></i>';

        html += `
            <div class="cart-item">
                <div class="cart-item-img" style="overflow: hidden;">
                    ${itemImage}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    ${item.variation ? `<div style="font-size:0.75rem; color:var(--text-muted); margin:0.25rem 0;">${item.variation}</div>` : ''}
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.qty}</div>
                    <a href="javascript:void(0)" class="cart-item-remove" onclick="removeFromCart(${i})">
                        <i class="far fa-trash-alt"></i> REMOVE
                    </a>
                </div>
            </div>
        `;
    });

    itemsEl.innerHTML = html;
    if (totalEl) totalEl.innerText = '$' + total.toFixed(2);
}

// ── Toast Notifications ──
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100px)';
    }, 3000);
}

// ── Flash Sale Timer ──
async function setupFlashSaleTimer() {
    const timerEl = document.getElementById('flashSaleTimer');
    if (!timerEl) return;

    let settings = { flashSaleEndTime: '' };
    try {
        const response = await fetch(`${API_BASE}/settings`);
        settings = await response.json();
    } catch (error) {
        console.error('Failed to fetch settings:', error);
    }

    function update() {
        const endTimeStr = settings.flashSaleEndTime;
        
        if (!endTimeStr) {
            timerEl.innerText = "Check back soon!";
            return;
        }

        const now = new Date();
        const end = new Date(endTimeStr);
        const diff = end - now;

        if (diff <= 0) {
            timerEl.innerText = "Sale ended!";
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.innerText = `Ends In: ${hours}h : ${mins}m : ${secs}s`;
    }

    update();
    setInterval(update, 1000);
}

// ── Checkout (Demo) ──
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            alert('🎉 Thank you for your order!\n\nThis is a demo checkout. In a real store, you would be redirected to payment processing.');
            cart = [];
            saveCart();
            updateCartUI();
            closeCart();
        });
    }
});
