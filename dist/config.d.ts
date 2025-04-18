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
    getConfig(): Readonly<ConfigState>;
}
export declare const configManager: ConfigManager;
export declare const getConfig: () => Readonly<ConfigState>;
export {};
