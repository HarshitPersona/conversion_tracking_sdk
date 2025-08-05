export interface EnvironmentConfig {
  BASE_TRACKING_URL: string;
  BASE_API_URL: string;
}

export const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  production: {
    BASE_TRACKING_URL: 'https://track.pier39.ai',
    BASE_API_URL: 'https://api.pier39.ai',
  },
  staging: {
    BASE_TRACKING_URL: 'https://staging.personapay.tech/advertisers/campaign/conversion/webhook',
    BASE_API_URL: 'https://staging.personapay.tech/advertisers/campaign/conversion/webhook',
  },
  development: {
    BASE_TRACKING_URL: 'https://dev.personapay.tech/advertisers/campaign/conversion/webhook',
    BASE_API_URL: 'https://dev.personapay.tech/advertisers/campaign/conversion/webhook',
  },
};