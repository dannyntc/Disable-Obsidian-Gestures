export interface ObsidianPlatformLike {
  isIosApp: boolean;
  isTablet: boolean;
}

export interface NavigatorLike {
  platform?: string;
  maxTouchPoints?: number;
  userAgent?: string;
}

export function isIpadOS(
  platform: ObsidianPlatformLike,
  navigatorLike: NavigatorLike,
): boolean {
  if (!platform.isIosApp) return false;
  if (platform.isTablet) return true;

  const desktopMode =
    navigatorLike.platform === "MacIntel" ||
    /Macintosh/.test(navigatorLike.userAgent ?? "");
  return desktopMode && (navigatorLike.maxTouchPoints ?? 0) > 1;
}
