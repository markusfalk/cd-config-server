export const enum errorMessages {
  missingKey = `The config file must include the key 'compatibleWithAppVersion'`,
  nonSemver = `The provided app-version is not compatible with semantic versioning`,
  noConfig = `Could not find config file that is compatible with app version`,
}
