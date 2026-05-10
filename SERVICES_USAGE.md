# Services Usage Guide

## Products Service

```typescript
import { productsService } from '@/lib/services/productsService';

// Get all visible products (optionally filtered by collection)
const products = await productsService.getProducts('collection-id');

// Get single product by slug
const product = await productsService.getProductBySlug('product-slug');

// Get featured products
const featured = await productsService.getFeaturedProducts(8);

// Get trending products
const trending = await productsService.getTrendingProducts(6);

// Search products
const results = await productsService.searchProducts('query');

// Check stock
const stock = await productsService.checkStock('product-id');
```

## Collections Service

```typescript
import { collectionsService } from '@/lib/services/collectionsService';

// Get all active collections
const collections = await collectionsService.getCollections();

// Get collection by slug
const collection = await collectionsService.getCollectionBySlug('lotus');

// Get collection with products
const collectionWithProducts = await collectionsService.getCollectionWithProducts('lion');

// Get featured collections
const featured = await collectionsService.getFeaturedCollections();
```

## Blogs Service

```typescript
import { blogsService } from '@/lib/services/blogsService';

// Get all published blogs
const blogs = await blogsService.getBlogs(10);

// Get featured blogs
const featured = await blogsService.getFeaturedBlogs(3);

// Get single blog by slug
const blog = await blogsService.getBlogBySlug('blog-slug');

// Search blogs
const results = await blogsService.searchBlogs('query');
```

## CMS Service

```typescript
import { homepageService, navbarService, footerService, settingsService } from '@/lib/services/cmsService';

// Homepage sections
const sections = await homepageService.getSections();
const heroSection = await homepageService.getSection('hero');

// Navbar configuration
const navbarConfig = await navbarService.getNavbarConfig();

// Footer configuration
const footerConfig = await footerService.getFooterConfig();

// Website settings
const settings = await settingsService.getSettings();
```

## Orders Service

```typescript
import { ordersService, authService } from '@/lib/services/ordersService';

// Create order
const order = await ordersService.createOrder({
  user_id: 'user-id',
  order_number: 'ORD-001',
  total_amount: 2999,
  shipping_address: { /* address */ }
});

// Add order items
await ordersService.addOrderItems([
  { order_id: 'order-id', product_id: 'product-id', quantity: 1, price: 2999 }
]);

// Get user orders
const orders = await ordersService.getUserOrders('user-id');

// Get single order
const order = await ordersService.getOrder('order-id');

// Update order status
await ordersService.updateOrderStatus('order-id', 'processing');

// Update payment status
await ordersService.updatePaymentStatus('order-id', 'paid', 'razorpay-payment-id');

// Auth
const user = await authService.getCurrentUser();
const profile = await authService.getUserProfile('user-id');
const isAdmin = await authService.isAdmin('user-id');
```

## Razorpay Service

```typescript
import { razorpayService } from '@/lib/services/razorpayService';

// Create Razorpay order
const order = await razorpayService.createOrder(2999);

// Open payment modal
try {
  await razorpayService.openPaymentModal({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: 299900, // in paise
    currency: 'INR',
    name: 'Lotus & Lion',
    description: 'Purchase from Lotus & Lion',
    order_id: 'razorpay-order-id',
    handler: (response) => {
      // Handle successful payment
    },
    prefill: {
      name: 'Customer Name',
      email: 'email@example.com',
      contact: '9999999999',
    },
    theme: { color: '#000000' },
  });
} catch (error) {
  console.error('Payment failed:', error);
}

// Verify payment
const verified = await razorpayService.verifyPayment(
  'razorpay-order-id',
  'razorpay-payment-id',
  'signature'
);
```

## Cloudinary Service

```typescript
import { cloudinaryService } from '@/lib/services/cloudinaryService';

// Upload single image
const file = new File(['...'], 'image.jpg');
const response = await cloudinaryService.uploadImage(file);
// response: { public_id, secure_url, url, width, height, ... }

// Upload multiple images
const files = [file1, file2, file3];
const responses = await cloudinaryService.uploadMultiple(files);

// Get optimized URL
const optimizedUrl = cloudinaryService.getOptimizedUrl('public-id', {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'auto',
});

// Delete image
const deleted = await cloudinaryService.deleteImage('public-id');

// Get image metadata
const metadata = await cloudinaryService.getImageMetadata('public-id');
```

## Cart Store (Zustand)

```typescript
import { useCartStore } from '@/store/useStore';

// Get store instance
const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

// Add item to cart
useCartStore.setState((state) => {
  state.addItem({
    productId: 'product-id',
    name: 'Product Name',
    price: 2999,
    quantity: 1,
    size: 'M',
    color: 'Black',
    image: 'image-url',
  });
});

// Remove item
useCartStore.setState((state) => {
  state.removeItem('product-id');
});

// Update quantity
useCartStore.setState((state) => {
  state.updateQuantity('product-id', 2);
});

// Get total price
const total = useCartStore.getState().getTotalPrice();

// Get total items
const count = useCartStore.getState().getTotalItems();

// Clear cart
useCartStore.setState((state) => {
  state.clearCart();
});
```

## Auth Store (Zustand)

```typescript
import { useAuthStore } from '@/store/useStore';

// Get user
const user = useAuthStore((state) => state.user);
const isAdmin = useAuthStore((state) => state.isAdmin);

// Set user
useAuthStore.setState({ user: userData, isAdmin: true });

// Logout
useAuthStore.setState({ user: null, isAdmin: false });
```

---

**Version**: 1.0.0  
**Last Updated**: May 8, 2026
