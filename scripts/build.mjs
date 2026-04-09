import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [, , pkgName, relOutFile] = process.argv;

if (!pkgName || !relOutFile) {
  console.error("usage: node scripts/build.mjs <pkg-name> <out-file>");
  process.exit(1);
}

const cwd = process.cwd();
const root = resolve(cwd, "../..");
const logFile = resolve(root, "build.log");
const outFile = resolve(cwd, relOutFile);
const start = new Date().toISOString();

await appendFile(logFile, `START ${start} ${pkgName} cwd=${cwd}\n`);
await new Promise((resolveDelay) => setTimeout(resolveDelay, 1200));
await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, `${pkgName} built at ${start}\n`, "utf8");
const end = new Date().toISOString();
await appendFile(logFile, `END   ${end} ${pkgName} cwd=${cwd}\n`);
