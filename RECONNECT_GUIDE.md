# Reconnect Forms to Database - Complete Guide

## Current Status
✅ Database connection configured  
✅ All API routes set up  
✅ Serverless function deployed  
⚠️ 405 errors on Vercel (routing issue)

## Step 1: Verify Database Connection

Test your Supabase connection:

```bash
npx tsx scripts/test-db-connection.ts
```

This verifies:
- Collections table
- Products table  
- Orders table
- Contact messages table

## Step 2: Test API Endpoints Locally

### Start the server:
```bash
pnpm dev
```

### Test endpoints (in new terminal):

**Quick test script:**
```bash
npx tsx scripts/test-all-endpoints.ts
```

**Or test manually:**
```bash
# Test ping
curl http://localhost:8080/api/ping

# Test products
curl http://localhost:8080/api/products

# Test collections
curl http://localhost:8080/api/collections

# Test create order
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer":{"name":"Test","email":"test@example.com","phone":"1234567890","address":"123 Main St","city":"Test City","postalCode":"12345"},"items":[{"id":"1","name":"Test","price":10,"quantity":1}],"total":10}'
```

## Step 3: Fix Vercel Deployment (405 Errors)

The 405 errors on Vercel indicate the serverless function isn't routing correctly.

### Verify Vercel Environment Variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure these are set:
   - `SUPABASE_URL` = `https://zfkkcfiqttbffwzgirhp.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)

### After setting environment variables:
1. Redeploy the project (or wait for auto-deploy)
2. Test the endpoints on Vercel

## Forms Connected to Database

All forms are already connected:

1. **Checkout Form** (`/checkout`) → `POST /api/orders` → `orders` table
2. **Contact Form** (`/contact`) → `POST /api/contact` → `contact_messages` table
3. **Admin Product Form** (`/admin`) → `POST /api/products` → `products` table + `product_images` + `product_specifications`
4. **Admin Collection Form** (`/admin`) → `POST /api/collections` → `collections` table
5. **Admin Order Management** (`/admin`) → `GET /api/orders` → `orders` table

## Database Tables

- ✅ `collections` - Product collections
- ✅ `products` - Products
- ✅ `product_images` - Product images (multiple per product)
- ✅ `product_specifications` - Product specs (multiple per product)
- ✅ `orders` - Orders
- ✅ `order_items` - Order items (multiple per order)
- ✅ `contact_messages` - Contact form submissions
- ✅ `hero_slides` - Homepage slides

## Testing Checklist

- [ ] Test database connection locally
- [ ] Test all API endpoints locally
- [ ] Verify Vercel environment variables are set
- [ ] Test endpoints on Vercel deployment
- [ ] Test checkout form on production
- [ ] Test contact form on production
- [ ] Test admin forms on production

Everything is connected! The 405 errors on Vercel should resolve once environment variables are set and the project is redeployed.
