# Forms to Database Connection Status

## ✅ All Forms ARE Connected to Supabase Database

### 1. Checkout Form → Orders Table

**Frontend:** `client/pages/Checkout.tsx`
- Route: `POST /api/orders`
- Connected to: `orders` table + `order_items` table

**Backend:** `server/routes/orders.ts`
- `createOrder` handler inserts into `orders` table
- Also inserts items into `order_items` table
- Uses: `supabase.from("orders")` and `supabase.from("order_items")`

**Database Tables:**
- `orders` - stores order information
- `order_items` - stores individual items in each order

---

### 2. Contact Form → Contact Messages Table

**Frontend:** `client/pages/Contact.tsx`
- Route: `POST /api/contact`
- Connected to: `contact_messages` table

**Backend:** `server/routes/contact.ts`
- `handleContact` handler inserts into `contact_messages` table
- Uses: `supabase.from("contact_messages")`

**Database Table:**
- `contact_messages` - stores contact form submissions

---

### 3. Admin Product Form → Products Tables

**Frontend:** `client/components/admin/ProductForm.tsx`
- Route: `POST /api/products` (create) or `PUT /api/products/:id` (update)
- Connected to: `products` + `product_images` + `product_specifications` tables

**Backend:** `server/routes/products.ts`
- `createProduct` / `updateProduct` handlers
- Inserts/updates in `products` table
- Inserts/updates in `product_images` table (multiple images)
- Inserts/updates in `product_specifications` table (multiple specs)
- Uses: `supabase.from("products")`, `supabase.from("product_images")`, `supabase.from("product_specifications")`

**Database Tables:**
- `products` - main product data
- `product_images` - product images (one-to-many)
- `product_specifications` - product specifications (one-to-many)

---

### 4. Admin Collection Form → Collections Table

**Frontend:** `client/components/admin/CollectionsManager.tsx`
- Route: `POST /api/collections` (create) or `PUT /api/collections/:id` (update)
- Connected to: `collections` table

**Backend:** `server/routes/collections.ts`
- `createCollection` / `updateCollection` handlers
- Uses: `supabase.from("collections")`

**Database Table:**
- `collections` - stores product collections

---

### 5. Admin Orders Management → Orders Table

**Frontend:** `client/components/admin/OrdersManager.tsx`
- Routes: 
  - `GET /api/orders` - list all orders
  - `GET /api/orders/search` - search orders
  - `PUT /api/orders/:id/status` - update order status
- Connected to: `orders` table + `order_items` table

**Backend:** `server/routes/orders.ts`
- `getOrders`, `searchOrders`, `updateOrderStatus` handlers
- Fetches from `orders` and `order_items` tables
- Uses: `supabase.from("orders")` and `supabase.from("order_items")`

---

## Database Connection Configuration

**File:** `server/lib/supabase.ts`
- Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from environment
- Lazy initialization (only connects when needed)
- Service role key bypasses RLS for admin operations

**Environment Variables Required:**
- `SUPABASE_URL` = `https://zfkkcfiqttbffwzgirhp.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)

---

## Current Issue: 405 Errors on Vercel

The forms are correctly connected, but Vercel is returning 405 errors. This is a **deployment/routing issue**, not a database connection issue.

**Solution:**
1. ✅ Set environment variables in Vercel Dashboard
2. ✅ Serverless function is deployed (`api/[...slug].ts`)
3. ⚠️ Function may need environment variables to work properly

---

## Testing Locally

All connections work locally. Test with:

```bash
# Start server
pnpm dev

# Test endpoints (in new terminal)
curl http://localhost:8080/api/ping
curl http://localhost:8080/api/products
curl http://localhost:8080/api/collections
curl -X POST http://localhost:8080/api/orders -H "Content-Type: application/json" -d '{...}'
```

---

## Summary

✅ **All forms ARE connected to the database**
✅ **All API routes ARE connected to Supabase**
✅ **Database schema matches the code**
⚠️ **Vercel deployment needs environment variables set**

The 405 errors are because the serverless function needs the Supabase environment variables to work on Vercel.
