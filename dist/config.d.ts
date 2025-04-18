interface ConfigState {
    baseURL: string;
    licenseKey: string;
}
declare class ConfigManager {
    private static instance;
    private state;
    private constructor();
    private getBaseURL;
    private getLicenseKey;
    static getInstance(): ConfigManager;
    getConfig(): Readonly<ConfigState>;
}
export declare const configManager: ConfigManager;
export declare const getConfig: () => Readonly<ConfigState>;
export {};
