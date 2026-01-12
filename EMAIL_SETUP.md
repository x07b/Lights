# Email Configuration and Setup Guide

## Overview

The application uses **Resend** for production email delivery. This guide covers setup, configuration, testing, and troubleshooting.

---

## What Gets Sent

### 1. Customer Order Confirmation Email

**Triggered:** When order is successfully created

**Recipients:** Customer email from checkout form

**Subject:** `Confirmation de Commande - {PANIER_CODE}`

**Contents:**

- Greeting with customer name
- Order confirmation message
- Panier code (highlighted)
- Order items table:
  - Product name
  - Quantity
  - Unit price
  - Line total
- Total amount
- Follow-up message about call verification

**Template:** `server/lib/email.ts` → `sendOrderConfirmationEmail` (lines 56-121)

---

### 2. Admin Order Notification Email

**Triggered:** When order is successfully created

**Recipients:** Email from `ADMIN_EMAIL` environment variable (default: itsazizsaidi@gmail.com)

**Subject:** `[NOUVELLE COMMANDE] {PANIER_CODE} - {CUSTOMER_NAME}`

**Contents:**

- New order notification header
- Panier code (highlighted)
- Customer information:
  - Name
  - Email (clickable)
- Order items table (same as customer email)
- Call-to-action to process the order

**Template:** `server/lib/email.ts` → `sendOrderAdminNotificationEmail` (lines 124-199)

---

### 3. Quote Request Confirmation (Optional)

**Triggered:** When quote request is submitted (via `/api/quotes` endpoint)

**Recipients:** Client email from quote form

**Subject:** `Demande de Devis Reçue - {PRODUCT_NAME}`

**Template:** `server/lib/email.ts` → `sendQuoteRequestConfirmationEmail`

---

## Setup Instructions

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for free account
3. Create a project/workspace
4. Go to Settings → API Keys
5. Copy your API key

### Step 2: Add Domain

**For Production:**

1. In Resend dashboard, go to Domains
2. Add your domain (e.g., luxence.fr)
3. Add DNS records:
   - **SPF:** `v=spf1 include:resend.com ~all`
   - **DKIM:** (Resend provides the exact record)
   - **Return-Path:** (Optional, for bounce handling)
4. Verify domain status

**For Development:**

1. Use a verified sending address during development
2. Or use the test domain Resend provides

**Current Sender:**

```
notifications@luxence.fr
```

> ⚠️ **Important:** This sender must be verified in Resend before production use!

### Step 3: Configure Environment Variables

**Local Development (.env file):**

```env
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=admin@luxence.fr
```

**Vercel:**

1. Go to Project Settings → Environment Variables
2. Add:
   - Key: `RESEND_API_KEY`
   - Value: (your API key)
   - Environments: Production, Preview, Development
3. Redeploy

**Netlify:**

1. Go to Site Settings → Build & Deploy → Environment
2. Add:
   - Key: `RESEND_API_KEY`
   - Value: (your API key)

### Step 4: Test Email Sending

**Test 1: Using cURL**

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "your-email@gmail.com",
      "phone": "+33 1 23 45 67 89",
      "address": "123 Test St",
      "city": "Paris",
      "postalCode": "75001"
    },
    "items": [
      {
        "id": "test-1",
        "name": "Test Product",
        "price": 99.99,
        "quantity": 1
      }
    ],
    "total": 99.99
  }'
```

**Check Results:**

- [ ] Response returns `success: true` with `panierCode`
- [ ] Customer receives email to their inbox (may take 30-60 seconds)
- [ ] Admin receives email to configured `ADMIN_EMAIL`
- [ ] Check console logs for any errors: `npm run dev` output

**Test 2: Using Admin Dashboard**

1. Create an order via UI at `/checkout`
2. Check your inbox for confirmation email
3. Check admin email inbox for notification

---

## Configuration Options

### Environment Variables

```bash
# Required for production
RESEND_API_KEY=re_your_key_here

# Optional - customize admin email
ADMIN_EMAIL=admin@luxence.fr
```

### Customizing Sender Email

To change the sender email from `notifications@luxence.fr`:

1. Edit `server/lib/email.ts`
2. Find line: `from: "notifications@luxence.fr",`
3. Change to your verified sender email:
   ```typescript
   from: process.env.SENDER_EMAIL || "notifications@luxence.fr",
   ```
4. Add to environment variables:
   ```env
   SENDER_EMAIL=noreply@yourdomain.com
   ```

### Customizing Admin Email

Set via environment variable:

```env
ADMIN_EMAIL=orders@yourbusiness.com
```

---

## Email Template Customization

### Modifying Order Confirmation Email

**File:** `server/lib/email.ts` → `sendOrderConfirmationEmail` (lines 56-121)

**Key Sections:**

- **Greeting:** Line 66 - `Bonjour ${escapeHtml(customerName)},`
- **Main message:** Lines 67-69
- **Panier code display:** Lines 71-75
- **Items table:** Lines 77-103
- **Follow-up text:** Line 105
- **Footer:** Line 106

**Example Customization:**

```typescript
// Change greeting
p>Bonjour ${escapeHtml(customerName)}, Merci pour votre commande!

