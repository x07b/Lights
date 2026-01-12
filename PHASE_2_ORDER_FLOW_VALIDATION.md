# Phase 2: Order (Commande) Flow Validation

## Overview

This document validates the complete order lifecycle:
1. ✅ Add product(s) to panier
2. ✅ Generate panier code / order ID
3. ✅ Submit order (commande)
4. ✅ Receive confirmation state

---

## Architecture Overview

### Client-Side (React)
- **Cart Storage:** `localStorage` (persists on refresh) ✅
- **Cart Context:** `client/contexts/CartContext.tsx`
  - Manages items, quantities, total
  - Auto-saves to localStorage on every change
- **Checkout Page:** `client/pages/Checkout.tsx`
  - Form validation (name, email, phone, address, city, postal code)
  - Submits to `/api/orders`
  - Displays "Commande confirmée !" on success

### Server-Side (Express)
- **Order Creation:** `server/routes/orders.ts` → `POST /api/orders`
  - Validates input with Zod schemas
  - Creates order in database
  - Inserts order items
  - Sends confirmation emails (async, non-blocking)
  - Returns panier code

- **Order Retrieval:** `server/routes/orders.ts`
  - `GET /api/orders/:id` - By order ID
  - `GET /api/orders/panier/:panierCode` - By panier code
  - `GET /api/orders` - All orders (admin)
  - `GET /api/orders/search?query=...` - Search by customer
  - `GET /api/orders/status/:status` - By status

### Database (Supabase)
- **tables needed:**
  - `orders` - Order header (customer info, total, status)
  - `order_items` - Line items (product_id, quantity, price, name)

---

## Phase 2 Validation Tests

### ✅ Test 1: Add Products to Cart

**Steps:**
1. Navigate to `/products`
2. Click on a product
3. Click "Add to Cart" button
4. Verify product appears in cart (check `/cart` page or cart icon count)
5. Refresh page
6. Verify product still in cart

**Expected Results:**
- Cart updates immediately
- Cart persists in localStorage
- Cart survives page refresh
- Cart icon shows correct item count

**Code Location:** `client/contexts/CartContext.tsx`

---

### ✅ Test 2: Generate Panier Code

**Steps:**
1. Add product to cart
2. Go to `/checkout`
3. Fill in form fields:
   - Name: "Jean Dupont"
   - Email: "jean@example.com"
   - Phone: "+33 1 23 45 67 89"
   - Address: "123 Rue de la Paix"
   - City: "Paris"
   - Postal Code: "75001"
4. Click "Confirmer la commande" button
5. Check browser console for response

**Expected Results:**
- Form validates without errors
- API request to `/api/orders` with POST method
- Response includes `panierCode` (format: `PANIER-XXXXXXXX-XXXXXXX`)
- Response includes `orderId`
- Response: `{ success: true, message: "Commande créée avec succès", panierCode: "...", orderId: "..." }`

**Code Location:** `server/routes/orders.ts` → `createOrder` function (line 87)

---

### ✅ Test 3: Submit Order (Commande)

**Steps:**
1. Complete Test 1 & 2
2. Observe the confirmation form submission
3. Check that:
   - Loading indicator appears while submitting
   - No duplicate orders are created (verify in database)
   - Request completes within reasonable time (<5 seconds)

**Expected Results:**
- Order stored in database with:
  - Unique `id` (format: `order_TIMESTAMP_RANDOM`)
  - Unique `panier_code` (format: `PANIER-XXXXXXXX-XXXXXXX`)
  - Customer information from form
  - Order `status: "en attente"`
  - `created_at` timestamp
- Order items stored in `order_items` table with:
  - `order_id` reference
  - `product_id`, `name`, `quantity`, `price`

**Code Location:** 
- `server/routes/orders.ts` → `createOrder` (lines 98-131)
- Database inserts: `orders` table (lines 99-115), `order_items` table (lines 118-131)

---

### ✅ Test 4: Confirmation State Display

