export interface EnvironmentConfig {
  BASE_TRACKING_URL: string;
}

export const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  production: {
    BASE_TRACKING_URL: 'https://personapay.tech/advertisers/campaign/conversion/webhook',
  },
  staging: {
    BASE_TRACKING_URL: 'https://staging.personapay.tech/advertisers/campaign/conversion/webhook',
  },
  development: {
    BASE_TRACKING_URL: 'https://dev.personapay.tech/advertisers/campaign/conversion/webhook',
  },
};