// Add tracking message
p>Vous pouvez suivre votre commande ici: https://luxence.fr/track/${panierCode}

// Change colors
background-color: #your-brand-color;
```

### Adding New Email Templates

1. Create new function in `server/lib/email.ts`:

   ```typescript
   export async function sendYourEmailName(
     to: string,
     subject: string,
     data: any,
   ): Promise<{ success: boolean; error?: string }> {
     const html = `
       <!-- Your HTML email template here -->
     `;
     return sendEmail({ to, subject, html });
   }
   ```

2. Call from appropriate route

---

## Troubleshooting

### Email Not Sending

**Check 1: API Key**

```bash
# Verify API key is set
echo $RESEND_API_KEY
# Should output: re_xxxxxxxxxxxxx
```

**Check 2: Sender Domain Verification**

1. Go to Resend dashboard
2. Check if `notifications@luxence.fr` is verified
3. If not, verify the domain or use a verified test address

**Check 3: Environment Variables**

```bash
# In Vercel/Netlify, check deployment logs
# Look for any error messages from Resend
```

**Check 4: Network Access**

- Ensure server can access `api.resend.com`
- Check firewall/proxy rules

### Email Validation Error

**Issue:** `"RESEND_API_KEY environment variable is not set"`

**Solution:**

1. Verify `.env` file has the key (development)
2. Verify Netlify/Vercel environment variables set
3. Restart dev server or redeploy

### Email Showing as Spam

**Issue:** Customer emails go to spam folder

**Solutions:**

1. **Verify SPF/DKIM** in Resend dashboard
2. **Use branded domain** instead of `notifications@luxence.fr`
3. **Add unsubscribe link** to emails (optional):
   ```html
   <a href="{{unsubscribe}}">Unsubscribe</a>
   ```

### Email Arrives Late

**Issue:** Emails take 5+ minutes to arrive

**Note:** This is normal for first-time sends. Resend might take 30-60 seconds.

**Optimization:**

1. Check Resend logs for queue delays
2. Monitor API rate limits
3. Consider upgrading Resend plan if high volume

---

## Testing Checklist

### Pre-Launch Testing

- [ ] RESEND_API_KEY set in environment
- [ ] Admin email configured
- [ ] Domain verified in Resend
- [ ] Test order created
- [ ] Customer email received
- [ ] Admin email received
- [ ] Email content looks correct
- [ ] Links work in email
- [ ] HTML renders properly
- [ ] No special characters broken
- [ ] Panier code visible

### Production Testing

- [ ] Production API key working
- [ ] Emails sent within 1 minute
- [ ] Email logs visible in Resend dashboard
- [ ] No emails in spam (check for 24 hours)
- [ ] Admin receives all new orders
- [ ] Customers receive confirmations

---

## Monitoring and Analytics

### Resend Dashboard

1. Go to https://resend.com → Emails
2. View:
   - Email delivery status
   - Open rates
   - Click rates
   - Bounce/complaint rates
   - Failed sends

### Application Logging

**Check logs in:**

- Local: `npm run dev` output
- Vercel: Deployment logs → Function logs
- Netlify: Logs → Functions

**Example Error Log:**

```
Error sending email to customer: Invalid API key
Email sent successfully: order-12345
Failed to send admin notification: Invalid recipient domain
```

---

## Advanced: Custom Email Service

If you prefer a different email provider:

1. Create a new function in `server/lib/email.ts`
2. Replace Resend calls with your provider (SendGrid, AWS SES, Nodemailer, etc.)
3. Keep the same function signatures for compatibility

**Example with Nodemailer:**

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return new Promise(async (resolve) => {
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL || "noreply@luxence.fr",
        to,
        subject,
        html,
      });
      resolve({ success: true });
    } catch (error) {
      resolve({ success: false, error: error.message });
    }
  });
}
```

---

## Email Security

### XSS Prevention

All user-provided data is HTML-escaped using `escapeHtml()` function:

```typescript
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

### Best Practices

- ✅ Never expose API keys in emails or frontend
- ✅ Always escape user input in email templates
- ✅ Use HTTPS for tracking links
- ✅ Verify sender domain in Resend
- ✅ Monitor bounce/complaint rates

---

## Cost Estimation

**Resend Pricing:**

- Free tier: 100 emails/day
- $20/month: 100,000 emails/month
- Pay-as-you-go: $0.10 per 1,000 emails

**Example Costs:**

- 100 orders/month = ~$0.20 (2 emails per order)
- 1,000 orders/month = ~$2.00
- 10,000 orders/month = ~$20.00

---

## Support & Documentation

- **Resend Docs:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Status Page:** https://status.resend.com
