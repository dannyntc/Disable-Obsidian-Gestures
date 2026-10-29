import { Notice, Platform, Plugin } from "obsidian";
import { setupIpadGestureBlocker } from "./setup";

export default class DisableSidebarSwipesPlugin extends Plugin {
  async onload(): Promise<void> {
    const cleanup = setupIpadGestureBlocker(
      Platform,
      navigator,
      this.app.workspace,
      (message) => new Notice(message),
    );

    this.register(cleanup);
  }
}
