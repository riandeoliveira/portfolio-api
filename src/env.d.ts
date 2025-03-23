namespace NodeJS {
  interface ProcessEnv {
    ALLOWED_ORIGIN?: string;

    EMAIL_PRIVATE_KEY?: string;
    EMAIL_PUBLIC_KEY?: string;
    EMAIL_SERVICE_ID?: string;
    EMAIL_TEMPLATE_ID?: string;

    GITHUB_API_TOKEN?: string;
    GITHUB_USER_CONTENT_URL?: string;

    NODE_ENV: "development" | "production";
  }
}
