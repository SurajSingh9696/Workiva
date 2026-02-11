/**
 * Navigation utility functions for active link detection
 */

/**
 * Normalize a URL path by removing query params, hash, and trailing slashes
 * @param url - The URL to normalize
 * @returns Normalized path
 *
 * @example
 * normalizePath('/dashboard/') // returns '/dashboard'
 * normalizePath('/dashboard/jobs?page=2') // returns '/dashboard/jobs'
 * normalizePath('/dashboard/jobs#section') // returns '/dashboard/jobs'
 */
export const normalizePath = (url: string): string => {
  // Remove query parameters and hash
  const clean = url.split("?")[0].split("#")[0];

  // Remove trailing slash (except for root "/")
  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
    // 👉 0 se start karo
    // 👉 last character se pehle tak lena (last character cut ho jayega)
  }

  return clean;
};

/**
 * Check if a link is active based on current pathname
 * @param pathname - Current pathname from usePathname()
 * @param href - Link href to check against
 * @param exact - Whether to match exactly or allow child routes (default: false)
 * @returns Boolean indicating if link is active
 *
 * @example
 * isActiveLink('/dashboard', '/dashboard', true) // true (exact match)
 * isActiveLink('/dashboard/jobs', '/dashboard/jobs') // true
 * isActiveLink('/dashboard/jobs/123', '/dashboard/jobs') // true (child route)
 * isActiveLink('/dashboard/jobs/123', '/dashboard/jobs', true) // false (not exact)
 */
export const isActiveLink = (
  pathname: string,
  href: string,
  exact = false,
): boolean => {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (exact) return current === target;

  // Match exact OR child routes
  return current === target || current.startsWith(target + "/");
};
