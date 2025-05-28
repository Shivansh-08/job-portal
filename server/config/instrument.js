// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://9ddc01bc0b98dc890cd9b4c6f5bd095a@o4509403239415818.ingest.us.sentry.io/4509403242037248",

  integrations: [Sentry.mongoIntegration()],

 

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});