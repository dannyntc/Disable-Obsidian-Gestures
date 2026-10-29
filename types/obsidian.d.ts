declare module "obsidian" {
  export interface App {
    workspace: {
      trigger(eventName: string, ...args: unknown[]): unknown;
    };
  }

  export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    minAppVersion: string;
    [key: string]: unknown;
  }

  export class Plugin {
    app: App;
    manifest: PluginManifest;
    constructor(app: App, manifest: PluginManifest);
    register(cleanup: () => void): void;
  }

  export class Notice {
    constructor(message: string, timeout?: number);
  }

  export const Platform: {
    isIosApp: boolean;
    isTablet: boolean;
  };
}
