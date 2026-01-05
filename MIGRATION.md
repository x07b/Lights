# Migration Guide

## Step 1: Update Database Schema

First, you need to update your Supabase database schema to make `collection_id` nullable:

1. Go to your Supabase project SQL Editor
2. Run this SQL to alter the products table:

```sql
-- Make collection_id nullable
ALTER TABLE products 
  ALTER COLUMN collection_id DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS products_collection_id_fkey;

-- Re-add foreign key constraint with SET NULL on delete
ALTER TABLE products 
  ADD CONSTRAINT products_collection_id_fkey 
  FOREIGN KEY (collection_id) 
  REFERENCES collections(id) 
  ON DELETE SET NULL;
```

Or, if you prefer to recreate the table (⚠️ this will delete existing data):

Run the updated `schema.sql` file (the collection_id is now nullable).

## Step 2: Run Migration Script

To migrate your existing products from `data.json` to Supabase:

1. Make sure your `.env` file has the correct Supabase credentials:
   ```
   SUPABASE_URL=https://zfkkcfiqttbffwzgirhp.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. Install dependencies (if not already installed):
   ```bash
   pnpm install
   ```

3. Run the migration script:
   ```bash
   npx tsx scripts/migrate-data.ts
   ```

The script will:
- Import collections from `data.json`
- Import products with their images and specifications
- Skip items that already exist (safe to run multiple times)

## Step 3: Test the Changes

After migration:
- Products can now be created without a collection
- Products without a collection will appear on the `/produits` page
- Collection field is now optional in the admin panel

## Note on Vercel API Errors

The API errors you're seeing on Vercel (405 Method Not Allowed) are because Vercel is only deploying the static SPA, not the Express server. The API routes need to be set up as Vercel serverless functions.

For now, the API will only work in local development. To deploy the API on Vercel, you'll need to:
1. Set up Vercel serverless functions for each API route, OR
2. Use a different deployment platform for the API (like Railway, Render, or Fly.io), OR
3. Deploy the full-stack app using a platform that supports Express (like Railway or Render)
