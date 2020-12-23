import { ConfigurationService } from '../src/_services/configuration/configuration.service';

export const mockConfigurationService = (
  env: NodeJS.ProcessEnv,
): Partial<ConfigurationService> => {
  return {
    getEnvironmentConfig: (key: string) => env[key],
  };
};
