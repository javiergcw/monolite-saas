let baseURL = 'https://api.autoxpert.com.co/v2';
let licenseKey = '';

export function setBaseURL(url: string) {
  baseURL = url;
}

export function setLicenseKey(key: string) {
  licenseKey = key;
}

export function getConfig() {
  return {
    baseURL,
    licenseKey
  };
}
