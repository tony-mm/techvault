# TechVault E-Commerce Marketplace

A complete e-commerce website where you can sell your products!

## 📁 Project Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage with featured products |
| `products.html` | All products page with filters |
| `product-detail.html` | Individual product pages |
| `admin.html` | **👈 ADD YOUR PRODUCTS HERE** |
| `script.js` | All functionality (cart, search, filters) |
| `styles.css` | All styling |
| `products.json` | Sample product data |

---

## 🚀 How to Use

### 1. **Add Your Products** (IMPORTANT!)

Open `admin.html` in your browser:
```
file:///C:/Users/tonym/.openclaw/workspace/e%20commerce/admin.html
```

**What you can do in the admin panel:**
- ✅ Add new products with all details
- ✅ Set prices, discounts, and stock
- ✅ Choose categories and brands
- ✅ Mark products as "Featured" or "Express Delivery"
- ✅ Delete products you no longer sell
- ✅ All products are saved automatically in your browser

### 2. **View Your Store**

Open `index.html` in your browser:
```
file:///C:/Users/tonym/.openclaw/workspace/e%20commerce/index.html
```

**Features:**
- 🛍️ Browse all products
- 🔍 Search for specific items
- 🛒 Add to cart
- 💳 Checkout (demo)
- 📱 Mobile-responsive design

### 3. **Browse Products**

Open `products.html` to see all products with filters:
- Filter by category
- Filter by brand
- Filter by price range
- Filter by rating

---

## ✨ Features

### Working Features:
- ✅ **Product Management** - Add/edit/delete products via admin panel
- ✅ **Product Variations** - Storage size (64GB-1TB) and color options
- ✅ **Shopping Cart** - Add items with selected variations
- ✅ **Search** - Search products by name, category, or description
- ✅ **Filters** - Filter by category, brand, price, rating
- ✅ **Product Details** - View full product information with variations
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Persistent Data** - Products, cart, and variations saved in browser

### Demo Features:
- ⚠️ Checkout (shows demo message)
- ⚠️ User login (not implemented)
- ⚠️ Payment processing (not implemented)

---

## 📝 How to Add a Product

1. Open `admin.html` in your browser
2. Fill in the product details:
   - **Product Name** - What you're selling
   - **Price** - Your selling price
   - **Old Price** - Original price (optional, shows discount)
   - **Category** - Choose from dropdown
   - **Brand** - Your brand name
   - **Rating** - Product rating (1-5 stars)
   - **Stock** - How many you have
   - **Description** - Product details
   - **Product Image** - Upload a photo from your computer
   - **Options** - Express delivery, Featured product
   - **Storage Options** - Check available sizes (64GB, 128GB, 256GB, etc.)
   - **Color Options** - Check available colors (Black, White, Silver, etc.)
3. Click **"Add Product"**
4. Your product is now live on the store!

**Tip:** For electronics (phones, laptops), add storage and color variations. For accessories, just add colors. For simple items, skip variations.

---

## 🎨 Customization

### Change Colors:
Edit `styles.css` at the top where it says `:root`:
```css
:root {
    --primary: #fb2e11;      /* Main color (red) */
    --secondary: #234f96;    /* Secondary color (blue) */
    --accent-blue: #0056b3;  /* Accent color */
}
```

### Change Store Name:
Edit all HTML files and replace "TechVault" with your store name.

---

## 💡 Tips

1. **Start with 5-10 products** - Don't overwhelm your store
2. **Use good descriptions** - Help customers understand what you're selling
3. **Set competitive prices** - Research similar products
4. **Mark best sellers as "Featured"** - They'll show on the homepage
5. **Keep stock updated** - Remove products when out of stock

---

## 🔧 Troubleshooting

**Products not showing?**
- Make sure you added them via `admin.html`
- Try refreshing the page (F5)
- Check browser console for errors (F12)

**Cart not working?**
- Clear browser cache and try again
- Make sure JavaScript is enabled
- Try a different browser

**Search not finding products?**
- Search works on product name, category, brand, and description
- Try different keywords

---

## 📞 Need Help?

If you need to:
- Add more product categories
- Change the design
- Add payment processing
- Set up a real backend

Let me know and I can help you extend the functionality!

---

**Happy Selling! 🎉**
