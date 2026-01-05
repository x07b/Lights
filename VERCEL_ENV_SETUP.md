# Vercel Environment Variables Setup

## Required Environment Variables

Your Vercel deployment needs the following environment variables set:

1. **SUPABASE_URL** - Your Supabase project URL
   - Format: `https://xxxxx.supabase.co`
   - Find it in: Supabase Dashboard → Project Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY** - Your Supabase service role key (admin key)
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Find it in: Supabase Dashboard → Project Settings → API → service_role key
   - ⚠️ **IMPORTANT**: This is a secret key - never commit it to git!
   - ⚠️ Use the `service_role` key, NOT the `anon` key

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add each variable:
   - **Key**: `SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**
   
   Repeat for `SUPABASE_SERVICE_ROLE_KEY`

5. **Redeploy** your application after adding the variables
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

## Verify Setup

After redeploying, test your API endpoints:
- `GET /api/products` should return product list (JSON)
- `GET /api/collections` should return collections (JSON)
- `GET /api/orders` should return orders (JSON)

If you still get 500 errors, check the Vercel function logs:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click on **Functions** tab
4. Click on the function that's failing
5. Check the **Logs** tab for error messages

## Common Issues

### 500 Internal Server Error
- **Cause**: Missing environment variables
- **Solution**: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel

### "Missing Supabase environment variables" error
- **Cause**: Environment variables not set or incorrect
- **Solution**: Verify variables are set correctly in Vercel dashboard

### Database connection errors
- **Cause**: Wrong Supabase URL or service role key
- **Solution**: Double-check the values in Supabase dashboard
