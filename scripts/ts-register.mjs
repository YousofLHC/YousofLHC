/**
 * Registers a tiny resolve hook so Node's type-stripping loader can import
 * the repo's extensionless relative TypeScript imports
 * (e.g. `from "./auth"` → `./auth.ts`).
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(new URL("./ts-extension-hook.mjs", import.meta.url), pathToFileURL(import.meta.url));
