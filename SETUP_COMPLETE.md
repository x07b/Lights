# Setup Complete - Testing Guide

## ✅ Setup Status

All files have been debugged and configured. Your Supabase connection is set up with:
- ✅ Database URL: `https://zfkkcfiqttbffwzgirhp.supabase.co`
- ✅ Service Role Key: Configured
- ✅ API routes: All configured
- ✅ Serverless function: Ready for Vercel

## 🧪 Testing Locally

### Step 1: Test Database Connection

First, verify your Supabase database connection:

```bash
npx tsx scripts/test-db-connection.ts
```

This will test all your database tables and show you how many records are in each.

### Step 2: Start the Development Server

```bash
pnpm dev
```

Or if using npm:

```bash
npm run dev
```

Wait for the server to start (you'll see "ready" message).

### Step 3: Test API Endpoints

Open a **new terminal** (keep the server running) and run:

```bash
./test-api.sh
```

Or test individual endpoints manually:

#### Test Ping Endpoint
```bash
curl http://localhost:8080/api/ping
```

Expected: `{"message":"ping"}`

#### Test Products Endpoint
```bash
curl http://localhost:8080/api/products
```

Expected: JSON array of products (may be empty if no products yet)

#### Test Collections Endpoint
```bash
curl http://localhost:8080/api/collections
```

Expected: JSON array of collections

#### Test Create Order Endpoint
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "address": "123 Test St",
      "city": "Test City",
      "postalCode": "12345"
    },
    "items": [
      {
        "id": "test-1",
        "name": "Test Product",
        "price": 29.99,
        "quantity": 2
      }
    ],
    "total": 59.98
  }'
```

Expected: `{"success":true,"message":"Commande créée avec succès","panierCode":"PANIER-...","orderId":"order_..."}`

#### Test Get Orders Endpoint
```bash
curl http://localhost:8080/api/orders
```

Expected: JSON object with `orders` array and `count`

## 🚀 Deployment to Vercel

### What You Need to Configure in Vercel:

1. **Environment Variables** (Project Settings → Environment Variables):
   - `SUPABASE_URL` = `https://zfkkcfiqttbffwzgirhp.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key from .env

2. **Install Command** (if needed):
   - Go to Settings → General → Install Command
   - Override with: `pnpm install --no-frozen-lockfile` (if lockfile issues occur)

3. **Build Command** (already configured in vercel.json):
   - Should be: `npm run build:client`

4. **Output Directory** (already configured):
   - Should be: `dist/spa`

### After Deployment:

Your API endpoints will be available at:
- `https://your-project.vercel.app/api/ping`
- `https://your-project.vercel.app/api/products`
- `https://your-project.vercel.app/api/orders`
- etc.

## 📋 Checklist

- [x] Supabase connection configured
- [x] All API routes set up
- [x] Serverless function configured for Vercel
- [x] Database schema ready (run schema.sql in Supabase if not done)
- [x] Migration script ready (scripts/migrate-data.ts)
- [x] Test database connection locally
- [ ] Test API endpoints locally
- [ ] Configure Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Test deployed endpoints

## 🐛 Troubleshooting

### If database connection fails:
1. Verify `.env` file has correct credentials
2. Check Supabase project is active
3. Run `npx tsx scripts/test-db-connection.ts` to diagnose

### If API endpoints return 500 errors:
1. Check server logs for error messages
2. Verify database tables exist (run schema.sql)
3. Check environment variables are loaded

### If Vercel deployment fails:
1. Check function logs in Vercel dashboard
2. Verify environment variables are set
3. Check build logs for errors

## 📝 Next Steps

1. **Run database connection test**: `npx tsx scripts/test-db-connection.ts`
2. **Start dev server**: `pnpm dev`
3. **Test endpoints**: Use `./test-api.sh` or individual curl commands
4. **Migrate data** (if needed): `npx tsx scripts/migrate-data.ts`
5. **Configure Vercel**: Set environment variables
6. **Deploy**: Push to GitHub (Vercel will auto-deploy)

Everything is ready to test! 🎉
