import { installSwipeBlocker, type SwipeEmitter } from "./gesture-filter";
import { isIpadOS, type NavigatorLike, type ObsidianPlatformLike } from "./platform";

export const DISPATCHER_UNAVAILABLE_MESSAGE =
  "Obsidian did not expose its swipe dispatcher; sidebar swipes remain enabled.";

export function setupIpadGestureBlocker(
  platform: ObsidianPlatformLike,
  navigatorLike: NavigatorLike,
  workspace: SwipeEmitter | null | undefined,
  onCompatibilityIssue: (message: string) => void = () => undefined,
): () => void {
  if (!isIpadOS(platform, navigatorLike)) return () => undefined;
  if (!workspace || typeof workspace.trigger !== "function") {
    onCompatibilityIssue(DISPATCHER_UNAVAILABLE_MESSAGE);
    return () => undefined;
  }

  try {
    return installSwipeBlocker(workspace);
  } catch {
    onCompatibilityIssue(DISPATCHER_UNAVAILABLE_MESSAGE);
    return () => undefined;
  }
}
