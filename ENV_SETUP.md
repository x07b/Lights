# Environment Configuration Guide

## Required Environment Variables

### Database & Backend Services

**Supabase** (Required for all environments):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Email Service** (Required for production order confirmation):

```
RESEND_API_KEY=re_xxxxxxxxxxxxxx
ADMIN_EMAIL=admin@luxence.fr  # Default: itsazizsaidi@gmail.com
```

### Optional Development Variables

```
NODE_ENV=development          # or 'production'
PING_MESSAGE=ping             # Default: 'ping'
PORT=8080                     # Server port (default: 8080)
```

## Environment Setup by Deployment Type

### Local Development

1. **Create .env file in project root:**

```bash
cp .env.example .env
```

2. **Fill in required variables:**

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
RESEND_API_KEY=<your-resend-api-key>
ADMIN_EMAIL=admin@luxence.fr
NODE_ENV=development
```

3. **Run development server:**

```bash
pnpm dev
```

### Vercel Deployment

1. **Via Dashboard:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required variables from above
   - Variables will be available to all function deployments

2. **Via Vercel CLI:**

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL
```

3. **Key Points:**
   - Environment variables are automatically picked up by serverless functions
   - Ensure variables are set for "Production" environment
   - Secrets (like API keys) are encrypted and not exposed in logs

### Netlify Deployment

1. **Via Dashboard:**
   - Go to Site Settings → Build & Deploy → Environment
   - Add variables in "Environment variables" section
   - Apply to all build contexts or specific ones

2. **Via netlify.toml:**

```toml
[build]
  environment = { SUPABASE_URL = "...", RESEND_API_KEY = "..." }
```

3. **Key Points:**
   - Variables defined in netlify.toml are for build time
   - For runtime variables (functions), use Netlify UI
   - Ensure API functions in netlify/functions/ can access env vars

## Critical Settings for Production

### Security

**DO:**

- ✅ Always use Service Role Key (not Anon Key) in server code
- ✅ Keep API keys secure in environment variables
- ✅ Use HTTPS only in production
- ✅ Validate and sanitize all user inputs

**DON'T:**

- ❌ Commit .env files to git
- ❌ Log sensitive information (keys, passwords)
- ❌ Expose service keys in client-side code
- ❌ Use development API keys in production

### Email Configuration

The email system uses **Resend** for production.

**Sender Email:**

- Currently hardcoded as: `notifications@luxence.fr`
- Change in `server/lib/email.ts` if needed

**Customer Email Confirmation:**

- Triggered automatically after successful order creation
- Includes order details, panier code, and total

**Admin Notification:**

- Sent to `ADMIN_EMAIL` environment variable
- Notifies admin of new orders

**Troubleshooting Email Issues:**

- If `RESEND_API_KEY` is not set, emails fail silently (returns success: false)
- Check CloudWatch/Function logs for email errors
- Verify email address is confirmed in Resend

### Database (Supabase)

**Tables Required:**

- `products` - Product catalog
- `product_images` - Product images with order_index
- `product_specifications` - Product specs with order_index
- `collections` - Product collections
- `orders` - Customer orders
- `order_items` - Items within orders
- `visitors` - Visitor analytics (optional)
- `hero_slides` - Homepage hero content
- `quote_requests` - Customer quote requests
- `product_details` - Additional product details
- `contact_messages` - Contact form submissions

**Migration:**
Run migrations/database setup script before deploying:

```bash
# Check database connection
pnpm run test-db-connection

# Run migrations if needed
# (Ensure migrations are configured in your Supabase project)
```

## Verification Checklist

Before deploying to production, verify:

- [ ] All required environment variables are set
- [ ] Supabase credentials are valid and tables exist
- [ ] Resend API key is valid (production sender verified)
- [ ] NODE_ENV is set appropriately
- [ ] Database migrations are applied
- [ ] API endpoints are accessible (test /api/ping)
- [ ] Email sending works (test with /api/orders)
- [ ] File uploads work (/api/upload)

## Testing Environment Variables

**Check Supabase connection:**

```bash
curl https://your-domain/api/debug
```

**Check email configuration:**

- Trigger an order and verify confirmation email is sent
- Check admin email receives order notification

**Check file uploads:**

```bash
curl -X POST https://your-domain/api/upload \
  -H "x-filename: test.jpg" \
  --data-binary @test.jpg
```

## Troubleshooting

### "Missing Supabase environment variables" error

- Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check variables in deployment platform settings
- Verify values are not truncated or have extra spaces

### Email not sending

- Verify `RESEND_API_KEY` is set and valid
- Check Resend dashboard for account status
- Verify sender email is confirmed in Resend
- Check function logs for error messages
- Use `/api/orders` endpoint to test end-to-end

### Database connection errors

- Verify Supabase URL is correct (https://xyz.supabase.co)
- Check service role key has database access
- Ensure network allows connections to Supabase
- Check Supabase project status in dashboard

### Vercel/Netlify deployment fails

- Review build logs for environment variable issues
- Ensure environment variables are marked for the correct environment
- For Netlify Functions, restart the deployment after updating env vars
- Check that .env file is in .gitignore (don't commit secrets)
