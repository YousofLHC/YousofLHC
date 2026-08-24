/** Resolve hook:
 *  1. extensionless relative imports hit their `.ts` file
 *  2. `next/headers` style subpaths fall back to their `.js` export
 */
export async function resolve(specifier, context, next) {
  if (
    specifier.startsWith(".") &&
    !/\.[cm]?js$/i.test(specifier) &&
    !/\.ts$/i.test(specifier)
  ) {
    try {
      return await next(specifier + ".ts", context);
    } catch {
      /* fall through */
    }
  }
  if (specifier.startsWith("next/") && !specifier.endsWith(".js")) {
    try {
      return await next(specifier + ".js", context);
    } catch {
      /* fall through */
    }
  }
  return next(specifier, context);
}
