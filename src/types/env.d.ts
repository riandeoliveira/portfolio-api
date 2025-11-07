// biome-ignore lint/style/noNamespace: needed for global types
namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: string;

    CLIENT_URL: string;

    MAIL_HOST: string;
    MAIL_PASSWORD: string;
    MAIL_PORT: string;
    MAIL_SENDER: string;
    MAIL_TO: string;
    MAIL_USERNAME: string;

    GITHUB_API_TOKEN: string;

    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: string;
  }
}
