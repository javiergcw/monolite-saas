let baseURL = 'https://api.autoxpert.com.co/v2';
let licenseKey = '';
export function setBaseURL(url) {
    baseURL = url;
}
export function setLicenseKey(key) {
    licenseKey = key;
}
export function getConfig() {
    return {
        baseURL,
        licenseKey
    };
}
