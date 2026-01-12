/**
 * Environment Variable Validator
 * Checks for required and optional environment variables at server startup
 */

export interface EnvConfig {
  required: string[];
  optional: string[];
  requiredForProduction: string[];
}

const ENV_CONFIG: EnvConfig = {
  // These must always be present
  required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],

  // Optional but recommended for production
  requiredForProduction: ["RESEND_API_KEY"],

  // Optional variables
  optional: ["NODE_ENV", "ADMIN_EMAIL", "PING_MESSAGE", "PORT"],
};

/**
 * Validate environment configuration
 * Returns validation result with warnings/errors
 */
export function validateEnv(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProd = process.env.NODE_ENV === "production";

  // Check required variables
  ENV_CONFIG.required.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Check production-only requirements
  if (isProd) {
    ENV_CONFIG.requiredForProduction.forEach((varName) => {
      if (!process.env[varName]) {
        warnings.push(
          `Missing ${varName} in production mode. Email features will not work.`,
        );
      }
    });
  }

  // Validate format of specific variables
  if (
    process.env.SUPABASE_URL &&
    !process.env.SUPABASE_URL.startsWith("https://")
  ) {
    errors.push("SUPABASE_URL must be a valid HTTPS URL");
  }

  if (
    process.env.ADMIN_EMAIL &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.ADMIN_EMAIL)
  ) {
    warnings.push("ADMIN_EMAIL does not appear to be a valid email address");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log validation results
 */
export function logValidationResults(
  validation: ReturnType<typeof validateEnv>,
) {
  if (validation.errors.length > 0) {
    console.error("❌ Configuration errors:");
    validation.errors.forEach((err) => console.error(`   - ${err}`));
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️  Configuration warnings:");
    validation.warnings.forEach((warn) => console.warn(`   - ${warn}`));
  }

  if (validation.valid && validation.warnings.length === 0) {
    console.log("✅ Environment configuration valid");
  }
}

/**
 * Assert configuration is valid or throw
 */
export function assertValidEnv() {
  const validation = validateEnv();
  logValidationResults(validation);

  if (!validation.valid) {
    throw new Error(
      `Invalid environment configuration. ${validation.errors.length} error(s) found. See logs above.`,
    );
  }
}

/**
 * Get environment configuration summary for debugging
 */
export function getEnvSummary() {
  return {
    nodeEnv: process.env.NODE_ENV || "not set",
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasResendKey: !!process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL || "default (itsazizsaidi@gmail.com)",
  };
}
