interface ConfigState {
    baseURL: string;
    licenseKey: string;
}
declare class ConfigManager {
    private static instance;
    private state;
    private constructor();
    private getBaseURLFromPackageJson;
    private getLicenseKeyFromPackageJson;
    static getInstance(): ConfigManager;
    setBaseURL(url: string): void;
    setLicenseKey(key: string): void;
    getConfig(): Readonly<ConfigState>;
}
export declare const configManager: ConfigManager;
export declare const setBaseURL: (url: string) => void;
export declare const setLicenseKey: (key: string) => void;
export declare const getConfig: () => Readonly<ConfigState>;
export {};