**Steps:**
1. Complete Test 1-3
2. After successful order creation, page should display:
   - "Commande confirmée !" heading
   - Green checkmark icon
   - Panier code in highlighted box
   - "Support Client" section with phone number
   - Next steps (1. We'll call, 2. Delivery details, 3. Fast delivery)
   - "Continuer les achats" and "Retour à l'accueil" buttons

**Expected Results:**
- Confirmation screen displays with all required elements
- Panier code is visible and matches what was returned from API
- Cart is cleared (no items in cart after refresh)
- User can proceed to shop again or return home

**Code Location:** `client/pages/Checkout.tsx` (lines 152-270)

---

### ✅ Test 5: Order Data Retrieval

**Steps:**
1. After creating an order with panier code `PANIER-ABC12345-XYZ7890`
2. Test retrieval endpoints:
   ```bash
   # By panier code
   curl "http://localhost:8080/api/orders/panier/PANIER-ABC12345-XYZ7890"
   
   # By order ID (from response)
   curl "http://localhost:8080/api/orders/{orderId}"
   
   # All orders (admin)
   curl "http://localhost:8080/api/orders"
   
   # Search by customer name
   curl "http://localhost:8080/api/orders/search?query=jean"
   ```

**Expected Results:**
- Panier code lookup returns the exact order
- Order ID lookup returns the exact order
- All orders includes the new order
- Search finds the order by customer name/email/phone
- Order includes all customer information
- Order includes all items with correct quantities and prices
- Order status is "en attente"

**Code Location:** `server/routes/orders.ts` → `getOrderByPanierCode`, `getOrderById`, `getOrders`, `searchOrders`

---

### ✅ Test 6: No Duplicate Orders

**Steps:**
1. Create an order
2. Verify order appears exactly once in database
3. Immediately submit the form again (rapid double-submit)
4. Verify only 2 separate orders created, not duplicates of the same order

**Expected Results:**
- Each order has unique `id` and `panier_code`
- No accidentally duplicated order items
- Double-submit creates 2 separate orders, not duplicates

**Protection:**
- Unique ID generation: `order_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
- Each insert is atomic in Supabase
- Client should disable button after submission to prevent accidental re-submission

---

### ✅ Test 7: Cart Persistence on Refresh

**Steps:**
1. Add 2 products to cart
2. Note the total
3. Refresh the page
4. Verify cart still contains same products with same quantities
5. Go to checkout and verify total is correct
6. Submit order with that total

**Expected Results:**
- Cart persists via localStorage
- No data loss on refresh
- Order total matches cart total
- Checkout price matches order price in database

---

### ✅ Test 8: Form Validation

**Test 8a: Empty Fields**
- Leave each field blank one by one
- Click submit
- Expect error message for each field

**Test 8b: Invalid Email**
- Enter "not-an-email"
- Click submit
- Expect "L'email n'est pas valide" error

**Test 8c: Invalid Phone**
- Enter "abc123"
- Click submit
- Expect "Le téléphone n'est pas valide" error

**Expected Results:**
- All validation errors display correctly
- Form doesn't submit invalid data
- Error messages clear when user corrects field

**Code Location:** `client/pages/Checkout.tsx` → `validateForm` (lines 31-64)

---

### ✅ Test 9: Empty Cart Handling

**Steps:**
1. Clear cart (remove all items)
2. Try to navigate to `/checkout`
3. Observe page behavior

**Expected Results:**
- Checkout page shows "Panier Vide" message
- Button to "Continuer les achats" is available
- Cannot submit empty order

**Code Location:** `client/pages/Checkout.tsx` (lines 126-149)

---

### ✅ Test 10: Async Email Handling

**Steps:**
1. Create an order
2. Order should be confirmed immediately (within 1 second)
3. Emails are sent asynchronously in background

**Expected Results:**
- Order confirmation page appears immediately
- Emails are sent in background (may take 2-5 seconds)
- If email service is down, order still succeeds (email is non-blocking)
- Error logs appear for failed email attempts

**Code Location:** `server/routes/orders.ts` (lines 140-169)

---

## Database Schema Verification

### Orders Table

```sql
CREATE TABLE orders (
  id VARCHAR PRIMARY KEY,
  panier_code VARCHAR UNIQUE,
  customer_name VARCHAR,
  customer_email VARCHAR,
  customer_phone VARCHAR,
  customer_address VARCHAR,
  customer_city VARCHAR,
  customer_postal_code VARCHAR,
  total DECIMAL,
  status VARCHAR, -- 'en attente', 'en cours', 'livré', 'annulé'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Order Items Table

```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id VARCHAR REFERENCES orders(id),
  product_id VARCHAR,
  name VARCHAR,
  price DECIMAL,
  quantity INTEGER,
  created_at TIMESTAMP
)
```

---

## Phase 2 Checklist

### Functionality
- [ ] Products can be added to cart
- [ ] Cart persists on page refresh
- [ ] Cart calculates total correctly
- [ ] Checkout form validates input
- [ ] Order is created on submit
- [ ] Panier code is generated and returned
- [ ] Confirmation screen displays
- [ ] Cart is cleared after order
- [ ] No duplicate orders created

### Data Integrity
- [ ] Order contains all customer information
- [ ] Order items contain correct product data
- [ ] Quantities are correct
- [ ] Prices are correct
- [ ] Totals are correct
- [ ] Order IDs are unique
- [ ] Panier codes are unique

### Error Handling
- [ ] Validation errors display properly
- [ ] Empty cart is handled
- [ ] API errors show user-friendly messages
- [ ] No internal errors exposed to user

### Email System (Phase 3, but test here)
- [ ] Customer receives confirmation email
- [ ] Admin receives order notification
- [ ] Order still succeeds if email fails
- [ ] Email includes order details

---

## Test Script

Run this script to test the order flow end-to-end:

```bash
#!/bin/bash

# Test 1: Create order with valid data
echo "🧪 Test 1: Creating order..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+33 1 23 45 67 89",
      "address": "123 Test Street",
      "city": "Paris",
      "postalCode": "75001"
    },
    "items": [
      {
        "id": "prod-1",
        "name": "Product 1",
        "price": 99.99,
        "quantity": 2
      }
    ],
    "total": 199.98
  }')

echo "Response: $RESPONSE"

# Extract panier code
PANIER_CODE=$(echo $RESPONSE | grep -o '"panierCode":"[^"]*' | cut -d'"' -f4)
ORDER_ID=$(echo $RESPONSE | grep -o '"orderId":"[^"]*' | cut -d'"' -f4)

echo "✅ Order created with panier code: $PANIER_CODE"
echo "✅ Order ID: $ORDER_ID"

# Test 2: Retrieve by panier code
echo "\n🧪 Test 2: Retrieving order by panier code..."
curl -s http://localhost:8080/api/orders/panier/$PANIER_CODE | jq .

# Test 3: Retrieve by ID
echo "\n🧪 Test 3: Retrieving order by ID..."
curl -s http://localhost:8080/api/orders/$ORDER_ID | jq .

# Test 4: Search orders
echo "\n🧪 Test 4: Searching orders..."
curl -s 'http://localhost:8080/api/orders/search?query=Test' | jq .

echo "\n✅ All tests completed!"
```

---

## Phase 2 Success Criteria

✅ **Order Creation:**
- Order successfully created in database
- Panier code generated and returned
- Order contains all customer data
- Order items correctly stored
- Total price calculated correctly

✅ **Order Confirmation:**
- "Commande confirmée !" message displays
- Panier code visible to user
- Cart cleared after order
- User can continue shopping

✅ **Data Integrity:**
- No duplicate orders
- All data survives on refresh
- Prices and totals match

✅ **Error Handling:**
- Invalid data rejected
- Clear error messages
- No crashes or 500 errors

---

## Next Steps

→ **Phase 3:** Email confirmation system implementation
- Email sending when order is confirmed
- Customer confirmation email
- Admin notification email
- Email template with order details

