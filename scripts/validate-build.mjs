import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = join(projectRoot, "dist");
const errors = [];

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

function resolveOutputReference(value, htmlFile) {
  const cleanValue = value.split(/[?#]/)[0];
  if (!cleanValue || /^(https?:|mailto:|tel:|data:)/.test(cleanValue)) return null;

  let target = cleanValue.startsWith("/")
    ? join(outputRoot, cleanValue)
    : resolve(htmlFile, "..", cleanValue);

  if (cleanValue.endsWith("/")) target = join(target, "index.html");
  if (!extname(target) && !existsSync(target)) target = join(target, "index.html");
  return target;
}

if (!existsSync(outputRoot)) {
  errors.push("dist/ does not exist. Run npm run build first.");
} else {
  const files = collectFiles(outputRoot);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const canonicals = new Set();

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, "utf8");
    const outputPath = relative(outputRoot, htmlFile);
    const isEmbeddedReport = outputPath.startsWith(`reports${sep}`);

    if (isEmbeddedReport) {
      if (!/<meta name="robots" content="noindex, nofollow"\s*\/>/.test(html)) {
        errors.push(`${htmlFile} is missing the embedded-report robots directive.`);
      }
      if (!/<script(?:\s[^>]*)?>/.test(html)) {
        errors.push(`${htmlFile} does not contain its interactive report script.`);
      }
      continue;
    }

    const h1Count = (html.match(/<h1(?:\s[^>]*)?>/g) || []).length;
    if (h1Count !== 1) errors.push(`${htmlFile} has ${h1Count} h1 elements.`);
    if (!/<meta name="description" content="[^"]+">/.test(html)) {
      errors.push(`${htmlFile} is missing a meta description.`);
    }

    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
    if (!canonical?.startsWith("https://muskanroy.com/")) {
      errors.push(`${htmlFile} has an invalid canonical URL.`);
    } else if (canonicals.has(canonical)) {
      errors.push(`${htmlFile} duplicates canonical URL ${canonical}.`);
    } else {
      canonicals.add(canonical);
    }

    if (/resume|download resume|view resume|\.pdf|7303515104/i.test(html)) {
      errors.push(`${htmlFile} contains excluded private or résumé content.`);
    }

    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = resolveOutputReference(match[1], htmlFile);
      if (target && !existsSync(target)) {
        errors.push(`${htmlFile} references missing output ${match[1]}.`);
      }
    }
  }

  for (const requiredFile of ["CNAME", ".nojekyll", "robots.txt", "sitemap-index.xml"]) {
    if (!existsSync(join(outputRoot, requiredFile))) {
      errors.push(`dist/${requiredFile} is missing.`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Static build validation passed.");
