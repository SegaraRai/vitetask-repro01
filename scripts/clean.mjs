import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();

await rm(resolve(root, "build.log"), { force: true });
await rm(resolve(root, "apps", "app-a", "dist"), { force: true, recursive: true });
