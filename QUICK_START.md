# Quick Start Guide - Test Everything

## ✅ Setup Complete!

Everything has been debugged and configured. Your Supabase database is connected and ready.

## 🚀 Quick Test (3 Steps)

### Step 1: Test Database Connection

```bash
npx tsx scripts/test-db-connection.ts
```

This will verify your Supabase connection and show how many records are in each table.

**Expected Output:**
```
✅ Collections table accessible. Found X collections
✅ Products table accessible. Found X products
✅ Orders table accessible. Found X orders
✅ Contact_messages table accessible. Found X messages
```

### Step 2: Start Development Server

In one terminal:

```bash
pnpm dev
```

Wait for: `ready in XXX ms` message

### Step 3: Test API Endpoints

In a **NEW terminal** (keep server running):

**Option A: Run automated test script**
```bash
./test-api.sh
```

**Option B: Test manually with curl**

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

# Test get orders
curl http://localhost:8080/api/orders
```

## ✅ What's Fixed

- ✅ Supabase connection configured
- ✅ All API routes working
- ✅ Serverless function ready for Vercel
- ✅ Deprecated `.substr()` replaced with `.substring()`
- ✅ Database connection tested
- ✅ Test scripts created

## 📋 For Vercel Deployment

You need to set these environment variables in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `SUPABASE_URL` = `https://zfkkcfiqttbffwzgirhp.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your key from .env file)

That's it! Everything else is already configured.

## 🎯 Next Steps

1. Run database connection test
2. Start dev server  
3. Test endpoints with curl
4. Configure Vercel env vars
5. Deploy!

All set! 🎉
